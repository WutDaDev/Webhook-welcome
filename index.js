const Discord = require('discord.js-selfbot-v13');
const { Client, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = Discord;

const client = new Client({
    checkUpdate: false,
    patchVoice: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/126.0.0.0'
});

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const OWNER_ID = '1369831885462835252';
const PING_TARGET_ID = '411916947773587456';
const TARGET_CHANNEL_NAME = "# 5 • 👥 Seika Ijichi's Channel";
const STARRY_NAME = 'Starry(tm)';
const WIDEKITA_URL = 'https://widekita.com';

/* ===================================================================
   LỜI CHÀO CỦA BOCCHI
   =================================================================== */
const BocchiWaiter = [
    "A... a... chào ạ! M-mời vào ạ...",
    "E-em... em phục vụ nước ở đây nhé... đừng nhìn em...",
    "Chào... mừng... mong quý khách đừng làm ồn ạ...",
    "K-không biết có làm gì sai không... m-mời ngồi ạ...",
    "STARRY... chào... dạ em hơi run...",
    "V-vâng, chào ạ... gọi món thì... gọi em nhé...",
    "Nhạc... nhạc đang lên đấy ạ... m-mời vào ạ...",
    "E-em là nhân viên mới... chào ạ...",
    "Ư-ưm... chào quý khách... em là Bocchi... Hitori... Gotoh... ạ...",
    "Mình mặc đồng phục ổn không ạ...? Chào mừng ạ...",
    "A... có khách! E-em xin chào... ngồi chỗ nào cũng được ạ...",
    "Ch-chào ạ... em sẽ cố gắng phục vụ tốt ạ...",
    "Hức... có khách đông quá... ch-chào mừng ạ...",
    "Dạ... chào quý khách... nếu cần gì cứ gọi em... nhẹ nhàng thôi ạ...",
    "C-cảm ơn vì đã ghé... em run quá... mời vào ạ...",
    "E-em xin phép... phục vụ quý khách... từ từ thôi ạ...",
    "A... chào ạ... mong quý khách đừng chú ý đến em nhiều quá ạ...",
    "M-mời... mời vào ạ... em sẽ đứng ở góc xa xa thôi ạ...",
];

/* ===================================================================
   TRUYỆN CƯỜI BOCCHI STYLE
   =================================================================== */
const BocchiJokes = [
    "Tại sao Bocchi không chơi guitar ở bãi biển? Vì sợ cát vào đàn... và vào mắt người ta nhìn mình!",
    "Bocchi: 'Mình ước mình là một cái kẹp tóc... ít nhất cũng có đôi có cặp.'",
    "Ryo: 'Tao không có tiền.' Bocchi: 'Same, nhưng tao không có tiền VÀ không có bạn.'",
    "Nijika bảo Bocchi đi giao lưu, Bocchi nói: 'Giao lưu hay giao nộp đây ạ?'",
    "Số bạn thân của Bocchi = số lần cô ấy dám nhìn thẳng vào mắt người lạ = 0.",
    "Bocchi tập chơi guitar 8 tiếng/ngày. Còn giao tiếp xã hội? 0 giây.",
    "Một ngày của Bocchi: Lo lắng, đỏ mặt, run rẩy, tự kỷ, lẩm bẩm, lặp lại.",
    "Bocchi khi ai đó nhìn mình: *hệ thống tắt nguồn*",
    "Bocchi mua một cuốn sách 'Làm sao để tự tin'. Đọc xong, cô ấy ngại luôn cả cuốn sách.",
    "Kita: 'Senpai, chơi guitar cho em nghe đi!' Bocchi: *biến thành cầu vồng rồi tan biến*",
    "Bocchi không sợ ma. Ma mới là đứa sợ Bocchi vì độ kỳ lạ của cô ấy.",
    "Ryo nợ Bocchi 500 yên. Bocchi bảo: 'K-không sao... em quen bị xem thường rồi...'",
    "3 điều Bocchi ghét nhất: 1. Đám đông 2. Nói chuyện 3. Bản thân mình.",
    "Bocchi trong game: chọn class 'Sát Thủ' để khỏi phải nói chuyện với đồng đội.",
    "Bocchi luyện nói trước gương. Gương nứt. Cảm xúc cũng nứt theo.",
    "Bocchi thấy có người lạ vẫy tay với mình. Cô ấy vẫy lại... trong tưởng tượng.",
    "Nijika: 'Mày có ổn không?' Bocchi: 'Ý tao là... về mặt tồn tại hay về mặt xã hội ạ?'",
    "Bocchi mơ được nổi tiếng. Tỉnh dậy thấy vẫn ngồi trong góc tối. À, như mọi khi.",
    "Cách Bocchi đối phó với drama: lặn mất tăm 3 ngày, quay lại như không có gì.",
    "Kita hát 'Kessoku Band tuyệt vời nhất!' Bocchi đứng góc run bần bật đồng ý.",
    "Bocchi bước vào quán. Ai đó nhìn. Cô ấy bước ra khỏi quán. Hết.",
    "Ryo mượn tiền Bocchi mua dây đàn. Bocchi: 'C-của em... cũng là của chị... ạ...'",
    "Bocchi được khen đàn hay. Cô ấy biến mất trong 3... 2... 1...",
    "Level xã hội của Bocchi: còn thua cả cái micro trong phòng tập.",
    "Bocchi tập nói 'Xin chào' trước gương 50 lần. Ra ngoài nói thành 'X-xin... ch-ch... cứu em...'",
    "Bocchi khi nhắn tin: soạn xong -> xóa -> soạn lại -> xóa -> tắt điện thoại -> khóc.",
    "Bocchi: 'Em không ngại đâu ạ' — nói xong đâm đầu vào tường.",
    "Ryo nợ cả thế giới. Bocchi nợ cả thế giới + sự tự tin.",
    "Nếu cuộc đời là game, Bocchi chọn nhân vật ở chế độ 'không NPC nào nói chuyện với mình'.",
    "Bocchi thấy Kita cười với mình. 2 tiếng sau vẫn còn đỏ mặt."
];

/* ===================================================================
   TRẠNG THÁI BAND
   =================================================================== */
const squadStatuses = [
    "Kessoku Band đang tập 'Guitar to Loneliness and Blue Planet'...",
    "Bocchi đang trốn trong thùng carton ở góc sân khấu...",
    "Nijika đang cười tươi dọn dẹp Starry...",
    "Ryo đang vò vẻ tìm tiền mua bass mới...",
    "Kita đang chụp ảnh sống ảo trên sân khấu...",
    "Bocchi đang xoay vòng vòng vì bị ai đó khen...",
    "Ryo đang tính tiền nước... rồi xin đểu thêm...",
    "Nijika đang động viên Bocchi: 'Mày làm được mà!'",
    "Kita đang chọn góc chụp hoàn hảo cho Instagram...",
    "Bocchi đang shred độc tấu — nhưng chỉ khi không ai nhìn...",
    "Seika đang quản lý quầy bar, mệt mỏi vì đám nhạc công...",
    "Bocchi thấy có người lạ vào quán, co rúm lại...",
    "Nijika đập trống — 'Nhiệt huyết lên nào các cậu!'",
    "Ryo lặng lẽ ăn mì, không mời ai hết...",
    "Kita đang livestream: 'Starry hôm nay đông vãi!'",
    "Kessoku Band đang jam thử bài mới... nghe cũng được phết!",
    "Bocchi giả vờ đi vệ sinh để khỏi chào khách... lần thứ 5.",
    "Nijika đang lau dọn, vừa làm vừa hát... năng lượng dương cực đại.",
    "Ryo: 'Cho tao vay 1000 yên, mai trả.' (Không bao giờ trả)",
    "Kita hét lớn: 'Bocchi-senpai! Cố lên!' — Bocchi suýt ngất.",
    "Seika đang pha chế, mồ hôi nhễ nhại, chửi thầm trong bụng.",
    "Bocchi đeo tai nghe, giả vờ không nghe thấy tiếng gọi của Nijika.",
    "Ryo đang viết lời bài hát mới. Nội dung: xin tiền.",
    "Kita làm đổ nước. Cười trừ. 'Ehe~'",
    "Bocchi nhìn mưa ngoài cửa sổ... 'Ước gì mình tan biến như hạt mưa...'",
    "Nijika chỉnh âm thanh. 'To lên nữa! — Đủ để Bocchi giật mình!'",
    "Ryo nợ tiền quán. Seika đuổi theo. 'ĐỨA NÀO CỨU TAO VỚI — RYO NO—'",
    "Kita đang inbox fan. 'Cảm ơn đã ủng hộ Kessoku Band' Bocchi đọc được, đỏ mặt.",
    "Kessoku Band tập 'Seiza ni Naretara' — lần thứ 47. Nijika vẫn cười.",
    "Bocchi overthinking vì một ánh mắt của Kita. Cả buổi tập hỏng."
];

/* ===================================================================
   MÀU SẮC
   =================================================================== */
const bandColors = [
    0xFF9AA2, 0xFFE082, 0x82B1FF, 0xFF8A80,
    0xB39DDB, 0xA5D6A7, 0xEF9A9A, 0x81D4FA,
    0xFFCC80, 0xCE93D8
];

/* ===================================================================
   BIẾN TRẠNG THÁI
   =================================================================== */
let squadIndex = 0;
let jokeIndex = 0;

function rotateSquad() {
    const s = squadStatuses[squadIndex];
    squadIndex = (squadIndex + 1) % squadStatuses.length;
    return s;
}

function rotateJoke() {
    const j = BocchiJokes[jokeIndex];
    jokeIndex = (jokeIndex + 1) % BocchiJokes.length;
    return j;
}

/* ===================================================================
   GỬI TIN NHẮN RIÊNG CHO OWNER
   =================================================================== */
async function notifyOwner(content) {
    try {
        const owner = await client.users.fetch(OWNER_ID);
        await owner.send(content);
    } catch (err) {
        console.error('[NOTIFY] Lỗi gửi DM cho owner:', err.message);
    }
}

/* ===================================================================
   BUILD COMPONENTS (Đã fix lỗi constructor)
   =================================================================== */
function buildComponents() {
    // Sử dụng trực tiếp class từ thư viện thông qua Discord object đã import
    const selectRow = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu() // Truy cập thông qua Discord object
                .setCustomId('starry_menu')
                .setPlaceholder('Chọn dịch vụ bên dưới...')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions([
                    {
                        label: 'Đặt đồ (Order)',
                        description: 'Gọi món và đặt đồ uống tại Starry',
                        value: 'order_option'
                    },
                    {
                        label: 'Press to Kita Meow',
                        description: 'Nhấn để nghe Kita meow~ meow~!',
                        value: 'kita_meow'
                    },
                    {
                        label: 'Gọi Bocchi ra đàn',
                        description: 'Yêu cầu Bocchi chơi guitar (sẽ ngại ~30p)',
                        value: 'bocchi_play'
                    },
                    {
                        label: 'Starry Special Drink',
                        description: 'Đồ uống đặc biệt của quán - Ryo đề xuất',
                        value: 'special_drink'
                    }
                ])
        );

    const buttonRow1 = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton().setLabel('Order').setStyle('LINK').setURL(WIDEKITA_URL),
            new Discord.MessageButton().setLabel('Kita Meow').setStyle('LINK').setURL(WIDEKITA_URL),
            new Discord.MessageButton().setLabel('Menu Nhạc').setStyle('LINK').setURL(WIDEKITA_URL),
            new Discord.MessageButton().setLabel('Special').setStyle('LINK').setURL(WIDEKITA_URL),
            new Discord.MessageButton().setLabel('Fanpage').setStyle('LINK').setURL(WIDEKITA_URL)
        );

    const buttonRow2 = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton().setLabel('Instagram Kita').setStyle('LINK').setURL(WIDEKITA_URL),
            new Discord.MessageButton().setLabel('Kessoku Fanclub').setStyle('LINK').setURL(WIDEKITA_URL),
            new Discord.MessageButton().setLabel('Chat với Bocchi').setStyle('LINK').setURL(WIDEKITA_URL),
            new Discord.MessageButton().setLabel('Bocchi Corner').setStyle('LINK').setURL(WIDEKITA_URL)
        );

    return [selectRow, buttonRow1, buttonRow2];
}

