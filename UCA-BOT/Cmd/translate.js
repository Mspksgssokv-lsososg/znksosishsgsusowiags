const axios = require('axios');

module.exports = {
    name: "translate",
    credits: "RAKIB MAHMUD",
    description: "যেকোনো ভাষাকে অন্য ভাষায় অনুবাদ করার জন্য।",

    run: async (bot, msg, args) => {
        const chatId = msg.chat.id;
        const messageId = msg.message_id;

        const DEFAULT_TARGET_LANG = "bn"; 
        let targetLang = DEFAULT_TARGET_LANG;
        let textToTranslate = '';

        // ব্যবহার করার নিয়ম (Usage)
        const usage = `❌ **সঠিক নিয়ম:**\n` +
                      `১. রিপ্লাই দিয়ে: \`/tr bn\` (অন্য ভাষাকে বাংলা করতে)\n` +
                      `২. লিখে: \`/tr en আমি ভালো আছি\` (ইংরেজি করতে)\n` +
                      `━━━━━━━━━━━━━━━\n` +
                      `কোডসমূহ: en, bn, hi, fr, es, ar`;

        // ১. যদি কোনো মেসেজে রিপ্লাই দেওয়া হয়
        if (msg.reply_to_message) {
            textToTranslate = msg.reply_to_message.text || msg.reply_to_message.caption;
            if (args[0]) {
                targetLang = args[0].toLowerCase();
            }
        } 
        // ২. যদি সরাসরি টেক্সট দেওয়া হয়
        else if (args.length >= 2) {
            let possibleLang = args[0].toLowerCase();
            if (possibleLang.length <= 3) { 
                targetLang = possibleLang;
                textToTranslate = args.slice(1).join(" ");
            } else {
                textToTranslate = args.join(" ");
            }
        } 
        else if (args.length === 1) {
            textToTranslate = args[0];
        }

        // টেক্সট না থাকলে হেল্প মেসেজ দেখাবে
        if (!textToTranslate || textToTranslate.trim() === '') {
            return bot.sendMessage(chatId, usage, { reply_to_message_id: messageId, parse_mode: 'Markdown' });
        }

        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;

            const response = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            let translatedText = '';
            if (response.data && response.data[0]) {
                response.data[0].forEach(item => {
                    if (item[0]) translatedText += item[0];
                });
            }

            if (!translatedText) {
                return bot.sendMessage(chatId, "❌ অনুবাদ করা সম্ভব হয়নি।", { reply_to_message_id: messageId });
            }

            const resultMessage = `🌐 **Translation Result**\n` +
                                 `━━━━━━━━━━━━━━━\n` +
                                 `📥 **Original:** ${textToTranslate}\n\n` +
                                 `📤 **Translated (${targetLang}):** ${translatedText}\n` +
                                 `━━━━━━━━━━━━━━━\n` +
                                 `⚡ **DEV: RAKIB MAHMUD**`;

            await bot.sendMessage(chatId, resultMessage, { 
                reply_to_message_id: messageId, 
                parse_mode: 'Markdown' 
            });

        } catch (error) {
            console.error("Translate Error:", error.message);
            bot.sendMessage(chatId, "❌ এপিআই (API) সমস্যায় অনুবাদ করা যাচ্ছে না।", { reply_to_message_id: messageId });
        }
    }
};
