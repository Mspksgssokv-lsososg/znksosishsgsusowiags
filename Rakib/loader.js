const fs = require("fs");
const path = require("path");

module.exports = (bot) => {
  bot.commands = new Map();

  // Commands load
  const cmdPath = path.join(__dirname, "../UCA-BOT/Cmd");
  const cmdFiles = fs.readdirSync(cmdPath).filter(f => f.endsWith(".js"));

  for (const file of cmdFiles) {
    const cmd = require(`${cmdPath}/${file}`);
    bot.commands.set(cmd.name, cmd);
  }

  // Events load
  const eventPath = path.join(__dirname, "../UCA-BOT/Event");
  const eventFiles = fs.readdirSync(eventPath).filter(f => f.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`${eventPath}/${file}`);
    event(bot);
  }
};
