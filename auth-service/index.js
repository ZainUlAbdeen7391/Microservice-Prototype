const express = require('express');
const { loadSecrets } = require('./secrets');

async function main() {
  const { AUTH_SERVICE_PORT } = await loadSecrets(['AUTH_SERVICE_PORT']);

  const app = express();

  app.get('/login', (req, res) => {
    res.json({ service: 'auth-service', message: 'You are Logged in successfully' });
  });

  app.listen(AUTH_SERVICE_PORT, () => {
    console.log(`Auth service listening on port ${AUTH_SERVICE_PORT}`);
  });
}

main().catch((err) => {
  console.error('auth-service failed to start:', err.message);
  process.exit(1);
});
