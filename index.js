const { Client, GatewayIntentBits, WebhookClient } = require('discord.js');

// Khởi tạo Client bot với quyền xem thành viên
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers 
    ] 
});

// Lấy thông tin từ Biến môi trường (Railway Variables)
const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL });

const Waiter = [
    "Chào mừng đến STARRY! Ngồi đâu tùy bạn nhé.",
    "STARRY chào bạn! Tận hưởng nhạc sống nhé!",
    "Konnichiwa! Chào mừng bạn đến với STARRY! ✨",
    "Chào! Đừng làm đổ bia là được, vào bàn đi.",
    "A... chào quý khách... chào mừng đến STARRY..."
];

client.once('ready', () => {
    console.log(`[READY] Waiter STARRY đang phục vụ tại: ${client.user.tag}`);
});

client.on('guildMemberAdd', member => {
    const randomGreeting = Waiter[Math.floor(Math.random() * Waiter.length)];
    
    webhookClient.send({
        content: `**[STARRY Waiter]:** ${randomGreeting} (Chào mừng ${member.user.toString()}!)`,
        username: 'Waiter STARRY',
        avatarURL: 'https://i.imgur.com/AfFp7pu.png'
    }).catch(err => console.error("Webhook Error:", err));
});

// Đăng nhập bằng Token bảo mật
client.login(process.env.BOT_TOKEN);
