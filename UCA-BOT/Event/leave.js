module.exports = (bot) => {
    bot.on('left_chat_member', (msg) => {
        const chatId = msg.chat.id;
        const user = msg.left_chat_member;
        const userName = user.first_name || "User";

        const message = `বিদায় ${userName}! 🥹\nআপনি আমাদের গ্রুপ ছেড়ে চলে গেলেন, আমরা আপনাকে মিস করবো।`;

        bot.sendMessage(chatId, message);
    });
};
