const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { loadSecrets } = require('./secrets');
const swaggerSpec = require('./swagger');

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in with an email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 email:
 *                   type: string
 *                 encryptedPassword:
 *                   type: object
 *                   properties:
 *                     encryptedData:
 *                       type: string
 *                     authTag:
 *                       type: string
 *       400:
 *         description: email or password missing
 */

/**
 * @openapi
 * /api/get-profile:
 *   get:
 *     summary: Retrieve the profile
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your profile  has been retrieved successfully
 *
 * /api/update-profile:
 *   put:
 *     summary: Update the profile
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your profile has been updated successfully
 *
 * /api/get-category:
 *   get:
 *     summary: Get category data
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Category list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

async function main() {
  const { API_GATEWAY_PORT, AUTH_SERVICE_URL, NON_AUTH_SERVICE_URL } = await loadSecrets([
    'API_GATEWAY_PORT',
    'AUTH_SERVICE_URL',
    'NON_AUTH_SERVICE_URL',
  ]);

  const app = express();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/auth': '' },
  }));

  app.use('/api', createProxyMiddleware({
    target: NON_AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    // non-auth-service (e.g. swagger-ui-express) issues redirects and builds
    // asset URLs with no idea it's sitting behind the /api prefix stripped
    // above. Re-add /api to any relative redirect so the browser stays
    // under a path the gateway actually proxies.
    onProxyRes: (proxyRes, req, res) => {
      const location = proxyRes.headers['location'];
      if (location && location.startsWith('/') && !location.startsWith('/api')) {
        proxyRes.headers['location'] = '/api' + location;
      }
    },
  }));

  app.listen(API_GATEWAY_PORT, () => {
    console.log(`API Gateway listening on port ${API_GATEWAY_PORT}`);
  });
}

main().catch((err) => {
  console.error('api-gateway failed to start:', err.message);
  process.exit(1);
});
