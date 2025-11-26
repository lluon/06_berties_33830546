const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

    // task 2 (3)
    const { check, validationResult } = require('express-validator');


module.exports = (db) => {

    // Login helper to restrict access to logged-in users
    //_____________________________________________________
    const redirectLogin = (req, res, next) => {
        if (!req.session.userId) {
            res.redirect('./login'); // redirect to login page
        } else {
            next(); // move to next middleware
        }
    };

    // Helper to log audit events
    //___________________________________________
    const logAudit = (username, success, detail) => {
        const sql = `INSERT INTO audit_logs (username, success, detail) VALUES (?, ?, ?)`;
        db.query(sql, [username || null, success, detail]);
    };

    // __________________________
    //   register routes
    // __________________________


    //  GET register form
    //______________________________________________
    router.get('/register', (req, res) => {
        res.render('register');
    });

    // Register POST (wwith express-validator)
    //______________________________________________

    router.post(
        '/registered', 
        [
                check('email')
                .isEmail()
                .withMessage('email must be valid'), 
                    
                // validate email format
                check('username')
                .isLength({ min: 5, max: 20}) // validate username lenght
                .withMessage('username must be between 5 and 20 characters'),

                // task 3 (4)
                check('password')
                .isLength({ min: 8 }) 
                .withMessage('password must be at least 8 characters'),

                // task 3 (5) extra validations
                check('firstname')
                .notEmpty()
                .withMessage('first name cannot be empty'),

                check('lastname')
                .notEmpty()
                .withMessage('last name cannot be empty'),
        ], 
        (req, res, next) =>{

        //collect validation result
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('register', { errors: errors.array() });
        } else { 

        // sanitization step (6) xss protection
        //_______________________________________

        const first = req.sanitize(req.body.firstname);
        const last = req.sanitize(req.body.lastname);
        const username = req.sanitize(req.body.username);
        const email = req.sanitize(req.body.email);
        const password = req.body.password; // password should NOT be sanitized, keep raw for hashing
                        
               
        // Hash password before saving
        //_______________________________________
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) return next(err);

        // save user to database
        //_______________________________________
        const sql = `INSERT INTO users (name, first_name, last_name, email, hashedPassword)
                    VALUES (?, ?, ?, ?, ?)`;

        db.query(sql, [username, first, last, email, hashedPassword], (err) => {
            if (err) {
                logAudit(username, 0, "Registration failed (duplicate?)");
                return res.send("Error registering user, probably username already exists.");
            }

            logAudit(username, 1, "Successful registration");
            res.render('registered', { first, last, email });
            });
        });
      }
    }

);

//_____________________________
//Login routes
//_____________________________


    // GET login form
    //_______________________________________
    router.get('/login', (req, res) => {
        res.render('login', { error: null });
    });

    // POST Login
    //________________________________________
    router.post(
        '/login',
        [
            check('username').notEmpty().withMessage('Username is required'),
            check('password').notEmpty().withMessage('Password is required'),
        ], 
        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render('login', { error: errors.array() });
            }

            const username = req.sanitize(req.body.username);
            const password = req.body.password;

            const sql = "SELECT hashedPassword, first_name, last_name, email FROM users WHERE name = ?";
            db.query(sql, [username], (err, results) => {
            if (err) return next(err);

            if (results.length === 0) {
                logAudit(username, 0, "User not found");
                return res.send("User not found.");
            }

            const { hashedPassword, first_name, last_name, email } = results[0];

            bcrypt.compare(password, hashedPassword, (err, match) => {
                if (err) return next(err);

                if (match) {

                    // save  user session 
                    //_________________________________
                    req.session.userId = username;
                    logAudit(username, 1, "Successful login");
                    res.render('loggedin', { first_name, last_name, email });
                } else {
                    logAudit(username, 0, "Incorrect password");
                    res.send("Incorrect password.");
                }
            });
        });
    }
);

//_____________________________
//logout routes
//____________________________

    router.get('/logout', redirectLogin, (req, res) => {
        req.session.destroy(err => {
            if (err) return res.redirect('./');
            res.send('You are now logged out. <a href="./">Home</a>');
        });
    });

//_____________________________
//protected routes
//____________________________

    router.get('/list', redirectLogin, (req, res, next) => {
        const sql = "SELECT name, first_name, last_name, email FROM users";
        db.query(sql, (err, results) => {
            if (err) return next(err);
            res.render('listusers', { users: results });
        });
    });

        router.get('/audit', redirectLogin, (req, res, next) => {
        const sql = "SELECT * FROM audit_logs ORDER BY created_at DESC";
        db.query(sql, (err, logs) => {
            if (err) return next(err);
            res.render('audit', { logs });
        });
    });



    return router;
};
