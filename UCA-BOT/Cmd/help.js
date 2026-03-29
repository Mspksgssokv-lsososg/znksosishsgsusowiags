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

        // ✅ FIXED PATH (no duplicate folder issue)
        const commandPath = __dirname;

        const commandFiles = fs.readdirSync(commandPath)
            .filter(file => file.endsWith(".js") && file !== "help.js");

        const config = require("../../UCA.Config/config.js");

        let prefix = "!";
        let categories = {};
        let totalCommands = 0;

        // ================= LOAD COMMANDS =================
        for (const file of commandFiles) {
            try {
                const command = require(path.join(commandPath, file));

                if (!command || !command.name) continue;

                const category = command.category || command.commandCategory || "OTHER";

                if (!categories[category]) categories[category] = [];

                categories[category].push(command);
                totalCommands++;

            } catch (err) {
                console.log("Error loading:", file, err.message);
            }
        }

        // ================= SEARCH / COMMAND INFO =================
        if (args[0]) {

            // 🔍 SEARCH BY LETTER
            if (args[0] === "-s" && args[1]) {
                const letter = args[1].toLowerCase();

                const matches = Object.values(categories)
                    .flat()
                    .filter(cmd => cmd.name.toLowerCase().startsWith(letter));

                if (!matches.length) {
                    return bot.sendMessage(chatId, `❌ '${letter}' দিয়ে কোনো command পাওয়া যায়নি।`);
                }

                let text = `✨ Commands starting with '${letter.toUpperCase()}' ✨\n\n`;
                matches.forEach(cmd => text += `✧ ${cmd.name}\n`);

                return bot.sendMessage(chatId, text, { reply_to_message_id: message_id });
            }

            // 🔎 SINGLE COMMAND
            const name = args[0].toLowerCase();

            const command = Object.values(categories)
                .flat()
                .find(cmd =>
                    cmd.name.toLowerCase() === name ||
                    (cmd.aliases && cmd.aliases.includes(name))
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
            let info = `
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

            return bot.sendMessage(chatId, info, { reply_to_message_id: message_id });
        }

        // ================= FULL HELP LIST =================
        let helpText = `✨ Guide For Beginners ✨\n\n`;

        for (const category in categories) {
            helpText += `╭──── [ ${category.toUpperCase()} ]\n`;
            helpText += `│ ${categories[category].map(cmd => "✧ " + cmd.name).join("\n│ ")}\n`;
            helpText += `╰───────────────◊\n`;
        }

        helpText += `
╭─『 ${(config.botName || "BOT").toUpperCase()} 』
├‣ Total Commands: ${totalCommands}
├‣ Prefix: ${prefix}
├‣ Admin: ${config.adminName || "Unknown"}
╰───────────────◊`;

        return bot.sendMessage(chatId, helpText, { reply_to_message_id: message_id });
    }
};
