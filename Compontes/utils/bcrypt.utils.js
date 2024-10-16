const Bcrypt = require('bcrypt');

const bcrypt = async(password)=>{
   return await Bcrypt.hash(password , 10)
}
const bcryptCompare = async(password , userpassword)=>{
   return await Bcrypt.compare(password , userpassword)
}

module.exports = {bcrypt , bcryptCompare}