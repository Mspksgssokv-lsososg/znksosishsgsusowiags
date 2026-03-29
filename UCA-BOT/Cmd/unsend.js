module.exports = {
    name: "unsend",
    aliases: ["u", "uns"],
    credits: "SK-SIDDIK-KHAN",
    description: "Reply দিয়ে message delete করার জন্য",

    run: async (bot, msg, args) => {
        const chatId = msg.chat.id;
        const message_id = msg.message_id;

        const replyMsg = msg.reply_to_message;

        // ❗ reply না দিলে
        if (!replyMsg) {
            return bot.sendMessage(chatId, "⚠️ যে message delete করতে চাও, সেটায় reply দাও", {
                reply_to_message_id: message_id
            });
        }

        try {
            // ✅ reply করা message delete
            await bot.deleteMessage(chatId, replyMsg.message_id);

            // ✅ command message delete
            await bot.deleteMessage(chatId, message_id);

        } catch (error) {
            console.error("Delete Error:", error.message);

            if (error.response && error.response.body) {
                if (error.response.body.description.includes("message can't be deleted")) {
                    return bot.sendMessage(chatId,
                        "❌ এই message delete করা যাচ্ছে না (old বা permission নাই)",
                        { reply_to_message_id: message_id }
                    );
                }
            }

            return bot.sendMessage(chatId,
                `❌ Error: ${error.message}`,
                { reply_to_message_id: message_id }
            );
        }
    }
};
