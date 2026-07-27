const swaggerJsdoc = require('swagger-jsdoc');

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      version: '1.0.0',
      description: 'Authentication endpoints for auth-service.',
    },
  },
  apis: ['./src/routes/*.js'],
});

module.exports = spec;
