const axios = require("axios");
const config = require("../../UCA-Config/config");

module.exports = {
  name: "ai",
  credits: "RAKIB MAHMUD",
  aliases: ["gpt", "gpt4"],
  description: "Chat with GPT AI using an external API.",
  
  run: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const message_id = msg.message_id;
    const prefix = config.prefix;
    
    let text = args.join(" ").trim();

    if (!text) {
      if (msg.reply_to_message && msg.reply_to_message.text) {
          text = msg.reply_to_message.text.trim();
      } else {
          return bot.sendMessage(
              chatId,
              `❌ Please provide a message for AI.\nUsage: ${prefix}ai <your question>`,
              { reply_to_message_id: message_id }
          );
      }
    }

    const waitingMessage = await bot.sendMessage(
      chat_id,
      "💬 AI is thinking... Please wait...",
      { reply_to_message_id: message_id }
    );
    const waitingMessageId = waitingMessage.message_id;

    try {
      const apiConfigUrl = `https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/refs/heads/main/api.json`;
      const apiConfigResponse = await axios.get(apiConfigUrl);
      const apis = apiConfigResponse.data;

      let baseUrl = apis.gpt4 || apis.api;
      if (!baseUrl) throw new Error("API base URL not found.");

      const fullApiUrl = `${baseUrl}/gpt4?text=${encodeURIComponent(text)}`;
      const response = await axios.get(fullApiUrl);
      const data = response.data;
      
      const finalResponseText = data.response || data.result || "No response text received from AI.";
      
      const aiResponse = `🤖 **AI Response:**\n━━━━━━━━━━━━━━━━━━\n${finalResponseText}\n━━━━━━━━━━━━━━━━━━\n👤 **Query by:** ${msg.from.first_name}`;

      await bot.editMessageText(
        aiResponse,
        {
          chat_id: chatId,
          message_id: waitingMessageId,
          parse_mode: "Markdown"
        }
      );

    } catch (err) {
      await bot.editMessageText(
        `❌ **Error:** ${err.message}`,
        {
          chat_id: chatId,
          message_id: waitingMessageId
        }
      );
    }
  }
};
