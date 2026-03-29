module.exports = {
  token: "8641802039:AAHHAVHoVD0EhtjQyXtbQZ4sYJL9g-mjuAk",
  prefix: "/", 
  admins: [6734899387],

  adminName: "SK-SIDDIK-KHAN", 

  saveAdmin: function(userId) {
    if (!this.admins.includes(userId)) {
      this.admins.push(userId);
      return true;
    }
    return false;
  }
};
