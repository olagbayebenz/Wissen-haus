const pool = require('./db/connection');

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
    const { firstName, lastName, email, phone, city, experience, type, submittedAt } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Missing required fields: firstName, lastName, email' });
    }

    const result = await pool.query(
      `INSERT INTO submissions (type, name, email, phone, data, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [
        type || 'general',
        `${firstName} ${lastName}`,
        email,
        phone || null,
        JSON.stringify({ firstName, lastName, email, phone, city, experience, type, submittedAt }),
        submittedAt || new Date().toISOString(),
        new Date().toISOString()
      ]
    );

    const submission = result.rows[0];

    res.status(201).json({
      success: true,
      id: submission.id,
      message: 'Thank you for your submission! We will review it shortly and contact you if needed.',
      submittedAt: submission.created_at
    });
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
