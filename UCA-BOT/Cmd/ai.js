const axios = require("axios");
const config = require("../../UCA-Config/config");

module.exports = {
  name: "ai",
  credits: "RAKIB MAHMUD",
  description: "Direct GPT-4 AI System",
  
  run: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    let text = args.join(" ").trim();

    if (!text && msg.reply_to_message && msg.reply_to_message.text) {
        text = msg.reply_to_message.text;
    }

    if (!text) {
        return bot.sendMessage(chatId, `❌ Provide a question!\nExample: ${config.prefix}ai hello`, { reply_to_message_id: messageId });
    }

    const waiting = await bot.sendMessage(chatId, "🔍 AI is thinking...", { reply_to_message_id: messageId });

    try {
      // Direct Working API (No JSON needed)
      const res = await axios.get(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(text)}&owner=Rakib&botname=UCA-Bot`);
      
      const responseText = res.data.response || "I'm sorry, I couldn't process that.";

      const finalMsg = `🤖 **AI Response:**\n━━━━━━━━━━━━━━━━━━\n${responseText}\n━━━━━━━━━━━━━━━━━━\n👤 **User:** ${msg.from.first_name}`;

      await bot.editMessageText(finalMsg, {
        chat_id: chatId,
        message_id: waiting.message_id,
        parse_mode: "Markdown"
      });

    } catch (err) {
      // Backup API if first one fails
      try {
          const backup = await axios.get(`https://api.simsimi.vn/v1/simtalk`, { params: { text: text, lc: "en" } });
          await bot.editMessageText(`🤖 **AI (Backup):**\n\n${backup.data.message}`, {
            chat_id: chatId,
            message_id: waiting.message_id
          });
      } catch (e) {
          await bot.editMessageText(`❌ API Error: Connection failed. Please try again later.`, {
            chat_id: chatId,
            message_id: waiting.message_id
          });
      }
    }
  }
};
