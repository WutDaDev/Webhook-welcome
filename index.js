const { Client, MessageEmbed } = require('discord.js-selfbot-v13');

const client = new Client({
    checkUpdate: false,
    patchVoice: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
});

// ---------- CONFIG ----------
const TOKEN            = process.env.TOKEN;
const WEBHOOK_URL      = process.env.WEBHOOK_URL;
const OWNER_ID         = '1369831885462835252';
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;
const DELETE_DELAY_MS  = 18000;

const STARRY_NAME  = 'Starry™';
const WIDEKITA_URL = 'https://widekita.com';
const AVATAR_URL   = 'https://i.ibb.co/9kMhVVFF/Untitled40-20260628203619.png';
// ----------------------------

let webhookId = '', webhookToken = '';
try {
    const url   = new URL(WEBHOOK_URL);
    const parts = url.pathname.split('/');
    webhookId    = parts[parts.length - 2];
    webhookToken = parts[parts.length - 1];
} catch {}

// ---------- IMAGES ----------
const EMBED_IMAGES = [
    'https://images.steamusercontent.com/ugc/2462978499899794420/31183CA7507D6DFB6845952964B1262E55E58DDA/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
    'https://i.ibb.co/JRf3KggP/wp11817842.jpg',
    'https://i.ibb.co/TMcWbZb8/wp11817820.jpg',
    'https://i.ibb.co/BHTqmDjr/wp11817791.jpg'
];

// ---------- DIALOG ----------
const NijikaGreetings = [
    "Ê ê ê— **{name}** vào rồi nè!! (đập tay xuống quầy cái bốp) Ngồi đâu cũng được, mình lo hết!!",
    "OI OI OI!! **{name}** đến rồi~ (vẫy tay loạn xạ) Hôm nay quán đông ghê nhưng cứ vô tự nhiên nha!!",
    "**{name}**!! (giơ tay lên) Chờ xíu nha, mình đang... à xong rồi!! Vào đi vào đi!!",
    "Khách VIP đến rồi nè~ **{name}** hôm nay muốn gọi gì? Mình recommend cái mới của quán luôn!!",
    "Wah— **{name}** ghé thật sự á?! (suýt làm rơi cái gì đó) Ổn ổn mình không sao!! Vào đi!!",
    "**{name}** vào rồi à~ Trời ơi hôm nay đủ mặt hết rồi nè!! (vỗ tay cái bốp) Ngồi ngồi ngồi!!",
    "Heeey **{name}**!! Mình nhận ra bạn liền luôn!! (chỉ tay hào hứng) Chỗ quen vẫn còn trống nè~",
    "**{name}**— (quay đầu lại) Oa bạn đến thiệt!! Nhanh vào đi, mình đang giữ chỗ cho!!",
    "Này này— **{name}** kìa!! (gõ tay lên quầy liên hồi) Vào nhanh lên, quán sắp đông lắm rồi đó~",
    "**{name}**!! Đúng giờ ghê nha!! (nhảy lên một cái) Nijika đang trực hôm nay— phục vụ nhiệt tình lắm đó!!"
];

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

function formatGreeting(template, name) {
    return template.replace(/\{name\}/g, name);
}

// ---------- EMBED ----------
function buildEmbed(memberDisplayName) {
    const greeting = formatGreeting(pickRandom(NijikaGreetings), memberDisplayName);
    const timeVN   = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    return new MessageEmbed()
        .setAuthor({
            name: 'Nijika Ijichi · STARRY™',
            icon_url: AVATAR_URL,
            url: WIDEKITA_URL
        })
        .setDescription(greeting)
        .setImage(pickRandom(EMBED_IMAGES))
        .setColor(0xFFD166)
        .setFooter({
            text: `STARRY™ · Shimokitazawa · ${timeVN}`,
            iconURL: AVATAR_URL
        })
        .setTimestamp();
}

// ---------- WEBHOOK SEND ----------
async function postToWebhook(payload) {
    if (!WEBHOOK_URL) { console.log('❌ WEBHOOK_URL chưa set'); return null; }
    console.log('📤 Đang gửi webhook...');
    const res = await fetch(`${WEBHOOK_URL}?wait=true`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        console.error(`❌ Webhook thất bại (${res.status}): ${await res.text()}`);
        return null;
    }
    const data = await res.json();
    console.log(`✅ Webhook đã gửi (ID: ${data.id})`);
    return data;
}

