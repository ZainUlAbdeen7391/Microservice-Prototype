const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { loadSecrets } = require('./secrets');

async function main() {
  const { API_GATEWAY_PORT, AUTH_SERVICE_URL, NON_AUTH_SERVICE_URL } = await loadSecrets([
    'API_GATEWAY_PORT',
    'AUTH_SERVICE_URL',
    'NON_AUTH_SERVICE_URL',
  ]);

  const app = express();

  app.use('/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/auth': '' },
  }));

  app.use('/api', createProxyMiddleware({
    target: NON_AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  }));

  app.listen(API_GATEWAY_PORT, () => {
    console.log(`API Gateway listening on port ${API_GATEWAY_PORT}`);
  });
}

main().catch((err) => {
  console.error('api-gateway failed to start:', err.message);
  process.exit(1);
});
