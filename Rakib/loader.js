const fs = require("fs");
const path = require("path");
const config = require("../UCA-Config/config");

module.exports = (bot) => {
  bot.commands = new Map();

  // Color Codes
  const g = "\x1b[32m"; // Green
  const c = "\x1b[36m"; // Cyan
  const y = "\x1b[33m"; // Yellow
  const r = "\x1b[0m";  // Reset

  console.log(`${y}--- Loading System Files ---${r}`);

  // 1. Commands Loading (যাতে সব ফাইল লোড হয়)
  const cmdPath = path.join(__dirname, "../UCA-BOT/Cmd");
  const cmdFiles = fs.readdirSync(cmdPath).filter(f => f.endsWith(".js"));

  for (const file of cmdFiles) {
    try {
      const cmd = require(`${cmdPath}/${file}`);
      bot.commands.set(cmd.name, cmd);
      console.log(`${g}✅ Command Loaded: ${file}${r}`);
    } catch (err) {
      console.log(`${y}❌ Error in: ${file} -> ${err.message}${r}`);
    }
  }

  // 2. Main Work Engine (এই অংশটিই সব কমান্ড চালাবে)
  bot.on("message", (msg) => {
    if (!msg.text) return; // শুধু টেক্সট মেসেজ চেক করবে
    
    const prefix = config.prefix;
    if (!msg.text.startsWith(prefix)) return; // প্রিফিক্স না থাকলে কাজ করবে না

    const args = msg.text.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = bot.commands.get(commandName);
    
    if (command) {
      try {
        command.run(bot, msg, args); // কমান্ড ফাইলকে ডাটা পাঠিয়ে দিচ্ছে
      } catch (err) {
        console.log(`${y}❌ Command Error (${commandName}): ${err.message}${r}`);
      }
    }
  });

  // 3. Events Loading
  const eventPath = path.join(__dirname, "../UCA-BOT/Event");
  const eventFiles = fs.readdirSync(eventPath).filter(f => f.endsWith(".js"));

  for (const file of eventFiles) {
    try {
      const event = require(`${eventPath}/${file}`);
      event(bot);
      console.log(`${c}🔔 Event Loaded: ${file}${r}`);
    } catch (err) {
      console.log(`${y}❌ Error in Event: ${file}${r}`);
    }
  }

  console.log(`${y}--- System is Online! ---${r}\n`);
};