/* ===================================================================
   BUILD EMBED
   =================================================================== */
function buildEmbed(memberDisplayName) {
    const greeting = BocchiWaiter[Math.floor(Math.random() * BocchiWaiter.length)];
    const color = bandColors[Math.floor(Math.random() * bandColors.length)];
    const squad = rotateSquad();
    const joke = rotateJoke();

    return new MessageEmbed()
        .setAuthor({
            name: 'Hitori Gotoh (Bocchi) - Starry Bar',
            icon_url: 'https://i.ibb.co/LDYLdxzc/282817-panickedno.gif',
            url: WIDEKITA_URL
        })
        .setDescription(
            '**' + memberDisplayName + '** vừa đẩy cửa bước vào...\n\n' +
            '_' + greeting + '_\n\n' +
            '────────────────────────────\n' +
            '**Bocchi Corner** - tâm sự từ góc tối:\n' +
            '_' + joke + '_\n' +
            '────────────────────────────\n\n' +
            'Chọn dịch vụ bên dưới hoặc dùng Select Menu để gọi món ngay!'
        )
        .setImage('https://images.steamusercontent.com/ugc/2462978499899794420/31183CA7507D6DFB6845952964B1262E55E58DDA/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true')
        .setColor(color)
        .setFooter({
            text: squad,
            iconURL: 'https://i.ibb.co/LDYLdxzc/282817-panickedno.gif'
        })
        .setTimestamp();
}

