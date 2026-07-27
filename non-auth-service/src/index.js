const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { loadSecrets } = require('./config/secrets');
const swaggerSpec = require('./config/swagger.config');
const profileRoutes = require('./routes/profile.routes');
const categoryRoutes = require('./routes/category.routes');

const PORT = 4002;

async function main() {
  await loadSecrets([]);

  const app = express();
  app.use(express.json());

  app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(profileRoutes);
  app.use(categoryRoutes);

  app.listen(PORT, () => {
    console.log(`Non-auth service listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('non-auth-service failed to start:', err.message);
  process.exit(1);
});
