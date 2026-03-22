module.exports = {
    name: "hi",
    credits: "RAKIB MAHMUD",
    description: "র্যান্ডম গ্রিটিং টেক্সট দিয়ে রিপ্লাই দিবে।",

    run: async (bot, msg, args) => {
        const chatId = msg.chat.id;
        const messageId = msg.message_id;

        const GREETINGS = [
            "হ্যালো! 👋 কেমন আছেন? আশা করি সব ভালো চলছে।",
            "হাই! 😊 আপনার দিনটি শুভ হোক।",
            "ওহে! 💖 চ্যাট করার জন্য ধন্যবাদ।",
            "নমস্কার! আমি আপনার জন্য কী করতে পারি?",
            "কি অবস্থা? 🚀 নতুন কিছু জানতে চান?",
            "সালাম! 🙏 আপনাকে দেখে ভালো লাগলো।",
            "আরে! 😃 আবার কথা হচ্ছে!"
        ];

        
        const randomText = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];

        try {
            await bot.sendMessage(chatId, randomText, { 
                reply_to_message_id: messageId 
            });
        } catch (err) {
            console.error("Hi Command Error:", err.message);
        }
    }
};
