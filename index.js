const { Client, MessageEmbed } = require('discord.js-selfbot-v13');

const client = new Client({
    checkUpdate: false,
    patchVoice: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
});

// Configuration
const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const OWNER_ID = '1369831885462835252';
const TARGET_ID = '1519372298476326922'; 
const DELETE_DELAY_MS = 30000; 

const STARRY_NAME = 'Starry™';
const WIDEKITA_URL = 'https://widekita.com';
const AVATAR_URL = 'https://i.ibb.co/9kMhVVFF/Untitled40-20260628203619.png';

const EMBED_IMAGES = [
    'https://images.steamusercontent.com/ugc/2462978499899794420/31183CA7507D6DFB6845952964B1262E55E58DDA/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
    'https://i.ibb.co/JRf3KggP/wp11817842.jpg',
    'https://i.ibb.co/TMcWbZb8/wp11817820.jpg',
    'https://i.ibb.co/BHTqmDjr/wp11817791.jpg'
];

const ClerkLines = [
    "Chào mừng đến Starry... (lấy tay xoa thái dương)... bạn muốn gọi gì? Nhanh giúp mình nhé, mình hơi... không được khỏe.",
    "Bảng giá ở kia. Mình... mình xin lỗi, mình không nhớ rõ món đặc biệt hôm nay là gì nữa. Lát mình hỏi quản lý cho.",
    "Tiếng nhạc... mình biết là nó hơi to. Mình cũng đang cố chịu đựng đây. Đừng... đừng phàn nàn với mình nhé.",
    "Đây, đồ của bạn. (đẩy ly nước ra, tay hơi run)... Làm ơn cẩn thận, mình... mình không muốn có thêm sự cố nào nữa đâu.",
    "Nếu thấy mình biến mất sau quầy... thì là mình đang đi lấy thêm đá thôi. Đừng... đừng đi tìm mình."
];

const CashierThoughts = [
    "(Chỉ cần 2 tiếng nữa... mình chỉ cần đứng đây thêm 2 tiếng nữa thôi là được về.)",
    "(Đừng nhìn mình như thế... mình biết là mình trông tệ lắm rồi, không cần phải nhắc đâu.)",
    "(Nếu mình bỏ chạy ngay bây giờ, liệu có ai đuổi theo không? Chắc là có. Chết tiệt.)",
    "(Tại sao hôm nay khách lại đông lạ thường thế này... mình cần không gian yên tĩnh.)"
];

const squadStatuses = [
    "Clerk đang gục đầu vào quầy, cố lấy lại bình tĩnh...",
    "Clerk đang kiểm tra danh sách đồ uống với đôi mắt đỏ hoe vì mệt...",
    "Clerk đang lách người vào góc tối nhất của quầy bar để thở..."
];

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
let thoughtIndex = 0;
function rotateThought() { 
    const t = CashierThoughts[thoughtIndex]; 
    thoughtIndex = (thoughtIndex + 1) % CashierThoughts.length; 
    return t; 
}

function buildEmbed(memberDisplayName) {
    return new MessageEmbed()
        .setAuthor({ name: 'Clerk', icon_url: AVATAR_URL, url: WIDEKITA_URL })
        .setDescription(`**${memberDisplayName}** !!\n\n_${pickRandom(ClerkLines)}_\n\n────────────────\n** Clerk mind:** _${rotateThought()}_`)
        .setImage(pickRandom(EMBED_IMAGES))
        .setColor(0x9AA2FF) 
        .setFooter({ text: 'Made with love • Team Starry™ x WutDaDev GitHub', iconURL: AVATAR_URL })
        .setTimestamp();
}

async function sendWebhook(member) {
    if (!WEBHOOK_URL) return;

    try {
        const response = await fetch(`${WEBHOOK_URL}?wait=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'Clerk',
                avatar_url: AVATAR_URL,
                content: `<@${member.id}>`, 
                embeds: [buildEmbed(member.displayName)]
            })
        });

        if (response.ok) {
            const messageData = await response.json();
            setTimeout(async () => {
                try {
                    const textChannel = client.channels.cache.get(TARGET_ID);
                    if (textChannel) {
                        const msg = await textChannel.messages.fetch(messageData.id);
                        if (msg) await msg.delete();
                    }
                } catch (e) { console.error('Delete failed:', e); }
            }, DELETE_DELAY_MS);
        }
    } catch (err) { console.error('Webhook error:', err); }
}

client.on('ready', () => {
    console.log(`Clerk đã sẵn sàng làm việc: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    // Only respond if the message is in the target channel
    if (message.channel.id !== TARGET_ID) return;
    
    if (message.author.id !== client.user.id && message.content.toLowerCase() === 'ahem' && message.author.id === OWNER_ID) {
        await message.delete().catch(() => {});
        const vc = message.member?.voice?.channel;
        if (vc && vc.id === TARGET_ID) {
            await vc.setName(STARRY_NAME).catch(() => {});
        }
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    // Only proceed if the event involves the target channel
    const isTargetChannel = (newState.channelId === TARGET_ID || oldState.channelId === TARGET_ID);
    if (!isTargetChannel) return;

    const joinedChannel = (oldState.channelId !== TARGET_ID && newState.channelId === TARGET_ID);
    
    // Rename logic
    if (newState.channelId === TARGET_ID && newState.channel?.name !== STARRY_NAME) {
        await newState.channel.setName(STARRY_NAME).catch(() => {});
    }

    // Webhook logic
    if (joinedChannel && !newState.member.user.bot) {
        await sendWebhook(newState.member);
    }
});

client.login(TOKEN);
