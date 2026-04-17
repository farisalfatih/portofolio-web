const express = require('express');
const router = express.Router();
const { query } = require('../db/pool');
const authMiddleware = require('../middleware/auth');

// GET /api/projects - public
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let sql = 'SELECT * FROM projects';
    const params = [];

    if (type && type !== 'all') {
      sql += ' WHERE type = $1';
      params.push(type);
    }

    sql += ' ORDER BY sort_order ASC, id ASC';
    const result = await query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/projects/:id - public
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project tidak ditemukan.' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/projects - protected
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, type, description, tech_stack, category, github_url, demo_url, is_featured, sort_order } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama project wajib diisi.' });

    const result = await query(
      `INSERT INTO projects (name, type, description, tech_stack, category, github_url, demo_url, is_featured, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        name,
        type || 'web',
        description || '',
        tech_stack || [],
        category || '',
        github_url || '',
        demo_url || '',
        is_featured || false,
        sort_order || 0,
      ]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/projects/:id - protected
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, type, description, tech_stack, category, github_url, demo_url, is_featured, sort_order } = req.body;
    const result = await query(
      `UPDATE projects SET name=$1, type=$2, description=$3, tech_stack=$4, category=$5,
       github_url=$6, demo_url=$7, is_featured=$8, sort_order=$9, updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [name, type, description, tech_stack, category, github_url, demo_url, is_featured, sort_order, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project tidak ditemukan.' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/projects/:id - protected
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await query('DELETE FROM projects WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Project tidak ditemukan.' });
    res.json({ success: true, message: 'Project dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
