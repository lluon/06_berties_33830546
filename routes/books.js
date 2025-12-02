const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();


module.exports = (db) => {

  // Middleware to check login
  const redirectLogin = (req, res, next) => {
    if (!req.session.userId) return res.redirect(process.env.BASE_PATH +'/users/login');
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
    res.render('search', { shopData: req.app.locals.shopData, error: null });
  });

  // Search results
router.get('/search-result', [
    check('keyword').trim().notEmpty().isLength({ max: 100 }).withMessage('Search term required (max 100 characters)'),
  ], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('search', { error: errors.array()[0].msg, shopData: req.app.locals.shopData });
    }
    const keyword = '%' + req.sanitize(req.query.keyword) + '%';
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
router.post('/add', redirectLogin, [
  check('name').trim().notEmpty().isLength({ max: 255 }).withMessage('Book name required (max 255 characters)'),
  check('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('addbook', { error: errors.array().map(e => e.msg).join(', '), shopData: req.app.locals.shopData });
  }
  
  const name = req.sanitize(req.body.name); // Sanitize after validation
  const price = parseFloat(req.body.price);

  db.query('INSERT INTO books (name, price) VALUES (?, ?)', [name, price], (err) => {
    if (err) return next(err);
    res.render('bookadded', { name, price, shopData: req.app.locals.shopData });
  });
});

  return router;
};
