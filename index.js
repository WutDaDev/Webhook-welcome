const { Client, MessageEmbed } = require('discord.js-selfbot-v13');

const client = new Client({
    checkUpdate: false,
    patchVoice: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
});

// ---------- CONFIG ----------
const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const OWNER_ID = '1369831885462835252';
const VOICE_CHANNEL_ID = '1519372298476326922';   // Voice channel to monitor
const DELETE_DELAY_MS = 30000;                    // 30 sec auto‑delete (set to 0 to disable)

const STARRY_NAME = 'Starry™';
const WIDEKITA_URL = 'https://widekita.com';
const AVATAR_URL = 'https://i.ibb.co/9kMhVVFF/Untitled40-20260628203619.png';
// -----------------------------

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

// ---------- RENAME LOGIC ----------
async function renameChannel(channel) {
    if (!channel || channel.name === STARRY_NAME) return;
    console.log(`🔄 Renaming "${channel.name}" → "${STARRY_NAME}"`);
    await channel.setName(STARRY_NAME);
    console.log(`✅ Rename done`);
}

// Periodic check (every 30 sec) to fix name if someone changes it
async function periodicRenameCheck() {
    try {
        const ch = client.channels.cache.get(VOICE_CHANNEL_ID);
        if (ch && ch.name !== STARRY_NAME) {
            await renameChannel(ch);
        }
    } catch (e) {
        console.error('Periodic rename check error:', e.message);
    }
}

// ---------- WEBHOOK LOGIC ----------
async function postToWebhook(payload) {
    if (!WEBHOOK_URL) {
        console.log('❌ WEBHOOK_URL not set');
        return null;
    }
    console.log('📤 Sending webhook...');
    const res = await fetch(`${WEBHOOK_URL}?wait=true`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const errBody = await res.text();
        console.error(`❌ Webhook failed (${res.status}): ${errBody}`);
        return null;
    }
    const data = await res.json();
    console.log(`✅ Webhook sent (ID: ${data.id})`);
    return data;
}

async function sendJoinWebhook(member) {
    const payload = {
        username: 'Clerk',
        avatar_url: AVATAR_URL,
        content: `<@${member.id}>`,
        embeds: [buildEmbed(member.displayName)]
    };
    const data = await postToWebhook(payload);
    if (data && DELETE_DELAY_MS > 0) {
        setTimeout(async () => {
            try {
                // Try to delete the webhook message from any text channel
                const guild = client.guilds.cache.first();
                if (!guild) return;
                for (const [, ch] of guild.channels.cache.filter(c => c.type === 'GUILD_TEXT')) {
                    try {
                        const msg = await ch.messages.fetch(data.id);
                        if (msg) { await msg.delete(); break; }
                    } catch {}
                }
            } catch (e) {
                console.error('Delete failed:', e.message);
            }
        }, DELETE_DELAY_MS);
    }
}

// ---------- TEST COMMAND (Owner only) ----------
async function sendTestWebhook() {
    const testEmbed = new MessageEmbed()
        .setAuthor({ name: 'Clerk', icon_url: AVATAR_URL, url: WIDEKITA_URL })
        .setDescription('**🧪 Test successful!**\nWebhook is working correctly.')
        .setColor(0x00FF00)
        .setTimestamp();
    const payload = {
        username: 'Clerk',
        avatar_url: AVATAR_URL,
        content: 'This is a test message.',
        embeds: [testEmbed]
    };
    const data = await postToWebhook(payload);
    if (data) {
        // Optionally delete the test message after a few seconds
        setTimeout(async () => {
            try {
                const guild = client.guilds.cache.first();
                if (!guild) return;
                for (const [, ch] of guild.channels.cache.filter(c => c.type === 'GUILD_TEXT')) {
                    try {
                        const msg = await ch.messages.fetch(data.id);
                        if (msg) { await msg.delete(); break; }
                    } catch {}
                }
            } catch {}
        }, 10000); // 10 sec
    }
}

// ---------- EVENTS ----------
client.on('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    // Initial rename
    const ch = client.channels.cache.get(VOICE_CHANNEL_ID);
    if (ch) {
        renameChannel(ch);
    } else {
        console.log('❌ Voice channel not found – check VOICE_CHANNEL_ID');
    }
    // Start periodic rename checks
    setInterval(periodicRenameCheck, 30000);
    console.log('🔄 Started 30‑second rename check');
});

client.on('messageCreate', async (message) => {
    // Ignore own messages
    if (message.author.id === client.user.id) return;

    // !test command – only owner can trigger
    if (message.content === '!test' && message.author.id === OWNER_ID) {
        console.log(`🧪 Test command triggered by ${message.author.tag}`);
        await sendTestWebhook();
        // Optionally react to confirm
        await message.react('✅').catch(() => {});
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const relevant = newState.channelId === VOICE_CHANNEL_ID || oldState.channelId === VOICE_CHANNEL_ID;
    if (!relevant) return;

    const joined = oldState.channelId !== VOICE_CHANNEL_ID && newState.channelId === VOICE_CHANNEL_ID;

    // Fix name if needed (both in old and new channel)
    if (oldState.channelId === VOICE_CHANNEL_ID && oldState.channel) await renameChannel(oldState.channel);
    if (newState.channelId === VOICE_CHANNEL_ID && newState.channel) await renameChannel(newState.channel);

    // Send webhook on join
    if (joined && !newState.member.user.bot) {
        await sendJoinWebhook(newState.member);
    }
});

client.login(TOKEN).catch(e => console.error('Login failed:', e));
