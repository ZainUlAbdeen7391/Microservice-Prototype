const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { loadSecrets } = require('./config/secrets');

const PORT = 4001;

async function main() {
  const { AUTH_ENCRYPTION_KEY, AUTH_ENCRYPTION_IV } = await loadSecrets([
    'AUTH_ENCRYPTION_KEY',
    'AUTH_ENCRYPTION_IV',
  ]);

  process.env.AUTH_ENCRYPTION_KEY = AUTH_ENCRYPTION_KEY;
  process.env.AUTH_ENCRYPTION_IV = AUTH_ENCRYPTION_IV;

  const swaggerSpec = require('./config/swagger.config');
  const authRoutes = require('./routes/auth.routes');

  const app = express();
  app.use(express.json());

  app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(authRoutes);

  app.listen(PORT, () => {
    console.log(`Auth service listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('auth-service failed to start:', err.message);
  process.exit(1);
});
