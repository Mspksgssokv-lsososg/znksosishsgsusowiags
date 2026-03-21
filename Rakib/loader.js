const fs = require("fs");
const path = require("path");

module.exports = (bot) => {
  bot.commands = new Map();

  // কালার কোড
  const g = "\x1b[32m"; // Green
  const c = "\x1b[36m"; // Cyan
  const y = "\x1b[33m"; // Yellow
  const r = "\x1b[0m";  // Reset

  console.log(`${y}--- Loading System Files ---${r}`);

  // Commands load
  const cmdPath = path.join(__dirname, "../UCA-BOT/Cmd");
  const cmdFiles = fs.readdirSync(cmdPath).filter(f => f.endsWith(".js"));

  for (const file of cmdFiles) {
    try {
      const cmd = require(`${cmdPath}/${file}`);
      bot.commands.set(cmd.name, cmd);
      console.log(`${g}✅ Command Loaded: ${file}${r}`);
    } catch (err) {
      console.log(`${y}❌ Error in: ${file}${r}`);
    }
  }

  // Events load
  const eventPath = path.join(__dirname, "../UCA-BOT/Event");
  const eventFiles = fs.readdirSync(eventPath).filter(f => f.endsWith(".js"));

  for (const file of eventFiles) {
    try {
      const event = require(`${eventPath}/${file}`);
      event(bot);
      console.log(`${c}🔔 Event Loaded: ${file}${r}`);
    } catch (err) {
      console.log(`${y}❌ Error in: ${file}${r}`);
    }
  }

  console.log(`${y}--- Loading Complete ---${r}\n`);
};
