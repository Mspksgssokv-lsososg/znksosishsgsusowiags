module.exports = {
    name: "prefix",
    aliases: ["pre"],
    prefix: false,
    credits: "SK-SIDDIK-KHAN",
    description: "Bot prefix দেখার জন্য",

    run: async (bot, msg, args) => {
        const chatId = msg.chat.id;
        const message_id = msg.message_id;

        let config = {};
        try {
            config = require("../../UCA.Config/config.js");
        } catch {}

        const prefix = config.prefix || "/";

        return bot.sendMessage(chatId,
            `🌐 Bot Prefix: ${prefix}`,
            { reply_to_message_id: message_id }
        );
    }
};
