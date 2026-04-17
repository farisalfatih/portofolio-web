const express = require('express');
const router = express.Router();
const { query } = require('../db/pool');
const authMiddleware = require('../middleware/auth');

// GET /api/skills - public (categories with their skills)
router.get('/', async (req, res) => {
  try {
    const categories = await query('SELECT * FROM skill_categories ORDER BY sort_order ASC, id ASC');
    const skills = await query('SELECT * FROM skills ORDER BY sort_order ASC, id ASC');

    const data = categories.rows.map(cat => ({
      ...cat,
      skills: skills.rows.filter(s => s.category_id === cat.id).map(s => s.name),
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/skills/raw - protected, with IDs
router.get('/raw', authMiddleware, async (req, res) => {
  try {
    const categories = await query('SELECT * FROM skill_categories ORDER BY sort_order ASC, id ASC');
    const skills = await query('SELECT * FROM skills ORDER BY sort_order ASC, id ASC');
    res.json({ success: true, categories: categories.rows, skills: skills.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/skills/categories - protected
router.post('/categories', authMiddleware, async (req, res) => {
  try {
    const { name, color_from, color_to, sort_order } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi.' });

    const result = await query(
      `INSERT INTO skill_categories (name, color_from, color_to, sort_order) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, color_from || 'from-cyan-400', color_to || 'to-cyan-600', sort_order || 0]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/skills/categories/:id - protected
router.put('/categories/:id', authMiddleware, async (req, res) => {
  try {
    const { name, color_from, color_to, sort_order } = req.body;
    const result = await query(
      `UPDATE skill_categories SET name=$1, color_from=$2, color_to=$3, sort_order=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [name, color_from, color_to, sort_order, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/skills/categories/:id - protected
router.delete('/categories/:id', authMiddleware, async (req, res) => {
  try {
    const result = await query('DELETE FROM skill_categories WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    res.json({ success: true, message: 'Kategori dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/skills - protected
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { category_id, name, sort_order } = req.body;
    if (!category_id || !name) return res.status(400).json({ success: false, message: 'category_id dan name wajib diisi.' });

    const result = await query(
      `INSERT INTO skills (category_id, name, sort_order) VALUES ($1,$2,$3) RETURNING *`,
      [category_id, name, sort_order || 0]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/skills/:id - protected
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, sort_order, category_id } = req.body;
    const result = await query(
      `UPDATE skills SET name=$1, sort_order=$2, category_id=$3, updated_at=NOW() WHERE id=$4 RETURNING *`,
      [name, sort_order, category_id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Skill tidak ditemukan.' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/skills/:id - protected
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await query('DELETE FROM skills WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Skill tidak ditemukan.' });
    res.json({ success: true, message: 'Skill dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
