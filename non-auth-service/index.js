const express = require('express');
const { loadSecrets } = require('./secrets');

async function main() {
  const { NON_AUTH_SERVICE_PORT } = await loadSecrets(['NON_AUTH_SERVICE_PORT']);

  const app = express();

  app.get('/data', (req, res) => {
    res.json({ service: 'non-auth-service', message: 'Core features of this application' });
  });

  app.listen(NON_AUTH_SERVICE_PORT, () => {
    console.log(`Non-auth service listening on port ${NON_AUTH_SERVICE_PORT}`);
  });
}

main().catch((err) => {
  console.error('non-auth-service failed to start:', err.message);
  process.exit(1);
});
