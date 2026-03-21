const axios = require('axios');
const { alldown } = require('nayan-media-downloaders');
const config = require("../../UCA-Config/config");

module.exports = {
  name: "alldown",
  credits: "RAKIB MAHMUD",
  description: "Download videos from various platforms",
  
  run: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    
    const inputText = args.join(" ").trim();
    
    if (!inputText || !inputText.startsWith("http")) {
      return bot.sendMessage(
        chatId,
        `❌ Usage: ${config.prefix}alldown <link>`,
        { reply_to_message_id: messageId }
      );
    }

    const waitMsg = await bot.sendMessage(
        chatId,
        "⏳ Downloading Please Wait...!",
        { reply_to_message_id: messageId }
    );

    try {
      const res = await alldown(inputText);
      
      if (!res || !res.data || !res.data.high) {
        throw new Error("Video link not found!");
      }

      const { high, title } = res.data;

      const vidResponse = await axios.get(high, { responseType: 'stream' });
      const videoStream = vidResponse.data;

      const caption = `🎬 **Title:** ${title || "No Title"}`;

      await bot.deleteMessage(chatId, waitMsg.message_id);

      await bot.sendVideo(chatId, videoStream, {
        caption: caption,
        parse_mode: 'Markdown',
        reply_to_message_id: messageId
      });

    } catch (error) {
      console.error('Error:', error.message);
      await bot.editMessageText(
        `❌ Error: ${error.message || "Failed to download."}`,
        {
          chat_id: chatId,
          message_id: waitMsg.message_id
        }
      );
    }
  }
};
