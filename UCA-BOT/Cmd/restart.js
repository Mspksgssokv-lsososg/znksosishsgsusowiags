const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const cacheDir = path.join(__dirname, "Siddik");
const restartFile = path.join(cacheDir, "restart.txt");

module.exports = {
  name: "restart",

  run: async (bot, msg) => {
    const chatId = msg.chat.id;

    try {
      // folder ensure
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // write restart info
      fs.writeFileSync(restartFile, `${chatId} ${Date.now()}`);

      await bot.sendMessage(chatId, "🔄 | Restarting the bot...");

      // start new process (clean way)
      const child = spawn(process.argv[0], process.argv.slice(1), {
        cwd: process.cwd(),
        detached: true,
        stdio: "ignore"
      });

      child.unref();

      // exit old process
      process.exit(0);

    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "❌ Restart failed");
    }
  },

  onLoad: async (bot) => {
    try {
      // file না থাকলে কিছুই করবো না
      if (!fs.existsSync(restartFile)) return;

      const data = fs.readFileSync(restartFile, "utf-8").trim();

      if (!data) return;

      const [chatId, oldTime] = data.split(" ");

      // invalid data check
      if (!chatId || !oldTime) return;

      const time = ((Date.now() - Number(oldTime)) / 1000).toFixed(2);

      await bot.sendMessage(
        chatId,
        `✅ | Bot restarted\n⏰ | Time: ${time}s`
      );

      // SAFE DELETE (no crash)
      try {
        if (fs.existsSync(restartFile)) {
          fs.unlinkSync(restartFile);
        }
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error("Delete error:", err);
        }
      }

    } catch (err) {
      console.error("onLoad error:", err);
    }
  }
};
