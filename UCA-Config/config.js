module.exports = {
  token: "8662229890:AAE2Duasul4Lvxbk3bzQ1tgmd3f90t75YfE",
  prefix: "/", 
  admins: [6734899387], 

  saveAdmin: function(userId) {
    if (!this.admins.includes(userId)) {
      this.admins.push(userId);
      return true;
    }
    return false;
  }
};
