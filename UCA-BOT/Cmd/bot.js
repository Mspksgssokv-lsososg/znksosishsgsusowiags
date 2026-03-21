const axios = require("axios");

module.exports = {
    name: "bot",
    credits: "RAKIB MAHMUD",
    description: "AI Chat - Baby Bot System",

    run: async (bot, msg, args) => {
        const chatId = msg.chat.id;
        const messageId = msg.message_id;
        const usermsg = args.join(" ").trim();

        // ১. যদি শুধু /bot লেখে, তবে র‍্যান্ডম জোকস/রিপ্লাই দিবে
        if (!usermsg) {
            const greetings = [
                "বেশি bot bot করলে চুম্মা দিয়া তোমার কিডনি ব্লক করে দেবো😒",
                "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নাই🥺 পচা তুমি🥺",
                "আমি আবাল দের সাথে কথা বলি না, ok😒",
                "দিনশেষে পরের Bow সুন্দর-☹",
                "আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস রাকিব চৌধুরী কে দান করেন-🥱",
                "জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",
                "আমি এখন বস রাকিবের সাথে ব্যাস্ত, ডাকবেন না 😏",
                "তোমারে প্রচুর ভাল্লাগে–সময় মতো প্রপোজ করমু 😼",
                "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 🤣"
            ];
            const randomMsg = greetings[Math.floor(Math.random() * greetings.length)];
            return await bot.sendMessage(chatId, `<b>Hey ${msg.from.first_name}</b>\n\n${randomMsg}`, { 
                reply_to_message_id: messageId,
                parse_mode: "HTML"
            });
        }

        // ২. যদি কিছু লিখে প্রশ্ন করে তবে AI উত্তর দিবে
        try {
            await bot.sendChatAction(chatId, 'typing');

            // আপনার দেওয়া সিস্টেম অনুযায়ী এপিআই কল
            const base = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
            const apiUrl = base.data.sim; 
            
            // এই সেই এপিআই লিঙ্ক
            const response = await axios.get(`${apiUrl}/sim?type=ask&ask=${encodeURIComponent(usermsg)}&status=true`);
            
            const replyText = response.data.data?.msg || "🤖 সরি জান, উত্তর দিতে পারছি না।";
            
            await bot.sendMessage(chatId, replyText, { 
                reply_to_message_id: messageId 
            });

        } catch (err) {
            console.error("API Error:", err.message);
            // ব্যাকআপ এপিআই যদি ওপরেরটা কাজ না করে
            try {
                const backup = await axios.get(`https://api.simsimi.vn/v1/simtalk`, {
                    params: { text: usermsg, lc: "bn" }
                });
                await bot.sendMessage(chatId, backup.data.message, { reply_to_message_id: messageId });
            } catch (e) {
                await bot.sendMessage(chatId, "❌ এপিআই ডাউন আছে ভাই, একটু পরে ট্রাই করেন।", { reply_to_message_id: messageId });
            }
        }
    }
};
