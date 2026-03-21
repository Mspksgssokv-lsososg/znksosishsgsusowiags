const config = require("../UCA-Config/config");
const noPrefix = require("../package.json");

module.exports = async (bot, msg) => {
  if (!msg || !msg.text) return;

  const text = msg.text.toLowerCase();
  const userName = msg.from.first_name || "Unknown User"; 
  const userId = msg.from.id; 

  if (noPrefix && Array.isArray(noPrefix.noprefix) && noPrefix.noprefix.includes(text)) {
    console.log(`\x1b[36m[NO-PREFIX]\x1b[0m User: ${userName} (${userId}) -> Msg: ${text}`);
    return bot.sendMessage(msg.chat.id, "👋 Hello there!");
  }

  const prefix = config.prefix;
  if (!msg.text.startsWith(prefix)) return;

  const args = msg.text.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  const command = bot.commands.get(cmdName);
  
  if (command) {
    console.log(`\x1b[32m[COMMAND]\x1b[0m User: ${userName} (${userId}) -> Cmd: ${prefix}${cmdName}`);
    
    try {
      await command.run(bot, msg, args);
    } catch (err) {
      console.error("\x1b[31m[ERROR]\x1b[0m Command Execution Error:", err);
    }
  } else {
    
    console.log(`\x1b[33m[UNKNOWN]\x1b[0m User: ${userName} -> Unknown Cmd: ${prefix}${cmdName}`);
  }
};
