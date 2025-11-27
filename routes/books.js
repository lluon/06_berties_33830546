const express = require('express');
const router = express.Router();

module.exports = (db) => {

  // Middleware to protect routes
  const redirectLogin = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/users/login');
    next();
  };

  // List all books
  router.get('/list', (req, res, next) => {
    db.query('SELECT id, name, price FROM books', (err, rows) => {
      if (err) return next(err);
      res.render('list', { availableBooks: rows, shopData: req.app.locals.shopData });
    });
  });

  // Bargain books (< £20)
  router.get('/bargainbooks', (req, res, next) => {
    db.query('SELECT id, name, price FROM books WHERE price < 20', (err, rows) => {
      if (err) return next(err);
      res.render('list', { availableBooks: rows, shopData: req.app.locals.shopData });
    });
  });

  // Search form
  router.get('/search', (req, res) => {
    res.render('search', { shopData: req.app.locals.shopData });
  });

  // Search results
  router.get('/search-result', (req, res, next) => {
    const keyword = '%' + req.sanitize(req.query.keyword || '') + '%';
    db.query('SELECT id, name, price FROM books WHERE name LIKE ?', [keyword], (err, rows) => {
      if (err) return next(err);
      res.render('search-result', { availableBooks: rows, shopData: req.app.locals.shopData });
    });
  });

  // Add book form (protected)
  router.get('/addbook', redirectLogin, (req, res) => {
    res.render('addbook', { error: null, shopData: req.app.locals.shopData });
  });

  // Add book POST (protected)
  router.post('/add', redirectLogin, (req, res, next) => {
    const name = req.sanitize(req.body.name);
    const price = parseFloat(req.body.price);

    if (!name || isNaN(price)) {
      return res.render('addbook', { error: 'Name and price required (price must be a number).', shopData: req.app.locals.shopData });
    }

    db.query('INSERT INTO books (name, price) VALUES (?, ?)', [name, price], (err) => {
      if (err) return next(err);
      res.render('bookadded', { name, price, shopData: req.app.locals.shopData });
    });
  });

  return router;
};
