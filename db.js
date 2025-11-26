require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'berties_books_app',
  password: process.env.DB_PASSWORD || 'qwertyuiop',
  database: process.env.DB_NAME || 'berties_books',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// quick test connection (non-fatal)
pool.getConnection((err, conn) => {
  if (err) {
    console.error('MySQL connection error:', err.message);
  } else {
    console.log(' MySQL pool connected');
    conn.release();
  }
});

module.exports = pool;
