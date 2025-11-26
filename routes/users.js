const express = require('express');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const saltRounds = 10;

module.exports = (db) => {

  const redirectLogin = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/users/login');
    next();
  };

  const logAudit = (username, success, detail) => {
    const sql = `INSERT INTO audit_logs (username, success, detail) VALUES (?, ?, ?)`;
    db.query(sql, [username || null, success ? 1 : 0, detail], (err) => {
      if (err) console.error('Audit log error:', err.message);
    });
  };

  // GET register form
  router.get('/register', (req, res) => {
    res.render('register', { errors: [] });
  });

  // POST register
  router.post('/registered',
    [
      check('email').isEmail().withMessage('Email must be valid'),
      check('username').isLength({ min: 3, max: 20 }).withMessage('Username must be between 5 and 20 characters'),
      check('password').isLength({ min: 6 }).withMessage('Password must be at least 8 characters'),
      check('first_name').notEmpty().withMessage('First name required'),
      check('last_name').notEmpty().withMessage('Last name required')
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('register', { errors: errors.array() });
      }

      // sanitize inputs (express-sanitizer)
      const first = req.sanitize(req.body.first_name);
      const last = req.sanitize(req.body.last_name);
      const username = req.sanitize(req.body.username);
      const email = req.sanitize(req.body.email);
      const password = req.body.password;

      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) return next(err);

        const sql = `INSERT INTO users (name, first_name, last_name, email, hashedPassword)
                     VALUES (?, ?, ?, ?, ?)`;

        db.query(sql, [username, first, last, email, hashedPassword], (err) => {
          if (err) {
            logAudit(username, false, 'Registration failed (duplicate or db error)');
            console.error('Registration error:', err.message);
            return res.render('register', { errors: [{ msg: 'Registration failed: username may already exist or DB error.' }] });
          }

          logAudit(username, true, 'Successful registration');
          res.render('registered', { first, last, email });
        });
      });
    });

  // GET login form
  router.get('/login', (req, res) => {
    res.render('login', { error: null });
  });

  // POST login
  router.post('/login',
    [
      check('username').notEmpty().withMessage('Username required'),
      check('password').notEmpty().withMessage('Password required')
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('login', { error: errors.array()[0].msg });
      }

      const username = req.sanitize(req.body.username);
      const password = req.body.password;

      const sql = `SELECT id, name, first_name, last_name, email, hashedPassword FROM users WHERE name = ?`;
      db.query(sql, [username], (err, results) => {
        if (err) return next(err);

        if (!results.length) {
          logAudit(username, false, 'User not found');
          return res.render('login', { error: 'User not found' });
        }

        const user = results[0];

        bcrypt.compare(password, user.hashedPassword, (err, match) => {
          if (err) return next(err);
          if (!match) {
            logAudit(username, false, 'Incorrect password');
            return res.render('login', { error: 'Incorrect password' });
          }

          // Save session
          req.session.userId = user.id;
          req.session.username = user.name;
          logAudit(username, true, 'Successful login');
          res.render('loggedin', { first_name: user.first_name, last_name: user.last_name, email: user.email });
        });
      });
    });

  // logout
  router.get('/logout', redirectLogin, (req, res) => {
    const un = req.session.username;
    req.session.destroy(err => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.redirect('/');
      }
      logAudit(un, true, 'User logged out');
      res.send('You are now logged out. <a href="/">Home</a>');
    });
  });

  // List users (protected)
  router.get('/list', redirectLogin, (req, res, next) => {
    const sql = `SELECT name, first_name, last_name, email FROM users`;
    db.query(sql, (err, rows) => {
      if (err) return next(err);
      res.render('listusers', { users: rows });
    });
  });

  // Audit logs (protected)
  router.get('/audit', redirectLogin, (req, res, next) => {
    const sql = `SELECT username, success, detail, created_at FROM audit_logs ORDER BY created_at DESC`;
    db.query(sql, (err, rows) => {
      if (err) return next(err);
      res.render('audit', { logs: rows });
    });
  });

  return router;
};
