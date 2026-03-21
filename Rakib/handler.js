const config = require("../UCA-Config/config");
const noPrefix = require("../package.json");

module.exports = async (bot, msg) => {
  if (!msg || !msg.text) return;

  const text = msg.text.toLowerCase();

  if (noPrefix && Array.isArray(noPrefix.noprefix) && noPrefix.noprefix.includes(text)) {
    return bot.sendMessage(msg.chat.id, "👋 Hello there!");
  }

  const prefix = config.prefix;
  if (!msg.text.startsWith(prefix)) return;

  const args = msg.text.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  const command = bot.commands.get(cmdName);
  if (!command) return;

  try {
    await command.run(bot, msg, args);
  } catch (err) {
    console.error("Command Error:", err);
  }
};
