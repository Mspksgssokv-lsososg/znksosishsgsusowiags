const fs = require("fs");
const path = require("path");

const cacheDir = path.join(__dirname, "Siddik");
const restartFile = path.join(cacheDir, "restart.txt");

module.exports = {
  name: "restart",
  credits: "SK-SIDDIK-KHAN",
  description: "Bot restart করার জন্য",

  // 🔄 Command run হলে
  run: async (bot, msg) => {
    const chatId = msg.chat.id;

    try {
      // folder না থাকলে তৈরি
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // restart info save
      fs.writeFileSync(restartFile, `${chatId} ${Date.now()}`);

      // restart message
      await bot.sendMessage(chatId, "🔄 | Restarting the bot...");

      // bot বন্ধ (PM2 আবার চালু করবে)
      process.exit(0);

    } catch (err) {
      console.error("Restart error:", err);
      bot.sendMessage(chatId, "❌ | Restart failed!");
    }
  },

  // ✅ Bot start হলে auto run
  onLoad: async (bot) => {
    try {
      if (!fs.existsSync(restartFile)) return;

      const data = fs.readFileSync(restartFile, "utf-8").split(" ");
      const chatId = data[0];
      const oldTime = Number(data[1]);

      if (chatId && oldTime) {
        const time = ((Date.now() - oldTime) / 1000).toFixed(2);

        await bot.sendMessage(
          chatId,
          `✅ | Bot restarted\n⏰ | Time: ${time}s`
        );
      }

      fs.unlinkSync(restartFile);

    } catch (err) {
      console.error("onLoad restart error:", err);
    }
  }
};
