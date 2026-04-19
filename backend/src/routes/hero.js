const express = require('express')
const router  = express.Router()
const { query } = require('../db/pool')
const auth    = require('../middleware/auth')

// GET /api/hero - public
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM hero ORDER BY id ASC LIMIT 1')
    res.json({ success: true, data: result.rows[0] || null })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
})

// PUT /api/hero - protected
router.put('/', auth, async (req, res) => {
  try {
    const {
      name, tagline, quote,
      github_url, linkedin_url, instagram_url,
      cv_url, profile_image_url,
      favicon_url, og_image_url
    } = req.body

    const existing = await query('SELECT id FROM hero LIMIT 1')
    let result

    if (existing.rows.length === 0) {
      result = await query(
        `INSERT INTO hero
          (name, tagline, quote, github_url, linkedin_url, instagram_url,
           cv_url, profile_image_url, favicon_url, og_image_url, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *`,
        [name, tagline, quote, github_url, linkedin_url, instagram_url,
         cv_url, profile_image_url||'', favicon_url||'', og_image_url||'']
      )
    } else {
      result = await query(
        `UPDATE hero SET
          name=$1, tagline=$2, quote=$3,
          github_url=$4, linkedin_url=$5, instagram_url=$6,
          cv_url=$7, profile_image_url=$8,
          favicon_url=$9, og_image_url=$10,
          updated_at=NOW()
         WHERE id=$11 RETURNING *`,
        [name, tagline, quote, github_url, linkedin_url, instagram_url,
         cv_url, profile_image_url||'', favicon_url||'', og_image_url||'',
         existing.rows[0].id]
      )
    }

    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
})

module.exports = router
