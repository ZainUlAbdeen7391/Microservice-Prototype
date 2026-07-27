const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

function createNonAuthRoutes(nonAuthServiceUrl) {
  const router = express.Router();

  router.use('/api', createProxyMiddleware({
    target: nonAuthServiceUrl,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },

    onProxyRes: (proxyRes) => {
      const location = proxyRes.headers['location'];
      if (location && location.startsWith('/') && location !== '/api' && !location.startsWith('/api/')) {
        proxyRes.headers['location'] = '/api' + location;
      }
    },
  }));

  return router;
}

module.exports = createNonAuthRoutes;
