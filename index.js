const TelegramBot = require("node-telegram-bot-api");
const config = require("./UCA-Config/config");
const loader = require("./Rakib/loader");
const banner = require("./Rakib/banner");
const http = require("http");
const fs = require("fs");
const path = require("path");

// 🌐 Web server (for Render / uptime)
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('UCA RAKIB BOT 4.0.0 IS RUNNING...\n');
}).listen(port, () => {
    console.log(`\x1b[32m[SERVER] Running on port ${port}\x1b[0m`);
});

// 🤖 Telegram bot
const bot = new TelegramBot(config.token, { polling: true });

// 🎨 Console colors
const cyan = "\x1b[36m";
const yellow = "\x1b[33m";
const green = "\x1b[32m";
const bold = "\x1b[1m";
const reset = "\x1b[0m";

// 🚀 Start system
banner();
loader(bot);

// ✅ Run onLoad for all commands (IMPORTANT FIX)
const cmdPath = path.join(__dirname, "UCA-BOT/Cmd");

fs.readdirSync(cmdPath).forEach(file => {
    if (!file.endsWith(".js")) return;

    const cmd = require(`./UCA-BOT/Cmd/${file}`);
    if (cmd.onLoad) {
        try {
            cmd.onLoad(bot);
        } catch (err) {
            console.error(`onLoad error in ${file}:`, err.message);
        }
    }
});

// 📩 Message handler
bot.on('message', async (msg) => {
    const text = msg.text || "";
    const lowerText = text.toLowerCase().trim();

    // 🔗 Auto downloader
    if (text.startsWith("http") && !text.startsWith(config.prefix)) {
        try {
            const alldown = require("./UCA-BOT/Cmd/alldown");
            await alldown.run(bot, msg, [text]);
        } catch (err) {
            console.error("Auto-DL Error:", err.message);
        }
    }

    // 🤖 Auto bot reply trigger
    const triggers = ["bot", "বট", "baby"];
    const isTrigger = triggers.some(t => lowerText.startsWith(t));

    if (isTrigger && !text.startsWith(config.prefix)) {
        try {
            const botCmd = require("./UCA-BOT/Cmd/bot");

            let cleanText = text;
            triggers.forEach(t => {
                if (lowerText.startsWith(t)) {
                    cleanText = text.substring(t.length).trim();
                }
            });

            const args = cleanText ? cleanText.split(" ") : [];
            await botCmd.run(bot, msg, args);

        } catch (err) {
            console.error("Auto-Bot Error:", err.message);
        }
    }
});

// 📟 Console banner
console.log(`${yellow}====================================${reset}`);
console.log(`${cyan}${bold}╦═╗╔═╗╦╔═ ╦╔╗   ╔╗ ╔═╗╔╦╗`);
console.log(`╠╦╝╠═╣╠╩╗ ║╠╩╗  ╠╩╗║ ║ ║ `);
console.log(`╩╚═╩ ╩╩ ╩ ╩╚═╝  ╚═╝╚═╝ ╩${reset}`);
console.log(`${yellow}====================================${reset}`);
console.log(`${bold}OWNER    :${reset} Rakib Chowdhury`);
console.log(`${bold}Facebook :${reset} https://www.facebook.com/SYSTEM.ERROR.KING`);
console.log(`${bold}Whatsapp :${reset} wa.me/+8801771306867\n`);
console.log(`${bold}UCA Enjoy Rakib Bot🤙${reset}`);
console.log(`${yellow}====================================${reset}`);
console.log(`${green}${bold}RAKIB PROJECT VERSION 4.0.0${reset}`);
console.log(`${yellow}====================================${reset}`);
