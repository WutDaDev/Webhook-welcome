const { Client } = require('discord.js-selfbot-v13');
const client = new Client({
    checkUpdate: false,
    patchVoice: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
});

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

const Waiter = [
    "Hello Bro",
    "Lại thêm một ông nữa, vô bàn đi!",
    "Chào, uống gì gọi nhé.",
    "Bia đây, nhạc đây, quẩy thôi!",
    "Vào rồi đấy à? Ngồi đi.",
    "Starry Bar chào nhé, đừng làm ồn quá là được.",
    "Đến đúng lúc lắm, đang có nhạc hay.",
    "Nhạc lên, ngồi xuống, chill thôi."
];

const bandColors = [0xFF9AA2, 0xFFE082, 0x82B1FF, 0xFF8A80];

client.on('ready', () => {
    console.log(`[READY] Starry Bar đã mở cửa: ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (!oldState.channelId && newState.channelId && !newState.member.user.bot) {
        
        const randomGreeting = Waiter[Math.floor(Math.random() * Waiter.length)];
        const randomColor = bandColors[Math.floor(Math.random() * bandColors.length)];

        try {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'Bocchi Waiter',
                    avatarURL: 'https://i.ibb.co/LDYLdxzc/282817-panickedno.gif',
                    embeds: [{
                        author: { name: 'Bocchi Waiter', icon_url: 'https://i.ibb.co/LDYLdxzc/282817-panickedno.gif' },
                        description: `**${newState.member.displayName}**\n${randomGreeting}`,
                        image: { url: 'https://images.steamusercontent.com/ugc/2462978499899794420/31183CA7507D6DFB6845952964B1262E55E58DDA/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true' },
                        color: randomColor
                    }],
                    components: [{
                        type: 1,
                        components: [
                            { type: 2, style: 2, label: "Gọi đồ uống", custom_id: "order_drink" },
                            { type: 2, style: 5, label: "Menu Nhạc", url: "https://www.google.com" }
                        ]
                    }]
                })
            });
        } catch (err) {
            console.error("[ERROR] Webhook failed:", err);
        }
    }
});

client.login(TOKEN);
