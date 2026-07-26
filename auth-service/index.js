const express = require('express');
const authRoutes = require('./src/routes/auth.routes');

const PORT = 4001;

const app = express();
app.use(express.json());

app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});
