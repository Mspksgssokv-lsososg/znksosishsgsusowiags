module.exports = {

    config: {

        name: "welcome",

        eventType: "new_chat_members", // মেইন ফাইলের ইভেন্ট টাইপের সাথে মিল থাকতে হবে

        author: " RAKIB MAHMUD",

        description: "নতুন মেম্বার জয়েন করলে স্বাগতম জানাবে"

    },

    run: async (bot, msg) => {

        const chatId = msg.chat.id;

        const groupName = msg.chat.title;

        const newMembers = msg.new_chat_members;

        for (const user of newMembers) {

            if (user.is_bot && user.id === (await bot.getMe()).id) continue;

            const name = user.first_name;

            const welcomeMsg = `✨ **স্বাগতম, ${name}!** ✨\n` +

                               `━━━━━━━━━━━━━━━━━\n` +

                               `আমাদের **${groupName}** গ্রুপে আপনাকে জানাই ভালোবাসা। ❤️\n\n` +

                               `আশা করি আপনার সময়টি এখানে ভালো কাটবে!`;

            try {

                await bot.sendMessage(chatId, welcomeMsg, { parse_mode: 'Markdown' });

            } catch (e) {

                console.error("Welcome Error:", e);

            }

        }

    }

};
