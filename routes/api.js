// routes/api.js
const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.get('/books', (req, res) => {
    let sql = 'SELECT id, name, price FROM books';
    let conditions = [];
    let params = [];

    // Extension: search
    if (req.query.search) {
      conditions.push('name LIKE ?');
      params.push(`%${req.query.search}%`);
    }

    // Extension: price range
    if (req.query.minprice) {
      conditions.push('price >= ?');
      params.push(req.query.minprice);
    }
    if (req.query.maxprice || req.query.max_price) {
      conditions.push('price <= ?');
      params.push(req.query.maxprice || req.query.max_price);
    }

    // Add WHERE if needed
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Extension: sorting
    if (req.query.sort === 'name') {
      sql += ' ORDER BY name ASC';
    } else if (req.query.sort === 'price') {
      sql += ' ORDER BY price ASC';
    } else {
      sql += ' ORDER BY id ASC'; // default
    }

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('API Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    });
  });

  return router;
};