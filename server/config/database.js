const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error conectando a PostgreSQL:', err.stack);
    return;
  }
  console.log('✅ Conectado a Neon PostgreSQL');
  release();
});

module.exports = pool;