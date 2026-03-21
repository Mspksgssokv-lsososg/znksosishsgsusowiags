const handler = require("../../Rakib/handler");

module.exports = (bot) => {
  bot.on("message", (msg) => {
    handler(bot, msg);
  });
};
