const { Client, MessageEmbed } = require('discord.js-selfbot-v13');

const client = new Client({
    checkUpdate: false,
    patchVoice: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
});

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const OWNER_ID = '1369831885462835252';

const TARGET_ID = '1519372298476326922'; 
const DELETE_DELAY_MS = 30000; 

const STARRY_NAME = 'Starry™';
const WIDEKITA_URL = 'https://widekita.com';

// Hình đại diện mới của Clerk
const AVATAR_URL = 'https://i.ibb.co/9kMhVVFF/Untitled40-20260628203619.png';

// 4 Background/Thumbnail hiển thị ngẫu nhiên
const EMBED_IMAGES = [
    'https://images.steamusercontent.com/ugc/2462978499899794420/31183CA7507D6DFB6845952964B1262E55E58DDA/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
    'https://wallpapercave.com/wp/wp11817842.jpg',
    'https://wallpapercave.com/wp/wp11817820.jpg',
    'https://wallpapercave.com/wp/wp11817791.jpg'
];

// Tính cách Clerk: Thu ngân ngại ngùng, nhút nhát và kiệt sức
const ClerkLines = [
    "A-Ah... xin chào quý khách... quý khách cần gì ạ? (Thật sự muốn về nhà quá...)", 
    "X-Xin lỗi... tớ đang dọn dẹp chút... Cậu cứ từ từ xem menu nhé...", 
    "Kh-Khách mới ạ? V-Vâng, tớ ra ngay đây... (Lại thêm việc rồi...)", 
    "Ưm... menu ở trên bàn nhé... N-Nếu cần gì thì cứ gọi tớ... (Ngáp...)", 
    "Ch-Chào cậu... (Làm ơn đừng gọi món gì phức tạp nhé... tớ mệt lắm rồi...)"
];

const CashierThoughts = [
    "(Ước gì mình có thể tàng hình ngay lúc này...)", 
    "(Chỉ cần không ai bắt chuyện là được... ừm...)", 
    "(Mắt mình sắp nhíu lại rồi... n-nhưng phải cố thôi...)", 
    "(Nếu mình trốn dưới quầy thu ngân thì sao nhỉ... không được, sẽ bị mắng mất...)"
];

const squadStatuses = [
    "Clerk đang lén ngáp sau quầy thu ngân...", 
    "Clerk đang lẩm nhẩm đếm ngược từng phút đến giờ tan ca...", 
    "Clerk đang giật mình vì tiếng chuông cửa..."
];

let thoughtIndex = 0;
function rotateThought() { 
    const t = CashierThoughts[thoughtIndex]; 
    thoughtIndex = (thoughtIndex + 1) % CashierThoughts.length; 
    return t; 
}

// Thay đổi sang Separator Component thực sự (Type 9) của Discord API
function buildComponents() {
    return [
        {
            type: 1, // Action Row làm gốc
            components: [
                {
                    type: 9, // Type 9 chính là Separator Component mới
                    divider: true, // Hiển thị đường kẻ phân cách
                    spacing: 1 // 1 tương đương với "small" (0: none, 1: small, 2: large)
                }
            ]
        }
    ];
}

function buildEmbed(memberDisplayName) {
    const randomImage = EMBED_IMAGES[Math.floor(Math.random() * EMBED_IMAGES.length)];
    
    return new MessageEmbed()
        .setAuthor({ name: 'Clerk', icon_url: AVATAR_URL, url: WIDEKITA_URL })
        .setDescription(`**${memberDisplayName}** vừa đẩy cửa bước vào...\n\n_${ClerkLines[Math.floor(Math.random() * ClerkLines.length)]}_\n\n────────────────\n**💭 Suy nghĩ của Clerk:** _${rotateThought()}_\n**🎧 Trạng thái:** _${squadStatuses[Math.floor(Math.random() * squadStatuses.length)]}_`)
        .setImage(randomImage)
        .setColor(0x9AA2FF) 
        .setFooter({ text: 'Made with love • Team Starry™ x WutDaDev GitHub', iconURL: AVATAR_URL })
        .setTimestamp();
}

async function sendWebhook(member) {
    try {
        const response = await fetch(`${WEBHOOK_URL}?wait=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'Clerk',
                avatar_url: AVATAR_URL,
                content: `<@${member.id}>`, // Ping người dùng khi họ join phòng
                embeds: [buildEmbed(member.displayName)],
                components: buildComponents() // Gửi cấu trúc Separator mới
            })
        });

        if (response.ok) {
            const messageData = await response.json();

            setTimeout(async () => {
                try {
                    const textChannel = client.channels.cache.get(TARGET_ID);
                    if (textChannel) {
                        const msgToReject = await textChannel.messages.fetch(messageData.id);
                        if (msgToReject) await msgToReject.delete();
                    }
                } catch (deleteErr) {
                    console.error('Could not delete the webhook message.');
                }
            }, DELETE_DELAY_MS);
        }
    } catch (err) { 
        console.error('Webhook error:', err); 
    }
}

function checkChannelName() {
    const channel = client.channels.cache.get(TARGET_ID);
    if (channel && channel.name !== STARRY_NAME) {
        channel.setName(STARRY_NAME).catch(() => {});
    }
}

client.on('ready', () => {
    console.log('Clerk đã sẵn sàng... (thở dài)');
    setInterval(checkChannelName, 5 * 60 * 1000);
});

client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return;
    
    if (message.content.toLowerCase() === 'ahem' && message.author.id === OWNER_ID) {
        await message.delete().catch(() => {});
        const vc = message.member?.voice?.channel;
        if (vc) await vc.setName(STARRY_NAME).catch(() => {});
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const isTargetChannel = (newState.channelId === TARGET_ID);
    const wasTargetChannel = (oldState.channelId === TARGET_ID);

    if (isTargetChannel && newState.channel?.name !== STARRY_NAME) {
        await newState.channel.setName(STARRY_NAME).catch(() => {});
    }

    const joinedChannel = !wasTargetChannel && isTargetChannel;
    
    if (joinedChannel && !newState.member.user.bot) {
        await sendWebhook(newState.member);
    }
});

client.login(TOKEN);
