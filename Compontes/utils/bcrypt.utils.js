const Bcrypt = require('bcrypt');

const bcrypt = async (password) => {
  return await Bcrypt.hash(password, 10);  
};

const bcryptCompare = async (password, userPassword) => {
  return await Bcrypt.compare(password, userPassword);  
};

module.exports = { bcrypt, bcryptCompare };
