const express = require('express');
const router = express.Router();
const { query } = require('../db/pool');
const authMiddleware = require('../middleware/auth');

// GET /api/blog - public (only published)
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, title, excerpt, cover_image, tags, published_at, created_at FROM blog_posts WHERE is_published = true ORDER BY published_at DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/blog/all - protected (all including drafts)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/blog/:id - public (only published)
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM blog_posts WHERE id = $1 AND is_published = true', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/blog - protected
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, excerpt, content, cover_image, tags, is_published } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Judul artikel wajib diisi.' });

    const published_at = is_published ? new Date() : null;
    const result = await query(
      `INSERT INTO blog_posts (title, excerpt, content, cover_image, tags, is_published, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, excerpt || '', content || '', cover_image || '', tags || [], is_published || false, published_at]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/blog/:id - protected
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, excerpt, content, cover_image, tags, is_published } = req.body;

    const existing = await query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });

    const published_at = is_published && !existing.rows[0].published_at ? new Date() : existing.rows[0].published_at;

    const result = await query(
      `UPDATE blog_posts SET title=$1, excerpt=$2, content=$3, cover_image=$4, tags=$5,
       is_published=$6, published_at=$7, updated_at=NOW() WHERE id=$8 RETURNING *`,
      [title, excerpt, content, cover_image, tags, is_published, published_at, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/blog/:id - protected
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await query('DELETE FROM blog_posts WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    res.json({ success: true, message: 'Artikel dihapus.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
