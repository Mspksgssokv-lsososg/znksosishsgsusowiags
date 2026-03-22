module.exports = {
    name: "uid",
    credits: "RAKIB MAHMUD",
    description: "ইউজারের আইডি এবং প্রোফাইল ডিটেইলস দেখাবে।",

    run: async (bot, msg) => {
        const chatId = msg.chat.id;
        const replyId = msg.message_id;

        
        const targetUser = msg.reply_to_message ? msg.reply_to_message.from : msg.from;

        if (!targetUser) {
            return bot.sendMessage(chatId, "❌ ইউজার পাওয়া যায়নি।", { reply_to_message_id: replyId });
        }

        const userId = targetUser.id;
        const firstName = targetUser.first_name || "N/A";
        const username = targetUser.username ? `@${targetUser.username}` : "N/A";

        
        const caption = `<b>👤 USER INFO</b>\n` +
                        `━━━━━━━━━━━━━━━\n` +
                        `<b>🪪 Name:</b> ${firstName}\n` +
                        `<b>🔗 Username:</b> ${username}\n` +
                        `<b>🆔 UID:</b> <code>${userId}</code>\n` +
                        `━━━━━━━━━━━━━━━\n` +
                        `<b>⚡ DEV: RAKIB MAHMUD</b>`;

        try {
            
            const photos = await bot.getUserProfilePhotos(userId, { limit: 1 });

            if (photos.total_count > 0) {
                const fileId = photos.photos[0][0].file_id;
                return await bot.sendPhoto(chatId, fileId, {
                    caption: caption,
                    parse_mode: "HTML",
                    reply_to_message_id: replyId
                });
            } else {
                return await bot.sendMessage(chatId, caption + `\n\n<i>(⚠️ প্রোফাইল পিকচার নেই)</i>`, {
                    parse_mode: "HTML",
                    reply_to_message_id: replyId
                });
            }

        } catch (err) {
            console.error("UID Error:", err.message);
            return await bot.sendMessage(chatId, caption + `\n\n<i>(❌ তথ্য আনতে সমস্যা হয়েছে)</i>`, {
                parse_mode: "HTML",
                reply_to_message_id: replyId
            });
        }
    }
};
