module.exports = {
  random: (arr) => arr[Math.floor(Math.random() * arr.length)],

  formatTime: (ms) => {
    const sec = Math.floor(ms / 1000);
    return `${sec}s`;
  }
};
