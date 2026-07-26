const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/swagger');
const profileRoutes = require('./src/routes/profile.routes');
const categoryRoutes = require('./src/routes/category.routes');

const PORT = 4002;

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(profileRoutes);
app.use(categoryRoutes);

app.listen(PORT, () => {
  console.log(`Non-auth service listening on port ${PORT}`);
});


