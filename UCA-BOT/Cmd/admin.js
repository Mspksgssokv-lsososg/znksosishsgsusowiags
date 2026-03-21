const fs = require('fs/promises');
const path = require('path');
const config = require("../../UCA-Config/config");
const CONFIG_FILE_PATH = path.resolve(__dirname, '../../UCA-Config/config.js');

module.exports = {
    name: "admin",
    credits: "RAKIB MAHMUD",
    aliases: ["ad", "adlist"],
    description: "Manage bot admin list (Add, Remove, List).",
    
    run: async (bot, msg, args) => {
        const chatId = msg.chat.id;
        const messageId = msg.message_id;
        const senderId = msg.from.id;
        const prefix = config.prefix;
        
        const botOwnerId = config.admins[0];

        async function getUserInfo(bot, chatId, userId) {
            try {
                const member = await bot.getChatMember(chatId, userId);
                let name = member.user.first_name || 'N/A';
                if (member.user.last_name) name += ' ' + member.user.last_name;
                return name;
            } catch (error) {
                return 'Unknown User';
            }
        }

        async function updateConfigFile() {
            const content = `module.exports = {\n  token: "${config.token}",\n  prefix: "${config.prefix}",\n  admins: ${JSON.stringify(config.admins)},\n\n  saveAdmin: function(userId) {\n    if (!this.admins.includes(userId)) {\n      this.admins.push(userId);\n      return true;\n    }\n    return false;\n  }\n};`;
            await fs.writeFile(CONFIG_FILE_PATH, content, 'utf8');
        }

        if (senderId !== botOwnerId) {
             return bot.sendMessage(chatId, `❌ **Access Denied!**\nOnly the Bot Owner can control this.`, { reply_to_message_id: messageId, parse_mode: 'Markdown' });
        }

        const action = args[0]?.toLowerCase();
        let targetId;

        if (action === "add" || action === "remove") {
            if (msg.reply_to_message) {
                targetId = msg.reply_to_message.from.id;
            } else if (args[1] && !isNaN(args[1])) {
                targetId = parseInt(args[1]);
            } else {
                return bot.sendMessage(chatId, `⚠️ **Usage Guide:**\n» \`${prefix}admin add\` (reply to user)\n» \`${prefix}admin remove\` (reply to user)\n» \`${prefix}admin list\``, { reply_to_message_id: messageId, parse_mode: 'Markdown' });
            }
        }
        
        if (action === "add") {
            if (config.admins.includes(targetId)) {
                return bot.sendMessage(chatId, `⚠️ **Already Authorized!**\nThis user is already in the Admin list.`, { reply_to_message_id: messageId, parse_mode: 'Markdown' });
            }
            config.admins.push(targetId);
            await updateConfigFile();
            const name = await getUserInfo(bot, chatId, targetId);
            return bot.sendMessage(chatId, `✅ **Admin Added Successfully!**\n━━━━━━━━━━━━━━━━━━\n👤 **Name:** ${name}\n🆔 **ID:** \`${targetId}\`\n━━━━━━━━━━━━━━━━━━`, { reply_to_message_id: messageId, parse_mode: 'Markdown' });
            
        } else if (action === "remove") {
            if (targetId === botOwnerId) {
                return bot.sendMessage(chatId, `❌ **Action Blocked!**\nYou cannot remove the Main Owner.`, { reply_to_message_id: messageId, parse_mode: 'Markdown' });
            }
            const index = config.admins.indexOf(targetId);
            if (index === -1) {
                return bot.sendMessage(chatId, `⚠️ **Not Found!**\nThis user is not an Admin.`, { reply_to_message_id: messageId, parse_mode: 'Markdown' });
            }
            config.admins.splice(index, 1);
            await updateConfigFile();
            const name = await getUserInfo(bot, chatId, targetId);
            return bot.sendMessage(chatId, `🗑️ **Admin Removed!**\n━━━━━━━━━━━━━━━━━━\n👤 **Name:** ${name}\n🆔 **ID:** \`${targetId}\`\n━━━━━━━━━━━━━━━━━━`, { reply_to_message_id: messageId, parse_mode: 'Markdown' });

        } else if (action === "list" || !action) {
            let adminListMsg = "╭━━━━❰ 👑 **BOT ADMINS** ❱━━━━╮\n";
            for (let i = 0; i < config.admins.length; i++) {
                const id = config.admins[i];
                const name = await getUserInfo(bot, chatId, id); 
                adminListMsg += `│ ${i + 1}. ${name}\n│    └─ 🆔 \`${id}\` ${i === 0 ? "👑" : "🛠️"}\n`;
            }
            adminListMsg += "╰━━━━━━━━━━━━━━━━━━━━━━❍";
            return bot.sendMessage(chatId, adminListMsg, { reply_to_message_id: messageId, parse_mode: 'Markdown' });

        } else {
            return bot.sendMessage(chatId, `⚠️ **Invalid Action!**\nUse \`add\`, \`remove\` or \`list\`.`, { reply_to_message_id: messageId, parse_mode: 'Markdown' });
        }
    }
};