/* ===================================================================
   GỬI WEBHOOK
   =================================================================== */
async function sendWebhook(memberDisplayName) {
    const embed = buildEmbed(memberDisplayName);
    const components = buildComponents();

    try {
        const res = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'Bocchi Waiter - Starry',
                avatar_url: 'https://i.ibb.co/LDYLdxzc/282817-panickedno.gif',
                embeds: [embed],
                components: components
            })
        });
        if (!res.ok) {
            const text = await res.text();
            await notifyOwner('[LỖI WEBHOOK] HTTP ' + res.status + ': ' + text);
        }
    } catch (err) {
        await notifyOwner('[LỖI WEBHOOK] ' + err.message);
    }
}

/* ===================================================================
   XOAY TRẠNG THÁI (30 phút)
   =================================================================== */
function rotateActivity() {
    const status = rotateSquad();
    client.user.setActivity(status, { type: 'PLAYING' });
}

/* ===================================================================
   SỰ KIỆN READY
   =================================================================== */
client.on('ready', () => {
    console.log('[READY] Bocchi Waiter đã sẵn sàng: ' + client.user.tag);
    client.user.setActivity('Starry Bar - mời bạn ghé chơi ạ...', { type: 'PLAYING' });
    setInterval(rotateActivity, 30 * 60 * 1000);
});

