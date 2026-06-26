const { Client, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js-selfbot-v13');
const client = new Client({
    checkUpdate: false,
    patchVoice: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
});

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const OWNER_ID = '1369831885462835252';
const TARGET_CHANNEL_NAME = "# 5 • 👥 Seika Ijichi's Channel";
const STARRY_NAME = 'Starry™';
const WIDEKITA_URL = 'https://widekita.com';

const BocchiWaiter = ["A... a... chào ạ! M-mời vào ạ...", "E-em... em phục vụ nước ở đây nhé...", "Chào... mừng...", "STARRY... chào...", "V-vâng, chào ạ..."];
const BocchiJokes = ["Tại sao Bocchi không chơi guitar ở bãi biển? Vì sợ cát vào đàn...", "Bocchi thấy có người lạ vẫy tay. Cô ấy vẫy lại... trong tưởng tượng.", "Bocchi: 'Mình ước mình là một cái kẹp tóc...'"];
const squadStatuses = ["Kessoku Band đang tập...", "Bocchi đang trốn trong thùng carton...", "Nijika đang dọn dẹp Starry..."];

let jokeIndex = 0;
function rotateJoke() { const j = BocchiJokes[jokeIndex]; jokeIndex = (jokeIndex + 1) % BocchiJokes.length; return j; }

function buildComponents() {
    return [new MessageActionRow().addComponents(
        new MessageButton().setLabel('──────────────────────────').setStyle('SECONDARY').setCustomId('sep_1').setDisabled(true)
    )];
}

function buildEmbed(memberDisplayName) {
    return new MessageEmbed()
        .setAuthor({ name: 'Hitori Gotoh (Bocchi) - Starry Bar', icon_url: 'https://i.ibb.co/LDYLdxzc/282817-panickedno.gif', url: WIDEKITA_URL })
        .setDescription(`**${memberDisplayName}** vừa đẩy cửa bước vào...\n\n_${BocchiWaiter[Math.floor(Math.random() * BocchiWaiter.length)]}_`)
        .setImage('https://images.steamusercontent.com/ugc/2462978499899794420/31183CA7507D6DFB6845952964B1262E55E58DDA/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true')
        .setColor(0xFF9AA2)
        .setFooter({ text: `Bocchi Corner: ${rotateJoke()} | ${squadStatuses[Math.floor(Math.random() * squadStatuses.length)]}`, iconURL: 'https://i.ibb.co/LDYLdxzc/282817-panickedno.gif' })
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
    } catch (err) { console.error(err); }
}

function checkChannelName() {
    client.guilds.cache.forEach(guild => {
        const channel = guild.channels.cache.find(c => c.name === TARGET_CHANNEL_NAME);
        if (channel && channel.name !== STARRY_NAME) channel.setName(STARRY_NAME).catch(() => {});
    });
}

client.on('ready', () => {
    console.log('Bocchi đã sẵn sàng!');
    setInterval(checkChannelName, 5 * 60 * 1000);
});

client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return;
    if (message.content.toLowerCase() === 'ahem' && message.author.id === OWNER_ID) {
        await message.delete().catch(() => {});
        const vc = message.member?.voice?.channel;
        if (vc) await vc.setName(STARRY_NAME);
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const vc = newState.channel || oldState.channel;
    if (vc && vc.name === TARGET_CHANNEL_NAME) await vc.setName(STARRY_NAME);
    if (!oldState.channelId && newState.channelId && !newState.member.user.bot) await sendWebhook(newState.member.displayName);
});

client.login(TOKEN);
