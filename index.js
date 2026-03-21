const TelegramBot = require("node-telegram-bot-api");
const config = require("./UCA-Config/config");
const loader = require("./Rakib/loader");
const banner = require("./Rakib/banner");

const bot = new TelegramBot(config.token, { polling: true });

banner();
loader(bot);

console.log('🤖 ====================================================
            ╦═╗╔═╗╦╔═ ╦╔╗   ╔╗ ╔═╗╔╦╗
╠╦╝╠═╣╠╩╗ ║╠╩╗  ╠╩╗║ ║ ║ 
╩╚═╩ ╩╩ ╩ ╩╚═╝  ╚═╝╚═╝ ╩ 
________________________________________
OWNNER   : Rakib Chowdhury
Facebook   : https://www.facebook.com/SYSTEM.ERROR.KING
Whatsapp   : wa.me/+8801771306867

 MSG Enjoy Rakib Bot🤙
 _______________________________________ 
RAKIB PROJECT VERSION 4.0.0
______________________________________..');
