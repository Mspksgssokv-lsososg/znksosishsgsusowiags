const axios = require("axios");
const config = require("../../UCA-Config/config");

module.exports = {
  name: "ai",
  credits: "RAKIB MAHMUD",
  description: "Dynamic AI System",
  
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
      const apiSource = await axios.get(`https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/refs/heads/main/api.json`);
      const apiData = apiSource.data;
      
      const baseUrl = apiData.gpt4 || apiData.api;
      const apiUrl = `${baseUrl}/gpt4?text=${encodeURIComponent(text)}`;

      const res = await axios.get(apiUrl);
      const responseText = res.data.response || res.data.result || "No response received.";

      const finalMsg = `🤖 **AI Response:**\n━━━━━━━━━━━━━━━━━━\n${responseText}\n━━━━━━━━━━━━━━━━━━\n👤 **User:** ${msg.from.first_name}`;

      await bot.editMessageText(finalMsg, {
        chat_id: chatId,
        message_id: waiting.message_id,
        parse_mode: "Markdown"
      });

    } catch (err) {
      await bot.editMessageText(`❌ Error: ${err.message}`, {
        chat_id: chatId,
        message_id: waiting.message_id
      });
    }
  }
};
