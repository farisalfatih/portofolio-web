const express = require('express');
const router = express.Router();
const { query } = require('../db/pool');
const authMiddleware = require('../middleware/auth');

// GET /api/contact - public
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM contact_info ORDER BY id ASC LIMIT 1');
    res.json({ success: true, data: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/contact - protected
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { email, phone, location, whatsapp_url, maps_url } = req.body;

    const existing = await query('SELECT id FROM contact_info LIMIT 1');
    let result;

    if (existing.rows.length === 0) {
      result = await query(
        `INSERT INTO contact_info (email, phone, location, whatsapp_url, maps_url, updated_at)
         VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *`,
        [email, phone, location, whatsapp_url, maps_url]
      );
    } else {
      result = await query(
        `UPDATE contact_info SET email=$1, phone=$2, location=$3, whatsapp_url=$4, maps_url=$5, updated_at=NOW()
         WHERE id=$6 RETURNING *`,
        [email, phone, location, whatsapp_url, maps_url, existing.rows[0].id]
      );
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
