module.exports = {
  token: "7387717029:AAF_HQ6rOXxjT0VSyANiwqoWYREXuaO03C0", 
  prefix: "/", 
  admins: [8378935950], 

  saveAdmin: function(userId) {
    if (!this.admins.includes(userId)) {
      this.admins.push(userId);
      return true;
    }
    return false;
  }
};