// ---------- WEBHOOK DELETE ----------
async function deleteWebhookMessage(messageId) {
    if (!webhookId || !webhookToken) { console.log('❌ Không thể xóa: URL webhook lỗi'); return; }
    try {
        const res = await fetch(
            `https://discord.com/api/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
            { method: 'DELETE' }
        );
        if (res.ok) {
            console.log(`🗑️ Đã xóa tin nhắn (ID: ${messageId})`);
        } else {
            console.error(`❌ Xóa thất bại (${res.status}): ${await res.text()}`);
        }
    } catch (e) {
        console.error('Lỗi xóa:', e.message);
    }
}

// ---------- CHANNEL UTILS ----------
async function getVoiceChannel() {
    let ch = client.channels.cache.get(VOICE_CHANNEL_ID);
    if (!ch) {
        try {
            ch = await client.channels.fetch(VOICE_CHANNEL_ID);
            console.log(`✅ Đã fetch channel: ${ch.name}`);
        } catch (e) {
            console.error(`❌ Fetch channel thất bại: ${e.message}`);
            return null;
        }
    }
    return ch;
}

async function renameChannel(channel) {
    if (!channel || channel.name === STARRY_NAME) return;
    try {
        await channel.setName(STARRY_NAME);
        console.log(`✅ Đổi tên xong → "${STARRY_NAME}"`);
    } catch (e) {
        console.error('Lỗi đổi tên:', e.message);
    }
}

// ---------- MEMBER JOIN ----------
const knownMembers = new Set();
const processing   = new Set();

async function handleNewMember(member) {
    const id = member.id;
    if (knownMembers.has(id) || processing.has(id)) return;
    processing.add(id);
    try {
        if (knownMembers.has(id)) return;
        console.log(`🔔 Thành viên mới: ${member.displayName}`);
        const webhookData = await postToWebhook({
            username: 'Nijika Ijichi · STARRY',
            avatar_url: AVATAR_URL,
            content: `<@${id}>`,
            embeds: [buildEmbed(member.displayName)]
        });
        if (webhookData) {
            setTimeout(() => deleteWebhookMessage(webhookData.id), DELETE_DELAY_MS);
        }
        knownMembers.add(id);
    } finally {
        processing.delete(id);
    }
}

// ---------- POLLING ----------
async function pollVoiceChannel() {
    const ch = await getVoiceChannel();
    if (!ch || ch.type !== 'GUILD_VOICE') return;
    await renameChannel(ch);
    const members = ch.members.filter(m => !m.user.bot);
    for (const [, member] of members) {
        if (!knownMembers.has(member.id)) await handleNewMember(member);
    }
}

// ---------- EVENTS ----------
client.on('ready', async () => {
    console.log(`✅ Đăng nhập: ${client.user.tag}`);
    const ch = await getVoiceChannel();
    if (ch) {
        await renameChannel(ch);
        ch.members.filter(m => !m.user.bot).forEach(m => knownMembers.add(m.id));
        console.log(`👥 Thành viên ban đầu: ${knownMembers.size}`);
    }
    setInterval(() => getVoiceChannel().then(ch => ch && renameChannel(ch)), 30_000);
    setInterval(pollVoiceChannel, 10_000);
    console.log('🔄 Polling + rename check đang chạy');
});

client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return;
    if (message.content === '!test' && message.author.id === OWNER_ID) {
        knownMembers.delete(OWNER_ID);
        processing.delete(OWNER_ID);
        await handleNewMember({ id: OWNER_ID, displayName: message.author.username });
        await message.react('✅').catch(() => {});
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const relevant = newState.channelId === VOICE_CHANNEL_ID || oldState.channelId === VOICE_CHANNEL_ID;
    if (!relevant) return;
    const joined = oldState.channelId !== VOICE_CHANNEL_ID && newState.channelId === VOICE_CHANNEL_ID;
    if (oldState.channel) await renameChannel(oldState.channel);
    if (newState.channel) await renameChannel(newState.channel);
    if (joined && !newState.member.user.bot) await handleNewMember(newState.member);
});

client.login(TOKEN).catch(e => console.error('Đăng nhập thất bại:', e));
