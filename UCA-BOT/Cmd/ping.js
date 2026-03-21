module.exports = {
  name: "ping",
  run: (bot, msg) => {
    bot.sendMessage(msg.chat.id, "🏓 Pong!");
  }
};
