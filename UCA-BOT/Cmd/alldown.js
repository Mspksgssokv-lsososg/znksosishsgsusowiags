const axios = require('axios');
const { alldown } = require('nayan-media-downloaders');

module.exports = {
  name: "alldown",
  credits: "RAKIB MAHMUD",
  description: "Auto Video Downloader",
  
  run: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const text = msg.text || "";

    // চেক করা হচ্ছে মেসেজটি কি কোনো লিঙ্ক কি না
    const isLink = /https?:\/\/[^\s]+/.test(text);
    if (!isLink) return;

    // ওয়েটিং মেসেজ
    const waitMsg = await bot.sendMessage(
        chatId,
        "⏳ **Downloading... Please Wait!**",
        { reply_to_message_id: messageId, parse_mode: 'Markdown' }
    );

    try {
      const res = await alldown(text);
      if (!res || !res.data || !res.data.high) {
        throw new Error("Video not found!");
      }

      const { high, title } = res.data;
      const videoTitle = title || "No Title Found";

      // ভিডিও স্ট্রিম আনা
      const vidResponse = await axios.get(high, { responseType: 'stream' });
      const videoStream = vidResponse.data;

      // বাটন সেটআপ (আপনার টেলিগ্রাম লিংক এখানে দিন)
      const replyMarkup = {
        inline_keyboard: [
          [{ text: '📥 Copy Title', copy_text: { text: videoTitle } }], // টাইটেল কপির জন্য
          [{ text: '🔗 JOIN OWNER', url: 'https://t.me/UCA_RAKIB }] // আপনার টেলিগ্রাম লিংক
        ]
      };

      // মেসেজ এডিট/ডিলিট করে ভিডিও পাঠানো
      await bot.deleteMessage(chatId, waitMsg.message_id);

      await bot.sendVideo(chatId, videoStream, {
        caption: `🎬 **Title:** \`${videoTitle}\`\n\n✅ *Auto Downloaded by UCA-Bot*`,
        parse_mode: 'Markdown',
        reply_to_message_id: messageId,
        reply_markup: replyMarkup
      });

    } catch (error) {
      await bot.editMessageText(`❌ **Failed to download!**\nError: ${error.message}`, {
        chat_id: chatId,
        message_id: waitMsg.message_id
      });
    }
  }
};
