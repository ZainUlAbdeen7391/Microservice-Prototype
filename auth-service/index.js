const express = require('express');

const app = express();
const PORT = process.env.PORT || 4001;

app.get('/login', (req, res) => {
  res.json({ service: 'auth-service', message: 'You are Logged in successfully' });
});

app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});
