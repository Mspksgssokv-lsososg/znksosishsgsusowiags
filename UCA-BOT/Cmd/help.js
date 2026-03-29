const fs = require("fs");
const path = require("path");

module.exports = {
    name: "help",
    credits: "RAKIB MAHMUD",
    prefix: false,
    description: "বটের সব কমান্ডের লিস্ট এবং ব্যবহার দেখার জন্য।",

    run: async (bot, msg, args) => {
        const chatId = msg.chat.id;
        const message_id = msg.message_id;

        const commandPath = path.join(__dirname, "../UCA-BOT/Cmd");
        const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));

        const config = require("../UCA.Config/config.js");

        // prefix fallback
        let prefix = "!";

        let categories = {};
        let totalCommands = 0;

        for (const file of commandFiles) {
            const command = require(path.join(commandPath, file));

            if (!command) continue;

            const category = command.category || command.commandCategory || "OTHER";

            if (!categories[category]) categories[category] = [];

            categories[category].push(command);
            totalCommands++;
        }

        // ================= SEARCH =================
        if (args[0]) {

            if (args[0] === "-s" && args[1]) {
                const searchLetter = args[1].toLowerCase();

                const matchingCommands = Object.values(categories)
                    .flat()
                    .filter(cmd => cmd.name && cmd.name.startsWith(searchLetter));

                if (matchingCommands.length === 0) {
                    return bot.sendMessage(chatId, `❌ '${searchLetter}' দিয়ে কোনো command পাওয়া যায়নি।`);
                }

                let searchMessage = `✨ Commands Starting With '${searchLetter.toUpperCase()}' ✨\n\n`;
                matchingCommands.forEach(cmd => {
                    searchMessage += `✧ ${cmd.name}\n`;
                });

                return bot.sendMessage(chatId, searchMessage, { reply_to_message_id: message_id });
            }

            // ================= SINGLE COMMAND =================
            const commandName = args[0].toLowerCase();

            const command = Object.values(categories)
                .flat()
                .find(cmd =>
                    cmd.name === commandName ||
                    (cmd.aliases && cmd.aliases.includes(commandName))
                );

            if (!command) {
                return bot.sendMessage(chatId, "❌ Command not found.");
            }

            let guide = command.guide || command.usages || "No usage available";
            guide = guide.replace(/{prefix}|{p}/g, prefix);

            // usage
            if (args[1] === "-u") {
                return bot.sendMessage(chatId,
                    `📝 Usage:\n${prefix}${command.name} ${guide}`,
                    { reply_to_message_id: message_id }
                );
            }

            // aliases
            if (args[1] === "-a") {
                return bot.sendMessage(chatId,
                    `🪶 Aliases: ${command.aliases ? command.aliases.join(", ") : "None"}`,
                    { reply_to_message_id: message_id }
                );
            }

            // full info
            let commandInfo = `
╭──✦ [ ${command.name.toUpperCase()} ]
├‣ 📜 Name: ${command.name}
├‣ 👤 Credits: ${command.credits || command.author || "Unknown"}
├‣ 🔑 Permission: ${command.role === 0 ? "Everyone" : "Admin"}
├‣ 🪶 Aliases: ${command.aliases ? command.aliases.join(", ") : "None"}
├‣ 📜 Description: ${command.description || "No description"}
├‣ 📚 Guide: ${guide}
├‣ 🚩 Prefix: ${prefix}
├‣ ⚜️ Premium: ${command.premium ? "Yes" : "No"}
╰───────────────◊`;

            return bot.sendMessage(chatId, commandInfo, { reply_to_message_id: message_id });
        }

        // ================= ALL COMMAND LIST =================
        let helpMessage = `✨ Guide For Beginners ✨\n\n`;

        for (const category in categories) {
            helpMessage += `╭──── [ ${category.toUpperCase()} ]\n`;
            helpMessage += `│ ${categories[category].map(cmd => "✧ " + cmd.name).join("\n│ ")}\n`;
            helpMessage += `╰───────────────◊\n`;
        }

        helpMessage += `
╭─『 ${config.botName || "BOT"} 』
├‣ Total Commands: ${totalCommands}
├‣ Prefix: ${prefix}
├‣ Admin: ${config.adminName || "Unknown"}
╰───────────────◊`;

        return bot.sendMessage(chatId, helpMessage, { reply_to_message_id: message_id });
    }
};
