const ALGORITHM = 'aes-256-gcm';

const KEY_HEX = process.env.AUTH_ENCRYPTION_KEY;
const IV_HEX = process.env.AUTH_ENCRYPTION_IV;

if (!KEY_HEX || !IV_HEX) {
  console.warn(
    'WARNING: AUTH_ENCRYPTION_KEY and AUTH_ENCRYPTION_IV are not set. ' +
    'Using fallback hard-coded values for local development only.'
  );
}

const KEY = KEY_HEX
  ? Buffer.from(KEY_HEX, 'hex')
  : Buffer.from('1a71d26a1a5949cb13d64d7180d7e39115d79e46bd5bebd6e508d37735f30a5f', 'hex');
const IV = IV_HEX
  ? Buffer.from(IV_HEX, 'hex')
  : Buffer.from('11f980e6035ec61cf28e2943', 'hex');

module.exports = { ALGORITHM, KEY, IV };
