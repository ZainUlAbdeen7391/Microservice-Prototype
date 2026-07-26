const swaggerJsdoc = require('swagger-jsdoc');

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservices API',
      version: '1.0.0',
      description: 'Combined API documentation for every service, described exactly as it is reachable through the API Gateway.',
    },
  },
  apis: ['./index.js'],
});

module.exports = spec;