/* ===================================================================
   SỰ KIỆN MESSAGE CREATE
   =================================================================== */
client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return;

    if (
        message.author.id === OWNER_ID &&
        (message.content.includes('<' + '@' + PING_TARGET_ID + '>') || message.content.includes('<@!' + PING_TARGET_ID + '>'))
    ) {
        try {
            await message.reply('yes');
        } catch (err) {
            await notifyOwner('[LỖI PING REPLY] ' + err.message);
        }
        return;
    }

    if (message.content.toLowerCase() === 'ahem' && message.author.id === OWNER_ID) {
        try {
            await message.delete();
        } catch (e) {}

        const vc = message.member?.voice?.channel;
        if (vc) {
            try {
                await vc.setName(STARRY_NAME);
                await notifyOwner('Đã đổi tên kênh "' + vc.name + '" thành "' + STARRY_NAME + '"');
            } catch (err) {
                await notifyOwner('[LỖI ĐỔI TÊN VOICE] ' + err.message);
            }
        } else {
            await notifyOwner('Bạn không ở trong voice channel nào để đổi tên!');
        }
        return;
    }
});

/* ===================================================================
   SỰ KIỆN VOICE STATE UPDATE
   =================================================================== */
client.on('voiceStateUpdate', async (oldState, newState) => {
    const vc = newState.channel || oldState.channel;
    if (vc && vc.name === TARGET_CHANNEL_NAME) {
        try {
            await vc.setName(STARRY_NAME);
            await notifyOwner('Đã tự động đổi tên kênh "' + TARGET_CHANNEL_NAME + '" thành "' + STARRY_NAME + '"');
        } catch (err) {
            await notifyOwner('[LỖI AUTO RENAME] ' + err.message);
        }
    }

    if (!oldState.channelId && newState.channelId && !newState.member.user.bot) {
        await sendWebhook(newState.member.displayName);
    }
});

