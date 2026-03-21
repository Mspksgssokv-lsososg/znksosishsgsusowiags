const fs = require("fs");
const path = require("path");

module.exports = (bot) => {
  bot.commands = new Map();

  console.log(`\x1b[35m┌──────────────────────────────────────────────┐\x1b[0m`);
  console.log(`\x1b[35m│\x1b[0m   🚀 \x1b[1mRAKIB-BOT SYSTEM INITIALIZING...\x1b[0m         \x1b[35m│\x1b[0m`);
  console.log(`\x1b[35m├──────────────────────────────────────────────┤\x1b[0m`);

  // --- Commands loading ---
  const cmdPath = path.join(__dirname, "../UCA-BOT/Cmd");
  const cmdFiles = fs.readdirSync(cmdPath).filter(f => f.endsWith(".js"));

  console.log(`\x1b[35m│\x1b[0m \x1b[33m[📂] Loading Commands:\x1b[0m                       \x1b[35m│\x1b[0m`);
  for (const file of cmdFiles) {
    try {
      const cmd = require(`${cmdPath}/${file}`);
      bot.commands.set(cmd.name, cmd);
      console.log(`\x1b[35m│\x1b[0m  \x1b[32m✅\x1b[0m ${file.padEnd(40)} \x1b[35m│\x1b[0m`);
    } catch (err) {
      console.log(`\x1b[35m│\x1b[0m  \x1b[31m❌\x1b[0m ${file.padEnd(40)} \x1b[35m│\x1b[0m`);
    }
  }

  console.log(`\x1b[35m├──────────────────────────────────────────────┤\x1b[0m`);

  // --- Events loading ---
  const eventPath = path.join(__dirname, "../UCA-BOT/Event");
  const eventFiles = fs.readdirSync(eventPath).filter(f => f.endsWith(".js"));

  console.log(`\x1b[35m│\x1b[0m \x1b[33m[🔔] Loading Events:\x1b[0m                         \x1b[35m│\x1b[0m`);
  for (const file of eventFiles) {
    try {
      const event = require(`${eventPath}/${file}`);
      event(bot);
      console.log(`\x1b[35m│\x1b[0m  \x1b[32m✅\x1b[0m ${file.padEnd(40)} \x1b[35m│\x1b[0m`);
    } catch (err) {
      console.log(`\x1b[35m│\x1b[0m  \x1b[31m❌\x1b[0m ${file.padEnd(40)} \x1b[35m│\x1b[0m`);
    }
  }

  console.log(`\x1b[35m└──────────────────────────────────────────────┘\x1b[0m\n`);
};
