const config = require("../UCA-Config/config");
const noPrefix = require("../package.json");

module.exports = async (bot, msg) => {
  if (!msg || !msg.text) return;

  const text = msg.text.toLowerCase();
  const userName = msg.from.first_name || "Unknown";
  const userId = msg.from.id;
  const time = new Date().toLocaleTimeString();


  const logBox = (type, content, colorCode) => {
    console.log(`\x1b[${colorCode}m┌──────────────────────────┐\x1b[0m`);
    console.log(`\x1b[${colorCode}m│\x1b[0m \x1b[1m${type}\x1b[0m - ${time}`);
    console.log(`\x1b[${colorCode}m├──────────────────────────┤\x1b[0m`);
    console.log(`\x1b[${colorCode}m│\x1b[0m \x1b[33mUser:\x1b[0m ${userName} (\x1b[2m${userId}\x1b[0m)`);
    console.log(`\x1b[${colorCode}m│\x1b[0m \x1b[33mInfo:\x1b[0m ${content}`);
    console.log(`\x1b[${colorCode}m└──────────────────────────┘\x1b[0m\n`);
  };

  
  if (noPrefix && Array.isArray(noPrefix.noprefix) && noPrefix.noprefix.includes(text)) {
    logBox("CHAT", text, "36"); 
    return bot.sendMessage(msg.chat.id, "👋 Hello there!");
  }

  const prefix = config.prefix;
  if (!msg.text.startsWith(prefix)) return;

  const args = msg.text.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();
  const command = bot.commands.get(cmdName);

  if (command) {
    logBox("COMMAND", `${prefix}${cmdName}`, "32"); 
    try {
      await command.run(bot, msg, args);
    } catch (err) {
      console.log(`\x1b[31m[ERROR]\x1b[0m ${err.message}`);
    }
  } else {
    logBox("UNKNOWN", `${prefix}${cmdName}`, "31"); 
  }
};
