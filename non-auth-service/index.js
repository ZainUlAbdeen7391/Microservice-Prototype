const express = require('express');

const PORT = 4002;

const app = express();

app.get('/data', (req, res) => {
  res.json({ service: 'non-auth-service', message: 'Core features of this application' });
});

app.listen(PORT, () => {
  console.log(`Non-auth service listening on port ${PORT}`);
});
