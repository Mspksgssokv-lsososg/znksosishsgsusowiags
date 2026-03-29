const fs = require("fs");
const path = require("path");

const cacheDir = path.join(__dirname, "Siddik");
const restartFile = path.join(cacheDir, "restart.txt");

module.exports = {
  name: "restart",

  run: async (bot, msg) => {
    const chatId = msg.chat.id;

    try {
      const start = Date.now();

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      fs.writeFileSync(restartFile, `${chatId} ${start}`);

      // 🔄 message send & id store
      const sentMsg = await bot.sendMessage(chatId, "🔄 | Restarting the bot...");

      setTimeout(async () => {
        const time = ((Date.now() - start) / 1000).toFixed(2);

        // ✅ send final message
        await bot.sendMessage(
          chatId,
          `✅ | Bot restarted\n⏰ | Time: ${time}s`
        );

        // ❌ delete previous message
        try {
          await bot.deleteMessage(chatId, sentMsg.message_id);
        } catch (err) {
          console.error("Delete failed:", err.message);
        }

        // safe delete file
        try {
          if (fs.existsSync(restartFile)) {
            fs.unlinkSync(restartFile);
          }
        } catch {}

      }, 1500);

    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "❌ Restart failed");
    }
  },

  onLoad: async () => {
    return;
  }
};
