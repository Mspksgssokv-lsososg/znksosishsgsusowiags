const config = require("../UCA-Config/config");
const noPrefix = require("../noprefix_settings.json");

module.exports = async (bot, msg) => {
  if (!msg.text) return;

  const text = msg.text.toLowerCase();

  // No prefix system
  if (noPrefix.noprefix.includes(text)) {
    return bot.sendMessage(msg.chat.id, "👋 Hello there!");
  }

  const prefix = config.prefix;
  if (!msg.text.startsWith(prefix)) return;

  const args = msg.text.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  const command = bot.commands.get(cmdName);
  if (!command) return;

  try {
    command.run(bot, msg, args);
  } catch (err) {
    console.log(err);
  }
};
