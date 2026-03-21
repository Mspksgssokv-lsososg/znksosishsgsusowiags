const axios = require("axios");
const config = require("../../UCA-Config/config");

module.exports = {
  name: "ai",
  credits: "RAKIB MAHMUD",
  description: "Chat with AI using Nayan Dynamic API",
  
  run: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    
    // ইউজার যদি কমান্ডের সাথে কিছু না লেখে, তবে রিপ্লাই করা টেক্সট চেক করবে
    let text = args.join(" ").trim();

    if (!text && msg.reply_to_message && msg.reply_to_message.text) {
        text = msg.reply_to_message.text;
    }

    // যদি কোনো টেক্সট না থাকে
    if (!text) {
        return bot.sendMessage(chatId, `❌ Please provide a question!\nExample: ${config.prefix}ai hello`, { reply_to_message_id: messageId });
    }

    // লোডিং মেসেজ পাঠানো
    const waiting = await bot.sendMessage(chatId, "💬 AI is preparing the answer...", { reply_to_message_id: messageId });

    try {
      // Nayan এর JSON থেকে ডাইনামিক লিঙ্ক আনা
      const apiConfig = await axios.get(`https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/refs/heads/main/api.json`);
      const apis = apiConfig.data;

      // লিঙ্ক এবং এন্ডপয়েন্ট সেট করা
      const baseUrl = apis.gpt4 || apis.api;
      const endpoint = apis.gpt4 ? "gpt4" : "nayan/gpt3";
      
      // ফাইনাল এপিআই কল
      const response = await axios.get(`${baseUrl}/${endpoint}?text=${encodeURIComponent(text)}`);
      
      // উত্তর বের করা
      const responseText = response.data.response || response.data.result || "No response received.";

      const finalMsg = `🤖 **AI Response:**\n━━━━━━━━━━━━━━━━━━\n${responseText}\n━━━━━━━━━━━━━━━━━━\n👤 **User:** ${msg.from.first_name}`;

      // মেসেজ এডিট করা
      await bot.editMessageText(finalMsg, {
        chat_id: chatId,
        message_id: waiting.message_id,
        parse_mode: "Markdown"
      });

    } catch (err) {
      // এরর হলে জানানো
      await bot.editMessageText(`❌ Error: ${err.message}`, {
        chat_id: chatId,
        message_id: waiting.message_id
      });
    }
  }
};
