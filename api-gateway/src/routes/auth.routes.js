const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

function createAuthRoutes(authServiceUrl) {
  const router = express.Router();

  router.use('/auth', createProxyMiddleware({
    target: authServiceUrl,
    changeOrigin: true,
    pathRewrite: { '^/auth': '' },

    onProxyRes: (proxyRes) => {
      const location = proxyRes.headers['location'];
      if (location && location.startsWith('/') && location !== '/auth' && !location.startsWith('/auth/')) {
        proxyRes.headers['location'] = '/auth' + location;
      }
    },
  }));

  return router;
}

module.exports = createAuthRoutes;
