module.exports = {
    name: "welcome",
    credits: "RAKIB MAHMUD",
    description: "Welcome new members",

    run: async (bot, msg) => {
        try {
            const chatId = msg.chat.id;
            const groupName = msg.chat.title || "আমাদের গ্রুপ";
            const newMembers = msg.new_chat_members;

            if (!newMembers || newMembers.length === 0) return;

            for (const user of newMembers) {
                // চেক করা হচ্ছে বট নিজে জয়েন করেছে কি না
                const me = await bot.getMe();
                if (user.id === me.id) continue;

                const name = user.first_name || "বন্ধু";
                
                const welcomeMsg = `✨ **স্বাগতম, ${name}!** ✨\n` +
                                   `━━━━━━━━━━━━━━━━━\n` +
                                   `আমাদের **${groupName}** গ্রুপে আপনাকে জানাই ভালোবাসা। ❤️\n\n` +
                                   `আশা করি আপনার সময়টি এখানে ভালো কাটবে! 🤝\n` +
                                   `━━━━━━━━━━━━━━━━━`;

                await bot.sendMessage(chatId, welcomeMsg, { 
                    parse_mode: 'Markdown' 
                });
            }
        } catch (err) {
            console.error("Welcome Script Error:", err.message);
        }
    }
};
