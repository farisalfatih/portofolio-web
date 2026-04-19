require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Routes
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/upload',   require('./routes/upload'))
app.use('/api/hero',     require('./routes/hero'))
app.use('/api/about',    require('./routes/about'))
app.use('/api/skills',   require('./routes/skills'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/contact',  require('./routes/contact'))
app.use('/api/blog',     require('./routes/blog'))
app.use('/og',           require('./routes/og'))   // ← OG meta tags untuk crawler

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API running 🚀' })
})

app.use((_req, res) => res.status(404).json({ success: false, message: 'Not found.' }))

app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Internal server error.' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅  Backend  →  http://localhost:${PORT}`)
  console.log(`    DB      →  ${process.env.DATABASE_URL}`)
})
