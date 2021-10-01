const generateMessage = (username, text) => {
  if (!text.trim()) {
    return;
  }
  
  return {
    username,
    text,
    createdAt: new Date().getTime()
  };
};

module.exports = {
  generateMessage
}