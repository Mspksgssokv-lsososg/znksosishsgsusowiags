const axios = require("axios");
const config = require("../../UCA-Config/config");

module.exports = {
  name: "ai",
  credits: "RAKIB MAHMUD",
  description: "Chat with GPT AI using Nayan API",
  
  run: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    
    let text = args.join(" ").trim();

    if (!text && msg.reply_to_message && msg.reply_to_message.text) {
        text = msg.reply_to_message.text;
    }

    if (!text) {
        return bot.sendMessage(chatId, `❌ Please provide a message!\nUsage: ${config.prefix}ai <question>`, { reply_to_message_id: messageId });
    }

    const waiting = await bot.sendMessage(chatId, "💬 AI is preparing the answer...", { reply_to_message_id: messageId });

    try {
      // Fetching Dynamic API
      const apiConfig = await axios.get(`https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/refs/heads/main/api.json`);
      const apis = apiConfig.data;

      let baseUrl = apis.gpt4 || apis.api;
      let endpoint = apis.gpt4 ? "gpt4" : "nayan/gpt3";
      
      const response = await axios.get(`${baseUrl}/${endpoint}?text=${encodeURIComponent(text)}`);
      const responseText = response.data.response || response.data.result || "No response received.";

      const aiResponse = `🤖 **AI Response:**\n━━━━━━━━━━━━━━━━━━\n${responseText}\n━━━━━━━━━━━━━━━━━━\n👤 **User:** ${msg.from.first_name}`;

      await bot.editMessageText(aiResponse, {
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
