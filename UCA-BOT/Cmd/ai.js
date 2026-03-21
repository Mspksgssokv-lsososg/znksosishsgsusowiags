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

    const waiting = await bot.sendMessage(chatId, "🔍 AI is thinking...", { reply_to_message_id: messageId });

    try {
      // New Working API Link (GPT-4)
      const res = await axios.get(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(text)}&owner=Rakib&botname=UCA-Bot`);
      
      // Popcat API returns response in 'response' field
      const responseText = res.data.response || "I'm sorry, I couldn't process that.";

      const finalMsg = `🤖 **AI Response:**\n━━━━━━━━━━━━━━━━━━\n${responseText}\n━━━━━━━━━━━━━━━━━━\n👤 **User:** ${msg.from.first_name}`;

      await bot.editMessageText(finalMsg, {
        chat_id: chatId,
        message_id: waiting.message_id,
        parse_mode: "Markdown"
      });

    } catch (err) {
      // If error occurs, try a backup API
      try {
          const backupRes = await axios.get(`https://api.simsimi.vn/v1/simtalk`, {
              params: { text: text, lc: "en" }
          });
          const backupText = backupRes.data.message;
          
          await bot.editMessageText(`🤖 **AI (Backup):**\n\n${backupText}`, {
            chat_id: chatId,
            message_id: waiting.message_id
          });
      } catch (backupErr) {
          bot.editMessageText(`❌ All AI APIs are currently down. Please try again later.`, {
            chat_id: chatId,
            message_id: waiting.message_id
          });
      }
    }
  }
};
