const swaggerJsdoc = require('swagger-jsdoc');

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Non-Auth Service API',
      version: '1.0.0',
      description: 'Profile and Category endpoints for non-auth-service.',
    },
  },
  apis: ['./src/routes/*.js'],
});

module.exports = spec;
