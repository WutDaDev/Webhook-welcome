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
const VOICE_CHANNEL_ID = '1521700647114903662';
const DELETE_DELAY_MS = 15000;   // 15 seconds

const STARRY_NAME = 'Starry™';
const WIDEKITA_URL = 'https://widekita.com';
const AVATAR_URL = 'https://i.ibb.co/9kMhVVFF/Untitled40-20260628203619.png';
// -----------------------------

// Parse webhook URL for deletion
let webhookId = '', webhookToken = '';
try {
    const url = new URL(WEBHOOK_URL);
    const parts = url.pathname.split('/');
    webhookId = parts[parts.length - 2];
    webhookToken = parts[parts.length - 1];
} catch {}

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

// ---------- UTILITY ----------
async function getVoiceChannel() {
    let channel = client.channels.cache.get(VOICE_CHANNEL_ID);
    if (!channel) {
        try {
            console.log(`🔍 Channel not in cache, fetching...`);
            channel = await client.channels.fetch(VOICE_CHANNEL_ID);
            console.log(`✅ Fetched channel: ${channel.name}`);
        } catch (e) {
            console.error(`❌ Failed to fetch voice channel: ${e.message}`);
            return null;
        }
    }
    return channel;
}

// ---------- RENAME ----------
async function renameChannel(channel) {
    if (!channel || channel.name === STARRY_NAME) return;
    try {
        console.log(`🔄 Renaming "${channel.name}" → "${STARRY_NAME}"`);
        await channel.setName(STARRY_NAME);
        console.log(`✅ Rename done`);
    } catch (e) {
        console.error('Rename error:', e.message);
    }
}

async function periodicRenameCheck() {
    const channel = await getVoiceChannel();
    if (channel) await renameChannel(channel);
}

// ---------- WEBHOOK DELETE (via webhook's own token) ----------
async function deleteWebhookMessage(messageId) {
    if (!webhookId || !webhookToken) {
        console.log('❌ Cannot delete: webhook URL not parsed');
        return;
    }
    try {
        const res = await fetch(
            `https://discord.com/api/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
            { method: 'DELETE' }
        );
        if (res.ok) {
            console.log(`🗑️ Deleted webhook message (ID: ${messageId})`);
        } else {
            console.error(`❌ Delete failed (${res.status}): ${await res.text()}`);
        }
    } catch (e) {
        console.error('Delete error:', e.message);
    }
}

// ---------- WEBHOOK SEND ----------
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

// ---------- DEDUPLICATED JOIN HANDLING ----------
const knownMembers = new Set();        // already welcomed
const processing = new Set();          // currently sending webhook (race guard)

async function handleNewMember(member) {
    const id = member.id;

    // Already welcomed → skip
    if (knownMembers.has(id)) return;

    // If another process is already handling this member, skip
    if (processing.has(id)) return;
    processing.add(id);

    try {
        // Double-check inside the lock
        if (knownMembers.has(id)) return;

        console.log(`🔔 New member: ${member.displayName}`);
        const webhookData = await postToWebhook({
            username: 'Clerk',
            avatar_url: AVATAR_URL,
            content: `<@${id}>`,
            embeds: [buildEmbed(member.displayName)]
        });

        if (webhookData) {
            // Schedule deletion
            setTimeout(() => deleteWebhookMessage(webhookData.id), DELETE_DELAY_MS);
        }

        // Mark as done
        knownMembers.add(id);
    } finally {
        processing.delete(id);
    }
}

// ---------- POLLING ----------
async function pollVoiceChannel() {
    const channel = await getVoiceChannel();
    if (!channel || channel.type !== 'GUILD_VOICE') return;
    await renameChannel(channel);

    const members = channel.members.filter(m => !m.user.bot);
    for (const [, member] of members) {
        if (!knownMembers.has(member.id)) {
            await handleNewMember(member);
        }
    }
}

// ---------- EVENTS ----------
client.on('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    const channel = await getVoiceChannel();
    if (channel) {
        await renameChannel(channel);
        // Pre-load existing members so they don't trigger on first poll
        channel.members.filter(m => !m.user.bot).forEach(m => knownMembers.add(m.id));
        console.log(`👥 Initial members: ${knownMembers.size}`);
    }

    setInterval(periodicRenameCheck, 30000);
    console.log('🔄 Started 30‑second rename check');

    setInterval(pollVoiceChannel, 10000);
    console.log('🔄 Started 10‑second voice channel polling');
});

client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return;
    
    // ---------- !test command (simulates a real join using owner's ID) ----------
    if (message.content === '!test' && message.author.id === OWNER_ID) {
        console.log(`🧪 Test join triggered by ${message.author.tag}`);
        
        // Create a mock member object so the same join logic is used
        const testMember = {
            id: OWNER_ID,
            displayName: message.author.username   // or any test name
        };
        
        // Bypass knownMembers for testing (so it always sends)
        knownMembers.delete(OWNER_ID);
        processing.delete(OWNER_ID);
        
        // Send the join webhook exactly like a real new member
        await handleNewMember(testMember);
        await message.react('✅').catch(() => {});
        return;
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const relevant = newState.channelId === VOICE_CHANNEL_ID || oldState.channelId === VOICE_CHANNEL_ID;
    if (!relevant) return;

    const joined = oldState.channelId !== VOICE_CHANNEL_ID && newState.channelId === VOICE_CHANNEL_ID;

    // Rename if needed
    if (oldState.channelId === VOICE_CHANNEL_ID && oldState.channel) await renameChannel(oldState.channel);
    if (newState.channelId === VOICE_CHANNEL_ID && newState.channel) await renameChannel(newState.channel);

    if (joined && !newState.member.user.bot) {
        await handleNewMember(newState.member);
    }
});

client.login(TOKEN).catch(e => console.error('Login failed:', e));
