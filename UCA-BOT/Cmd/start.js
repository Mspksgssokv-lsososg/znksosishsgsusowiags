module.exports = {
  name: "start",
  run: (bot, msg) => {
    bot.sendMessage(msg.chat.id, "👋 Welcome to Rakib Bot!");
  }
};
