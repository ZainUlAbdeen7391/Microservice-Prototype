const express = require('express');


const app = express();
const PORT = process.env.PORT || 4002;


app.get('/data', (req, res) => {
  res.json({ service: 'non-auth-service', message: 'Core features of this application' });
});

app.listen(PORT, () => {
  console.log(`Non-auth service listening on port ${PORT}`);
});


