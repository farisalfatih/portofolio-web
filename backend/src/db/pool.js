const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
})

pool.on('error', (err) => {
  console.error('DB pool error:', err)
})

const query = (text, params) => pool.query(text, params)

module.exports = { pool, query }
