const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:4001';
const NON_AUTH_SERVICE_URL = process.env.NON_AUTH_SERVICE_URL || 'http://non-auth-service:4002';

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

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
