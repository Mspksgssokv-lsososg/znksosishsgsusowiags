const config = require("../UCA-Config/config");

module.exports = {
  isAdmin: (userId) => {
    return config.admins.includes(userId);
  }
};
