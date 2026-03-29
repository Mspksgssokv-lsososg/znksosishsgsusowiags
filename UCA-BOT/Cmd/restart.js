const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, 'Siddik');
const restartTxt = path.join(cacheDir, 'restart.txt');

module.exports = {
  name: "restart",
  credits: "SK-SIDDIK-KHAN",
  description: "Bot restart করার জন্য",

  // Run when command is used
  run: async (bot, msg, args) => {
    const chatId = msg.chat.id;

    try {
      // Ensure folder exists
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // Save restart info
      fs.writeFileSync(restartTxt, `${chatId} ${Date.now()}`);

      await bot.sendMessage(chatId, "🔄 | Restarting the bot...");
      
      process.exit(0); // Restart trigger
    } catch (error) {
      console.error("Restart command error:", error);
      bot.sendMessage(chatId, "❌ | Error occurred while restarting");
    }
  },

  // Run when bot starts
  onLoad: async (bot) => {
    try {
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      if (fs.existsSync(restartTxt)) {
        const content = fs.readFileSync(restartTxt, "utf-8").trim().split(" ");
        
        const chatId = content[0];
        const oldtime = Number(content[1]);

        if (chatId && oldtime) {
          const elapsed = ((Date.now() - oldtime) / 1000).toFixed(3);
          
          await bot.sendMessage(
            chatId,
            `✅ | Bot restarted\n⏰ | Time: ${elapsed}s`
          );
        }

        fs.unlinkSync(restartTxt);
      }
    } catch (err) {
      console.error("Error in restart onLoad:", err);
    }
  }
};
