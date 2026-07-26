const crypto = require('crypto');
const { ALGORITHM, KEY, IV } = require('../config/crypto.config');

function encrypt(plainText) {
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);

  return {
    encryptedData: encrypted.toString('hex'),
    authTag: cipher.getAuthTag().toString('hex'),
  };
}

module.exports = { encrypt };


