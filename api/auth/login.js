const pool = require('../db/connection');
const auth = require('../utils/auth');
const validators = require('../utils/validators');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = validators.validate(req.body, validators.loginSchema);

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [data.email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const passwordMatch = await auth.comparePassword(data.password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const token = auth.generateToken(user.id, user.email);
    const refreshToken = auth.generateRefreshToken(user.id);

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
      refreshToken
    });
  } catch (err) {
    console.error('Login error:', err);
    if (err.status) {
      return res.status(err.status).json({ error: err.message, errors: err.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
