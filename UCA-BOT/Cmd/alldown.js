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
    
    // লিঙ্ক না দিলে এরর দেখাবে
    if (!inputText || !inputText.startsWith("http")) {
      return bot.sendMessage(
        chatId,
        `❌ Usage: ${config.prefix}alldown <link>`,
        { reply_to_message_id: messageId }
      );
    }

    // ডাউনলোডিং মেসেজ
    const waitMsg = await bot.sendMessage(
        chatId,
        "⏳ Downloading Please Wait...!",
        { reply_to_message_id: messageId }
    );

    try {
      const res = await alldown(inputText);
      
      // ভিডিওর ডাটা চেক করা
      if (!res || !res.data || !res.data.high) {
        throw new Error("Could not find video link.");
      }

      const { high, title } = res.data;

      // ভিডিও স্ট্রিম করা
      const vidResponse = await axios.get(high, { responseType: 'stream' });
      const videoStream = vidResponse.data;

      const caption = `🎬 **Title:** ${title || "No Title"}`;

      const replyMarkup = {
        inline_keyboard: [
          [{ text: '🔗 𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑', url: 'https://t.me/UCA_RAKIB }], // এখানে আপনার ইউজারনেম দিন
        ],
      };

      // ওয়েটিং মেসেজ ডিলিট করে ভিডিও পাঠানো
      await bot.deleteMessage(chatId, waitMsg.message_id);

      await bot.sendVideo(chatId, videoStream, {
        caption: caption,
        parse_mode: 'Markdown',
        reply_to_message_id: messageId,
        reply_markup: replyMarkup
      });

    } catch (error) {
      console.error('❌ Error:', error.message);
      
      await bot.editMessageText(
        '❌ Failed to download. Please verify the link or try again later.',
        {
          chat_id: chatId,
          message_id: waitMsg.message_id
        }
      );
    }
  }
};
