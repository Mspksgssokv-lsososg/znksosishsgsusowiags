const moment = require("moment-timezone");

module.exports = {
    name: "time",
    prefix: false,
    credits: "SK-SIDDIK-KHAN",
    description: "বর্তমান সময় দেখাবে",

    run: async (bot, msg, args) => {
        const chatId = msg.chat.id;
        const message_id = msg.message_id;

        try {
            const now = moment.tz("Asia/Dhaka");

            const text = `🕒 Current time: ${now.format("h:mm:ss A")}
📅 Date: ${now.format("DD/MM/YYYY")}`;

            await bot.sendMessage(chatId, text, {
                reply_to_message_id: message_id
            });

        } catch (e) {
            console.error("Time Error:", e);
            await bot.sendMessage(chatId, "❌ সময় আনতে সমস্যা হয়েছে।");
        }
    }
};
