const axios = require("axios");
const config = require("../../UCA-Config/config");

module.exports = {
  name: "ai",
  credits: "RAKIB MAHMUD",
  description: "Chat with GPT-4 AI",
  
  run: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    
    let text = args.join(" ").trim();

    if (!text && msg.reply_to_message && msg.reply_to_message.text) {
        text = msg.reply_to_message.text;
    }

    if (!text) {
        return bot.sendMessage(chatId, `❌ Please provide a question!\nExample: ${config.prefix}ai hello`, { reply_to_message_id: messageId });
    }

    // --- প্রথম মেসেজ যা ইউজার দেখবে ---
    const waiting = await bot.sendMessage(chatId, "🔍 AI is thinking...", { reply_to_message_id: messageId });

    try {
      // Working AI API (Popcat)
      const res = await axios.get(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(text)}&owner=Rakib&botname=UCA-Bot`);
      
      const responseText = res.data.response || "I'm sorry, I couldn't process that.";

      const finalMsg = `🤖 **AI Response:**\n━━━━━━━━━━━━━━━━━━\n${responseText}\n━━━━━━━━━━━━━━━━━━\n👤 **User:** ${msg.from.first_name}`;

      // উত্তর পাওয়ার পর "AI is thinking..." মেসেজটি এডিট হয়ে যাবে
      await bot.editMessageText(finalMsg, {
        chat_id: chatId,
        message_id: waiting.message_id,
        parse_mode: "Markdown"
      });

    } catch (err) {
      // এপিআই এরর হলে সেটিও এডিট করে জানাবে
      await bot.editMessageText(`❌ **API Error:** Server is not responding. Please try again later.`, {
        chat_id: chatId,
        message_id: waiting.message_id,
        parse_mode: "Markdown"
      });
    }
  }
};
