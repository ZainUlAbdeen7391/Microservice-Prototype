const aesUtil = require('../utils/aes.util');

function login(email, password) {
  return {
    message: aesUtil.encrypt('You are Logged in successfully').encryptedData,
    email: aesUtil.encrypt(email).encryptedData,
    password: aesUtil.encrypt(password).encryptedData,
  };
}

module.exports = { login };
