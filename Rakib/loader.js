const fs = require("fs");
const path = require("path");
const config = require("../UCA-Config/config");
 
module.exports = (bot) => {
  bot.commands = new Map();
 
  const g = "\x1b[32m", c = "\x1b[36m", y = "\x1b[33m", r = "\x1b[0m";
 
  console.log(`${y}--- Loading System Files ---${r}`);
 
  
  const cmdPath = path.join(__dirname, "../UCA-BOT/Cmd");
  const cmdFiles = fs.readdirSync(cmdPath).filter(f => f.endsWith(".js"));
 
  for (const file of cmdFiles) {
    try {
      const cmd = require(`${cmdPath}/${file}`);
      if (cmd.name !== undefined) {
          bot.commands.set(cmd.name, cmd);
          console.log(`${g}✅ Command Loaded: ${file}${r}`);
      }
    } catch (err) {
      console.log(`${y}❌ Error in: ${file} -> ${err.message}${r}`);
    }
  }
 
  
  bot.on("message", async (msg) => {
        if (!msg.text) return;

        const text = msg.text.trim();
        const lowerText = text.toLowerCase();
        const prefix = config.prefix;

        const args = lowerText.startsWith(prefix)
            ? lowerText.slice(prefix.length).trim().split(/ +/)
            : lowerText.split(/ +/);

        const commandName = args.shift();

        const command = Array.from(bot.commands.values()).find(cmd => 
            cmd.name === commandName || cmd.aliases?.includes(commandName)
        );

        if (!command) return;

        if (command.prefix !== false && !lowerText.startsWith(prefix)) return;

        try {
        command.run(bot, msg, args);
      } catch (err) {
        console.log(`${y}❌ Command Error (${commandName}): ${err.message}${r}`);
      }
    }
  });
 
  
  const eventPath = path.join(__dirname, "../UCA-BOT/Event");
  if (fs.existsSync(eventPath)) {
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
  }
 
  console.log(`${y}--- System is Online! ---${r}\n`);
};
 
