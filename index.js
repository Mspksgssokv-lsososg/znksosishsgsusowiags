const TelegramBot = require("node-telegram-bot-api");
const config = require("./UCA-Config/config");
const loader = require("./Rakib/loader");
const banner = require("./Rakib/banner");

const bot = new TelegramBot(config.token, { polling: true });

// কালার কোড
const cyan = "\x1b[36m";
const yellow = "\x1b[33m";
const green = "\x1b[32m";
const bold = "\x1b[1m";
const reset = "\x1b[0m";

banner();
loader(bot);

// আপনার দেওয়া ডিজাইন অনুযায়ী আউটপুট
console.log(`${yellow}==============================================${reset}`);
console.log(`${cyan}${bold}╦═╗╔═╗╦╔═ ╦╔╗   ╔╗ ╔═╗╔╦╗`);
console.log(`╠╦╝╠═╣╠╩╗ ║╠╩╗  ╠╩╗║ ║ ║ `);
console.log(`╩╚═╩ ╩╩ ╩ ╩╚═╝  ╚═╝╚═╝ ╩${reset}`);
console.log(`${yellow}==============================================${reset}`);
console.log(`${bold}OWNNER   :${reset} Rakib Chowdhury`);
console.log(`${bold}Facebook :${reset} https://www.facebook.com/SYSTEM.ERROR.KING`);
console.log(`${bold}Whatsapp :${reset} wa.me/+8801771306867\n`);
console.log(`${bold}UCA Enjoy Rakib Bot🤙${reset}`);
console.log(`${yellow}==============================================${reset}`);
console.log(`${green}${bold}RAKIB PROJECT VERSION 4.0.0${reset}`);
console.log(`${yellow}==============================================${reset}`);
