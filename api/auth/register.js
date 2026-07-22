const pool = require('../db/connection');
const auth = require('../utils/auth');
const validators = require('../utils/validators');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = validators.validate(req.body, validators.registerSchema);

    // Check if user exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [data.email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password and create user
    const passwordHash = await auth.hashPassword(data.password);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [data.email, passwordHash, data.name]
    );

    const user = result.rows[0];
    const token = auth.generateToken(user.id, user.email);

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    if (err.status) {
      return res.status(err.status).json({ error: err.message, errors: err.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
