const express = require('express');

const PORT = 4001;

const app = express();

app.get('/login', (req, res) => {
  res.json({ service: 'auth-service', message: 'You are Logged in successfully' });
});

app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});


