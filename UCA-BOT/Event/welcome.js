module.exports = (bot) => {
    bot.on('new_chat_members', async (msg) => {
        try {
            const chatId = msg.chat.id;
            const newMembers = msg.new_chat_members;
            if (!newMembers) return;

            const me = await bot.getMe();

            for (const user of newMembers) {
                if (user.id === me.id) continue;

                const name = user.first_name || "বন্ধু";
                const welcomeMsg = `✨ **স্বাগতম, [${name}](tg://user?id=${user.id})!** ✨\n` +
                                   `━━━━━━━━━━━━━━━━━\n` +
                                   `আমাদের **${msg.chat.title}** গ্রুপে আপনাকে জানাই ভালোবাসা। ❤️\n\n` +
                                   `আশা করি আপনার সময়টি এখানে ভালো কাটবে! 🤝\n` +
                                   `━━━━━━━━━━━━━━━━━\n` +
                                   `✅ **UCA RAKIB BOT**`;

                await bot.sendMessage(chatId, welcomeMsg, { 
                    parse_mode: 'Markdown' 
                });
            }
        } catch (err) {
            console.log("Welcome Error: " + err.message);
        }
    });
};
