const express = require('express');
const router = express.Router();
const { query } = require('../db/pool');
const authMiddleware = require('../middleware/auth');

// GET /api/about - public
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM about ORDER BY id ASC LIMIT 1');
    res.json({ success: true, data: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/about - protected
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { bio_paragraph1, bio_paragraph2, bio_paragraph3 } = req.body;

    const existing = await query('SELECT id FROM about LIMIT 1');
    let result;

    if (existing.rows.length === 0) {
      result = await query(
        `INSERT INTO about (bio_paragraph1, bio_paragraph2, bio_paragraph3, updated_at)
         VALUES ($1,$2,$3,NOW()) RETURNING *`,
        [bio_paragraph1, bio_paragraph2, bio_paragraph3]
      );
    } else {
      result = await query(
        `UPDATE about SET bio_paragraph1=$1, bio_paragraph2=$2, bio_paragraph3=$3, updated_at=NOW()
         WHERE id=$4 RETURNING *`,
        [bio_paragraph1, bio_paragraph2, bio_paragraph3, existing.rows[0].id]
      );
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
