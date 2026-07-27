const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { loadSecrets } = require('./config/secrets');
const { buildSwaggerSpec } = require('./config/swagger.config');
const createAuthRoutes = require('./routes/auth.routes');
const createNonAuthRoutes = require('./routes/nonAuth.routes');

async function main() {
  const { API_GATEWAY_PORT, AUTH_SERVICE_URL, NON_AUTH_SERVICE_URL } = await loadSecrets([
    'API_GATEWAY_PORT',
    'AUTH_SERVICE_URL',
    'NON_AUTH_SERVICE_URL',
  ]);

  // No docs are authored here - each service owns and serves its own spec at
  // /api-docs.json; this fetches both and merges them into a single view.
  const swaggerSpec = await buildSwaggerSpec({
    authServiceUrl: AUTH_SERVICE_URL,
    nonAuthServiceUrl: NON_AUTH_SERVICE_URL,
  });

  const app = express();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(createAuthRoutes(AUTH_SERVICE_URL));
  app.use(createNonAuthRoutes(NON_AUTH_SERVICE_URL));

  app.listen(API_GATEWAY_PORT, () => {
    console.log(`API Gateway listening on port ${API_GATEWAY_PORT}`);
  });
}

main().catch((err) => {
  console.error('api-gateway failed to start:', err.message);
  process.exit(1);
});
