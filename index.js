const Discord = require('discord.js-selfbot-v13');
const { Client, MessageEmbed, MessageActionRow, MessageButton } = Discord;

const client = new Client({
    checkUpdate: false,
    patchVoice: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
});

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const OWNER_ID = '1369831885462835252';
const PING_TARGET_ID = '411916947773587456';

const TARGET_CHANNEL_NAME = "# 5 • 👥 Team Starry's Channel";
const STARRY_NAME = 'Starry™';
const WIDEKITA_URL = 'https://widekita.com';

const BocchiWaiter = [
    "A... a... chào ạ! M-mời vào ạ...", "E-em... em phục vụ nước ở đây nhé...", "Chào... mừng... mong quý khách đừng làm ồn ạ...",
    "K-không biết có làm gì sai không... m-mời ngồi ạ...", "STARRY... chào... dạ em hơi run...", "V-vâng, chào ạ... gọi món thì... gọi em nhé...",
    "Nhạc... nhạc đang lên đấy ạ... m-mời vào ạ...", "E-em là nhân viên mới... chào ạ...", "Ư-ưm... chào quý khách... em là Bocchi...",
    "Mình mặc đồng phục ổn không ạ...? Chào mừng ạ...", "A... có khách! E-em xin chào...", "Ch-chào ạ... em sẽ cố gắng phục vụ tốt ạ...",
    "Hức... có khách đông quá... ch-chào mừng ạ...", "Dạ... chào quý khách... nếu cần gì cứ gọi em...", "C-cảm ơn vì đã ghé... em run quá...",
    "E-em xin phép... phục vụ quý khách...", "A... chào ạ... mong quý khách đừng chú ý đến em nhiều quá ạ...", "M-mời... mời vào ạ..."
];

const BocchiJokes = [
    "Tại sao Bocchi không chơi guitar ở bãi biển? Vì sợ cát vào đàn...", "Bocchi: 'Mình ước mình là một cái kẹp tóc... ít nhất cũng có đôi có cặp.'",
    "Ryo: 'Tao không có tiền.' Bocchi: 'Same, nhưng tao không có tiền VÀ không có bạn.'", "Số bạn thân của Bocchi = số lần cô ấy dám nhìn thẳng vào mắt người lạ = 0.",
    "Bocchi khi ai đó nhìn mình: *hệ thống tắt nguồn*", "Bocchi mua một cuốn sách 'Làm sao để tự tin'. Đọc xong, cô ấy ngại luôn cả cuốn sách.",
    "Bocchi không sợ ma. Ma mới là đứa sợ Bocchi vì độ kỳ lạ của cô ấy.", "Bocchi thấy có người lạ vẫy tay với mình. Cô ấy vẫy lại... trong tưởng tượng.",
    "Bocchi mơ được nổi tiếng. Tỉnh dậy thấy vẫn ngồi trong góc tối. À, như mọi khi."
];

const squadStatuses = [
    "Kessoku Band đang tập...", "Bocchi đang trốn trong thùng carton...",
    "Nijika đang dọn dẹp Starry...", "Ryo đang vò vẻ tìm tiền...",
    "Kita đang chụp ảnh...", "Bocchi đang xoay vòng vòng..."
];

const bandColors = [0xFF9AA2, 0xFFE082, 0x82B1FF, 0xFF8A80, 0xB39DDB, 0xA5D6A7];
let jokeIndex = 0;
function rotateJoke() { const j = BocchiJokes[jokeIndex]; jokeIndex = (jokeIndex + 1) % BocchiJokes.length; return j; }

async function notifyOwner(content) { try { const owner = await client.users.fetch(OWNER_ID); await owner.send(content); } catch (e) {} }

function buildComponents() {
    const separatorRow = new MessageActionRow().addComponents(
        new MessageButton().setLabel('──────────────────────────').setStyle('SECONDARY').setCustomId('sep_1').setDisabled(true)
    );
    return [separatorRow];
}

function buildEmbed(memberDisplayName) {
    return new MessageEmbed()
        .setAuthor({ name: 'Hitori Gotoh (Bocchi) - Starry Bar', icon_url: 'https://i.ibb.co/LDYLdxzc/282817-panickedno.gif', url: WIDEKITA_URL })
        .setDescription(`**${memberDisplayName}** vừa đẩy cửa bước vào...\n\n_${BocchiWaiter[Math.floor(Math.random() * BocchiWaiter.length)]}_`)
        .setImage('https://images.steamusercontent.com/ugc/2462978499899794420/31183CA7507D6DFB6845952964B1262E55E58DDA/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true')
        .setColor(bandColors[Math.floor(Math.random() * bandColors.length)])
        .setFooter({ text: `Bocchi Corner: ${rotateJoke()}`, iconURL: 'https://i.ibb.co/LDYLdxzc/282817-panickedno.gif' })
        .setTimestamp();
}

async function sendWebhook(memberDisplayName) {
    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'Bocchi Waiter - Starry',
                avatar_url: 'https://i.ibb.co/LDYLdxzc/282817-panickedno.gif',
                embeds: [buildEmbed(memberDisplayName)],
                components: buildComponents()
            })
        });
    } catch (err) { await notifyOwner('[LỖI WEBHOOK] ' + err.message); }
}

client.on('ready', () => { console.log('[READY] Bocchi đã sẵn sàng!'); });

client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return;
    if (message.author.id === OWNER_ID && message.content.includes(PING_TARGET_ID)) await message.reply('yes');
    if (message.content.toLowerCase() === 'ahem' && message.author.id === OWNER_ID) {
        await message.delete().catch(() => {});
        const vc = message.member?.voice?.channel;
        if (vc) {
            await vc.setName(STARRY_NAME);
            await vc.send('v/rename ' + STARRY_NAME).catch(() => {});
        }
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const vc = newState.channel || oldState.channel;
    if (vc && vc.name === TARGET_CHANNEL_NAME) {
        await vc.setName(STARRY_NAME);
        await vc.send('v/rename ' + STARRY_NAME).catch(() => {});
    }
    if (!oldState.channelId && newState.channelId && !newState.member.user.bot) await sendWebhook(newState.member.displayName);
});

client.login(TOKEN);
