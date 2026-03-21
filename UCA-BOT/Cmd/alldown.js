const axios = require('axios');
const { alldown } = require('nayan-media-downloaders');

module.exports = {
  name: "alldown",
  credits: "RAKIB MAHMUD",
  description: "Auto Video Downloader",
  
  run: async (bot, msg, args) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    
    // index.js থেকে আসা লিংক চেক করা
    const link = Array.isArray(args) ? args[0] : (typeof args === 'string' ? args : msg.text);

    if (!link || !link.startsWith("http")) return;

    const waitMsg = await bot.sendMessage(chatId, "⏳ **Downloading... Please Wait!**", { 
        reply_to_message_id: messageId, 
        parse_mode: 'Markdown' 
    });

    try {
      const res = await alldown(link);
      if (!res || !res.data || !res.data.high) throw new Error("Link not found");

      const { high, title } = res.data;
      const videoTitle = title || "No Title Found";

      const vidResponse = await axios.get(high, { responseType: 'stream' });

      // বাটন সেটআপ: এখানে copy_text ব্যবহার করা হয়েছে
      const replyMarkup = {
        inline_keyboard: [
          [
            { 
              text: '📥 Copy Title', 
              copy_text: { text: videoTitle } // এই বাটনে ক্লিক করলে টাইটেল কপি হবে
            }
          ],
          [
            { 
              text: '🔗 JOIN OWNER', 
              url: 'https://t.me/SYSTEM_ERROR_KING' // আপনার টেলিগ্রাম ইউজারনেম দিন
            }
          ]
        ]
      };

      const caption = `🎬 **Video Title:**\n\`${videoTitle}\`\n\n✅ **Downloaded by UCA-Bot**`;

      await bot.deleteMessage(chat_id, waitMsg.message_id).catch(() => {});

      await bot.sendVideo(chatId, vidResponse.data, {
        caption: caption,
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
