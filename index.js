const TelegramBot = require("node-telegram-bot-api");
const config = require("./UCA-Config/config");
const loader = require("./Rakib/loader");
const banner = require("./Rakib/banner");

const bot = new TelegramBot(config.token, { polling: true });

banner();
loader(bot);

console.log("🤖 Bot is running...");