/* ===================================================================
   SỰ KIỆN INTERACTION CREATE
   =================================================================== */
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isSelectMenu() || interaction.customId !== 'starry_menu') return;

    const value = interaction.values[0];
    let replyContent = '';

    switch (value) {
        case 'order_option':
            replyContent =
                '**Order Form**\n' +
                '> Bocchi lấy giấy bút ra, tay run lẩy bẩy...\n\n' +
                'Đặt đồ ngay: ' + WIDEKITA_URL + '\n' +
                '> Bocchi: "M-mời bạn chọn món... đừng gọi món khó quá... em sợ làm sai..."';
            break;
        case 'kita_meow':
            replyContent =
                '**Kita:** Meow~ meow~ meow~!\n\n' +
                '> Bocchi đỏ mặt tía tai vì độ dễ thương\n' +
                '> Nijika cười lớn\n' +
                '> Ryo: "Trả tiền đi rồi meow tiếp."\n\n' +
                'Nghe thêm tại: ' + WIDEKITA_URL;
            break;
        case 'bocchi_play':
            replyContent =
                '**Bocchi:** Ư-ưm... để em... lấy đàn...\n\n' +
                '> Cô ấy mất 5 phút để lấy can đảm...\n' +
                '> 3 phút để chỉnh dây...\n' +
                '> 2 phút để thở...\n' +
                '> Và 30 giây chơi solo siêu đỉnh trước khi chạy mất\n\n' +
                WIDEKITA_URL;
            break;
        case 'special_drink':
            replyContent =
                '**Starry Special Drink**\n\n' +
                '> Ly cocktail màu xanh dương tựa bầu trời mùa hè...\n' +
                '> Ryo bảo đây là "Nước mắt của Bocchi"...\n' +
                '> Seika: "Uống đi, không sao đâu." (có sao)\n\n' +
                'Đặt ngay: ' + WIDEKITA_URL;
            break;
        default:
            replyContent = 'Cảm ơn bạn đã chọn dịch vụ tại Starry! ' + WIDEKITA_URL;
    }

    try {
        await interaction.reply({ content: replyContent, ephemeral: true });
    } catch (err) {
        await notifyOwner('[LỖI SELECT MENU] ' + err.message);
    }
});

client.login(TOKEN);
