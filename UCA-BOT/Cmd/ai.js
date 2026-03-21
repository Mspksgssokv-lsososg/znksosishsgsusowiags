const axios = require("axios");
const config = require("../../UCA-Config/config");

module.exports = {
  name: "ai",
  credits: "RAKIB MAHMUD",
  description: "Chat with AI using GPT API",
  
  run: async (bot, msg, args) => {
    const chatId = msg.chat.id; // এখানে নাম chatId
    const messageId = msg.message_id;
    
    let text = args.join(" ").trim();

    if (!text && msg.reply_to_message && msg.reply_to_message.text) {
        text = msg.reply_to_message.text;
    }

    if (!text) {
        return bot.sendMessage(chatId, `❌ Please provide a question!\nExample: ${config.prefix}ai hello`, { reply_to_message_id: messageId });
    }

    const waiting = await bot.sendMessage(chatId, "🔍 AI is thinking...", { reply_to_message_id: messageId });

    try {
      const res = await axios.get(`https://smyt-api.onrender.com/gpt?prompt=${encodeURIComponent(text)}`);
      const responseText = res.data.data || "I couldn't get a response from AI.";

      const finalMsg = `🤖 **AI Response:**\n━━━━━━━━━━━━━━━━━━\n${responseText}\n━━━━━━━━━━━━━━━━━━\n👤 **User:** ${msg.from.first_name}`;

      // এখানে chat_id এর বদলে chatId ব্যবহার করতে হবে
      await bot.editMessageText(finalMsg, {
        chat_id: chatId, 
        message_id: waiting.message_id,
        parse_mode: "Markdown"
      });

    } catch (err) {
      bot.editMessageText(`❌ API Error: ${err.message}`, {
        chat_id: chatId,
        message_id: waiting.message_id
      });
    }
  }
};
