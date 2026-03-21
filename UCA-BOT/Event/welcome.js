module.exports = {
    name: "welcome",
    credits: "RAKIB MAHMUD",
    description: "নতুন মেম্বার জয়েন করলে স্বাগতম জানাবে",

    run: async (bot, msg) => {
        const chatId = msg.chat.id;
        const groupName = msg.chat.title || "আমাদের গ্রুপ";
        const newMembers = msg.new_chat_members;
        
        if (!newMembers) return;

        for (const user of newMembers) {            
            const me = await bot.getMe();
            if (user.id === me.id) continue;

            const name = user.first_name;
            const userId = user.id;
            
            const welcomeMsg = `✨ **স্বাগতম, [${name}](tg://user?id=${userId})!** ✨\n` +
                               `━━━━━━━━━━━━━━━━━\n` +
                               `আমাদের **${groupName}** গ্রুপে আপনাকে জানাই উষ্ণ অভ্যর্থনা ও ভালোবাসা। ❤️\n\n` +
                               `আশা করি আমাদের সাথে আপনার সময়টি অনেক আনন্দদায়ক হবে! 🤝\n` +
                               `━━━━━━━━━━━━━━━━━\n` +
                               `✅ **Downloaded by UCA-Bot**`;

            try {
                await bot.sendMessage(chatId, welcomeMsg, { 
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true 
                });
            } catch (e) {
                console.error("Welcome Send Error:", e.message);
            }
        }
    }
};
