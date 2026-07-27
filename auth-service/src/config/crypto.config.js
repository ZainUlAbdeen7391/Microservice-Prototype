const ALGORITHM = 'aes-256-gcm';

const KEY_HEX = process.env.AUTH_ENCRYPTION_KEY;
const IV_HEX = process.env.AUTH_ENCRYPTION_IV;

if (!KEY_HEX || !IV_HEX) {
  throw new Error(
    'AUTH_ENCRYPTION_KEY and AUTH_ENCRYPTION_IV must be set (sourced from Infisical).'
  );
}

const KEY = Buffer.from(KEY_HEX, 'hex');
const IV = Buffer.from(IV_HEX, 'hex');

module.exports = { ALGORITHM, KEY, IV };
