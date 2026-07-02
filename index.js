const { Client, MessageEmbed } = require('discord.js-selfbot-v13');

const client = new Client({
    checkUpdate: false,
    patchVoice: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
});

// Configuration
const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const VOICE_CHANNEL_ID = '1519372298476326922'; // Voice channel ID

// Set to 0 to disable auto-deletion for testing
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

    console.log(`📤 Attempting to send webhook for ${member.displayName}...`);

    try {
        const response = await fetch(`${WEBHOOK_URL}?wait=true`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
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
            console.error(`❌ Webhook failed with status ${response.status}: ${errorBody}`);
            return;
        }

        const messageData = await response.json();
        console.log(`✅ Webhook sent successfully! Message ID: ${messageData.id}`);

        // Auto-delete after delay
        if (DELETE_DELAY_MS > 0) {
            setTimeout(async () => {
                try {
                    const guild = client.guilds.cache.first();
                    if (guild) {
                        const channels = guild.channels.cache.filter(c => c.type === 'GUILD_TEXT');
                        for (const [, channel] of channels) {
                            try {
                                const msg = await channel.messages.fetch(messageData.id);
                                if (msg) {
                                    await msg.delete();
                                    console.log(`🗑️ Deleted webhook message after ${DELETE_DELAY_MS}ms`);
                                    return;
                                }
                            } catch {}
                        }
                    }
                } catch (e) { 
                    console.error('❌ Delete failed:', e.message); 
                }
            }, DELETE_DELAY_MS);
        }
    } catch (err) { 
        console.error('❌ Webhook error:', err); 
    }
}

client.on('ready', () => {
    console.log(`✅ Clerk đã sẵn sàng làm việc: ${client.user.tag}`);
    console.log(`📋 Voice Channel ID: ${VOICE_CHANNEL_ID}`);
    console.log(`🔗 Webhook URL set: ${WEBHOOK_URL ? 'Yes' : 'NO - THIS IS YOUR PROBLEM'}`);
    
    // Auto-rename on startup
    const channel = client.channels.cache.get(VOICE_CHANNEL_ID);
    if (channel && channel.name !== STARRY_NAME) {
        channel.setName(STARRY_NAME).then(() => {
            console.log(`🏷️ Auto-renamed channel to "${STARRY_NAME}" on startup`);
        }).catch(err => {
            console.error('❌ Failed to rename on startup:', err.message);
        });
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const isTargetChannel = (newState.channelId === VOICE_CHANNEL_ID || oldState.channelId === VOICE_CHANNEL_ID);
    if (!isTargetChannel) return;

    const joinedChannel = (oldState.channelId !== VOICE_CHANNEL_ID && newState.channelId === VOICE_CHANNEL_ID);
    
    console.log(`🎤 Voice update: ${newState.member?.displayName || 'Unknown'} | Joined target: ${joinedChannel}`);
    
    // Auto-rename if name is wrong
    if (newState.channelId === VOICE_CHANNEL_ID && newState.channel?.name !== STARRY_NAME) {
        await newState.channel.setName(STARRY_NAME).then(() => {
            console.log(`🏷️ Auto-renamed channel to "${STARRY_NAME}"`);
        }).catch(err => {
            console.error('❌ Rename failed:', err.message);
        });
    }

    // Send webhook when someone joins
    if (joinedChannel && !newState.member.user.bot) {
        console.log(`🚀 Triggering webhook for ${newState.member.displayName}`);
        await sendWebhook(newState.member);
    }
});

client.login(TOKEN).catch(err => {
    console.error('❌ Login failed:', err);
});
