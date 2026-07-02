const { Client, MessageEmbed } = require('discord.js-selfbot-v13');

const client = new Client({
    checkUpdate: false,
    patchVoice: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    // 🔧 Fix: explicitly request necessary intents
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_VOICE_STATES',
        'MESSAGE_CONTENT'
    ]
});

// Configuration
const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const OWNER_ID = '1369831885462835252';

// 🔧 Separate voice and text channel IDs (they can't be the same in Discord)
const VOICE_CHANNEL_ID = '1519372298476326922';   // Voice channel for renames & join webhooks
const TEXT_CHANNEL_ID  = 'YOUR_TEXT_CHANNEL_ID'; // Text channel for the "ahem" command

// Set this to 0 or false to disable auto-deletion for testing
const DELETE_DELAY_MS = 30000;   // 30 seconds

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
    if (!WEBHOOK_URL) {
        console.log('❌ WEBHOOK_URL is not set!');
        return;
    }

    console.log(`📤 Sending webhook for ${member.displayName}...`);

    try {
        const response = await fetch(`${WEBHOOK_URL}?wait=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 🔧 Fix: proper User-Agent to avoid being blocked
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({
                username: 'Clerk',
                avatar_url: AVATAR_URL,
                content: `<@${member.id}>`,
                embeds: [buildEmbed(member.displayName)]
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`❌ Webhook failed: ${response.status} ${response.statusText}\nBody: ${errorBody}`);
            return;
        }

        const messageData = await response.json();
        console.log(`✅ Webhook sent (message ID: ${messageData.id})`);

        // Auto-delete only if DELETE_DELAY_MS > 0
        if (DELETE_DELAY_MS > 0) {
            setTimeout(async () => {
                try {
                    const textChannel = client.channels.cache.get(VOICE_CHANNEL_ID);
                    if (textChannel) {
                        const msg = await textChannel.messages.fetch(messageData.id);
                        if (msg) {
                            await msg.delete();
                            console.log(`🗑️ Deleted webhook message after ${DELETE_DELAY_MS}ms`);
                        }
                    }
                } catch (e) {
                    console.error('Delete failed:', e);
                }
            }, DELETE_DELAY_MS);
        }
    } catch (err) {
        console.error('❌ Webhook fetch error:', err);
    }
}

client.on('ready', () => {
    console.log(`✅ Clerk đã sẵn sàng làm việc: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    // Only respond to the "ahem" command in the dedicated text channel
    if (message.channel.id !== TEXT_CHANNEL_ID) return;

    if (message.author.id === OWNER_ID && message.content.toLowerCase() === 'ahem') {
        await message.delete().catch(() => {});
        const vc = message.member?.voice?.channel;
        if (vc && vc.id === VOICE_CHANNEL_ID) {
            await vc.setName(STARRY_NAME).catch(() => {});
            console.log(`🏷️ Voice channel renamed to "${STARRY_NAME}"`);
        }
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const isTargetChannel = (newState.channelId === VOICE_CHANNEL_ID || oldState.channelId === VOICE_CHANNEL_ID);
    if (!isTargetChannel) return;

    console.log(`🎤 Voice state update: ${oldState.member?.displayName || 'unknown'} moved from ${oldState.channelId} to ${newState.channelId}`);

    const joined = (oldState.channelId !== VOICE_CHANNEL_ID && newState.channelId === VOICE_CHANNEL_ID);

    // Rename the voice channel if needed
    if (newState.channelId === VOICE_CHANNEL_ID && newState.channel?.name !== STARRY_NAME) {
        await newState.channel.setName(STARRY_NAME).catch(() => {});
    }

    // Send webhook on join (ignore bots)
    if (joined && !newState.member.user.bot) {
        await sendWebhook(newState.member);
    }
});

client.login(TOKEN).catch(err => {
    console.error('❌ Login failed:', err);
});
