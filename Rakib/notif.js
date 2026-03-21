module.exports = async (bot, users, message) => {
  for (const id of users) {
    try {
      await bot.sendMessage(id, message);
    } catch (err) {
      console.log("Failed to send:", id);
    }
  }
};
