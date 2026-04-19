const express = require('express')
const router  = express.Router()
const multer  = require('multer')
const path    = require('path')
const fs      = require('fs')
const auth    = require('../middleware/auth')

const UPLOAD_DIR = path.join(__dirname, '../../uploads')
const IMAGE_DIR  = path.join(UPLOAD_DIR, 'images')
const CV_DIR     = path.join(UPLOAD_DIR, 'cv')

;[UPLOAD_DIR, IMAGE_DIR, CV_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true })
})

function uniqName(orig) {
  const ext  = path.extname(orig).toLowerCase()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
}

function deleteOld(url, sub) {
  if (!url) return
  try {
    const f = path.join(UPLOAD_DIR, sub, path.basename(url))
    if (fs.existsSync(f)) fs.unlinkSync(f)
  } catch (_) {}
}

const imgUpload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, IMAGE_DIR),
    filename:    (_, file, cb) => cb(null, uniqName(file.originalname)),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)
    ok ? cb(null, true) : cb(new Error('Format tidak didukung. Gunakan JPG, PNG, atau WebP.'))
  },
})

const cvUpload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, CV_DIR),
    filename:    (_, file, cb) => cb(null, uniqName(file.originalname)),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('CV harus berformat PDF.'))
  },
})

router.post('/image', auth, imgUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Tidak ada file.' })
  deleteOld(req.headers['x-old-url'], 'images')
  res.json({ success: true, url: `/uploads/images/${req.file.filename}` })
})

router.post('/cv', auth, cvUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Tidak ada file.' })
  deleteOld(req.headers['x-old-url'], 'cv')
  res.json({ success: true, url: `/uploads/cv/${req.file.filename}` })
})

router.use((err, _req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE')
    return res.status(413).json({ success: false, message: 'File terlalu besar.' })
  res.status(400).json({ success: false, message: err.message || 'Upload gagal.' })
})

module.exports = router
