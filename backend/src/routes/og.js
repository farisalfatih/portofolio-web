const express   = require('express')
const router    = express.Router()
const { query } = require('../db/pool')

// GET /og — return HTML dengan meta tags lengkap untuk crawler WA/FB/LinkedIn
// Browser biasa langsung redirect ke /
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM hero LIMIT 1')
    const hero   = result.rows[0] || {}

    const domain   = process.env.DOMAIN || 'https://farisalfatih.my.id'
    const name     = hero.name     || 'Faris Al Fatih'
    const tagline  = hero.tagline  || 'Web Developer & Data Engineer'
    const ogImage  = hero.og_image_url
      ? (hero.og_image_url.startsWith('http') ? hero.og_image_url : `${domain}${hero.og_image_url}`)
      : `${domain}/og-image.jpg`
    const favicon  = hero.favicon_url
      ? (hero.favicon_url.startsWith('http') ? hero.favicon_url : `${domain}${hero.favicon_url}`)
      : `${domain}/favicon.png`
    const title    = `${name} | ${tagline}`
    const desc     = `Halo! Saya ${name} — ${tagline} dari Gresik. Lihat project dan skill saya.`

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.send(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <meta name="description" content="${desc}"/>
  <link rel="icon" type="image/png" href="${favicon}"/>

  <!-- Open Graph -->
  <meta property="og:type"         content="website"/>
  <meta property="og:site_name"    content="${name} Portfolio"/>
  <meta property="og:title"        content="${title}"/>
  <meta property="og:description"  content="${desc}"/>
  <meta property="og:url"          content="${domain}"/>
  <meta property="og:image"        content="${ogImage}"/>
  <meta property="og:image:width"  content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:image:alt"    content="${name} Portfolio"/>
  <meta property="og:locale"       content="id_ID"/>

  <!-- Twitter/X -->
  <meta name="twitter:card"        content="summary_large_image"/>
  <meta name="twitter:title"       content="${title}"/>
  <meta name="twitter:description" content="${desc}"/>
  <meta name="twitter:image"       content="${ogImage}"/>

  <meta name="theme-color" content="#06b6d4"/>

  <!-- Redirect ke SPA setelah meta tags dibaca crawler -->
  <script>window.location.replace('/');</script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>`)
  } catch (err) {
    console.error(err)
    res.redirect('/')
  }
})

module.exports = router
