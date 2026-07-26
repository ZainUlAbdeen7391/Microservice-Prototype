const authService = require('../service/auth.service');

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  res.json(authService.login(email, password));
}

module.exports = { login };
