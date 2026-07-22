const fs = require('fs');
const path = require('path');
const pool = require('./db/connection');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const schema = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf8');
    const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);

    for (const statement of statements) {
      await pool.query(statement);
    }

    res.status(200).json({
      success: true,
      message: 'Database migrations completed successfully'
    });
  } catch (err) {
    console.error('Migration error:', err);
    res.status(500).json({
      error: 'Migration failed',
      details: err.message
    });
  }
};
