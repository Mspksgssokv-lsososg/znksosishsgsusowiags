const axios = require('axios');
const { alldown } = require('nayan-media-downloaders');

module.exports = {
  name: "alldown",
  credits: "RAKIB MAHMUD",
  description: "Auto Video Downloader",
  
  run: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const link = typeof args === 'string' ? args : args[0];

    if (!link || !link.startsWith("http")) return;

    const waitMsg = await bot.sendMessage(chatId, "⏳ **Downloading... Please Wait!**", { 
        reply_to_message_id: messageId, 
        parse_mode: 'Markdown' 
    });

    try {
      const res = await alldown(link);
      const { high, title } = res.data;
      const videoTitle = title || "No Title Found";

      const vidResponse = await axios.get(high, { responseType: 'stream' });

      // বাটন সেটআপ
      const replyMarkup = {
        inline_keyboard: [
          [{ text: '🔗 𝐉𝐎𝐈𝐍 𝐎𝐖𝐍𝐄𝐑', url: 'https://t.me/SYSTEM_ERROR_KING' }] 
        ]
      };

      // টাইটেল কপি করার জন্য `ব্যবহার করা হয়েছে
      const caption = `🎬 **Video Title:**\n\`${videoTitle}\`\n\n*(যে কোন সমস্যাই এডমিনেশন যোগাযোগ করুন )*\n\n✅ **Downloaded by UCA-Bot**`;

      await bot.deleteMessage(chatId, waitMsg.message_id);

      await bot.sendVideo(chatId, vidResponse.data, {
        caption: caption,
        parse_mode: 'Markdown',
        reply_to_message_id: messageId,
        reply_markup: replyMarkup
      });

    } catch (error) {
      await bot.editMessageText(`❌ **Error:** ${error.message || "Failed to download."}`, {
        chat_id: chatId,
        message_id: waitMsg.message_id
      });
    }
  }
};
