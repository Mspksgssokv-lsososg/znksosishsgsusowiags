module.exports = {
    name: "help",
    credits: "RAKIB MAHMUD",
    description: "বটের সব কমান্ডের লিস্ট এবং ব্যবহার দেখার জন্য।",

    run: async (bot, msg, args) => {
        const chatId = msg.chat.id;
        const message_id = msg.message_id;
        
        
        const commands = bot.commands; 
        const prefix = "/"; 

        
        if (args[0]) {
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName);

            if (command) {
                const helpDetail = `
╔══ 『 COMMAND: ${command.name.toUpperCase()} 』 ═╗
║ 📜 Name      : ${command.name}
║ 👤 Credits   : ${command.credits || "RAKIB MAHMUD"}
╠════════════════════╣
║ ℹ INFORMATION
║ ────────────────────
║ Description :
║ ${command.description || "কোনো বর্ণনা দেওয়া নেই।"}
║
║ 💡 Usage: ${prefix}${command.name}
╚════════════════════╝`;
                return bot.sendMessage(chatId, helpDetail, { reply_to_message_id: message_id });
            } else {
                return bot.sendMessage(chatId, `❌ "${commandName}" নামে কোনো কমান্ড পাওয়া যায়নি!`, { reply_to_message_id: message_id });
            }
        }

        
        let totalCmds = commands.size;
        let listText = `╭─────────────◊\n`;
        let index = 1;

        commands.forEach((cmd) => {
            listText += `│ ${index++} ✧ ${prefix}${cmd.name}\n`;
        });

        listText += `╰───────────────◊\n\n`;

        const footerText = `
╭─✦『 UCA RAKIB BOT 』✦──╮
│                             
│ ✦ Total commands: ${totalCmds}             
│ ✦ Admin: Rakib Chowdhury       
│                             
│ ✦ বিস্তারিত জানতে: ${prefix}help [name] 
╰─────────────────────╯`;

        try {
            await bot.sendMessage(chatId, listText + footerText, { reply_to_message_id: message_id });
        } catch (err) {
            console.error("Help Error:", err.message);
        }
    }
};
