const axios = require('axios');
const { alldown } = require('nayan-media-downloaders');

module.exports = {
  name: "alldown",
  credits: "RAKIB MAHMUD",
  description: "Auto Video Downloader",
  
  run: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const link = args[0];

    if (!link) return;

    const waitMsg = await bot.sendMessage(chatId, "⏳ **Downloading... Please Wait!**", { 
        reply_to_message_id: messageId, 
        parse_mode: 'Markdown' 
    });

    try {
      const res = await alldown(link);
      const { high, title } = res.data;
      const videoTitle = title || "No Title";

      const vidResponse = await axios.get(high, { responseType: 'stream' });

      // আপনার টেলিগ্রাম বাটন এবং টাইটেল কপি বাটন
      const replyMarkup = {
        inline_keyboard: [
          [{ text: '📥 Copy Title', callback_data: 'copy_title' }], // নোট: টেলিগ্রামে সরাসরি 'copy' বাটন কেবল বটের নিজস্ব টেক্সটে হয়, তাই আমরা ক্যাপশনে ক্লিক-টু-কপি দেব।
          [{ text: '🔗 JOIN OWNER', url: 'https://t.me/your_channel_link' }] 
        ]
      };

      await bot.deleteMessage(chatId, waitMsg.message_id);

      await bot.sendVideo(chatId, vidResponse.data, {
        caption: `🎬 **Title:** \`${videoTitle}\`\n\n*(টাইটেলের ওপর ক্লিক করলে কপি হবে)*\n\n✅ **Downloaded by UCA-Bot**`,
        parse_mode: 'Markdown',
        reply_to_message_id: messageId,
        reply_markup: replyMarkup
      });

    } catch (error) {
      await bot.editMessageText(`❌ **Error:** ${error.message}`, {
        chat_id: chatId,
        message_id: waitMsg.message_id
      });
    }
  }
};
