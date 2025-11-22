// routes/users.js
module.exports = (db) => {
    const express = require('express');
    const router = express.Router();
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    // Helper to log audit
    const logAudit = (username, success, detail) => {
        const sql = `INSERT INTO audit_logs (username, success, detail) VALUES (?, ?, ?)`;
        db.query(sql, [username || null, success, detail]);
    };

    // Register GET
    router.get('/register', (req, res) => {
        res.render('register');
    });

    // Register POST
    router.post('/register', (req, res, next) => {
        const { name: username, first_name: first, last_name: last, email, password } = req.body;

        if (!username || !first || !last || !email || !password) {
            return res.send("All fields are required.");
        }

        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) return next(err);

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
    });

    // Login GET
    router.get('/login', (req, res) => {
        res.render('login', { error: null });
    });

    // Login POST
    router.post('/login', (req, res, next) => {
        const { username, password } = req.body;
        if (!username || !password) {
            logAudit(username, 0, "Missing credentials");
            return res.send("All fields are required.");
        }

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
                    logAudit(username, 1, "Successful login");
                    res.render('loggedin', { first_name, last_name, email });
                } else {
                    logAudit(username, 0, "Incorrect password");
                    res.send("Incorrect password.");
                }
            });
        });
    });

    // List all users (no passwords)
    router.get('/list', (req, res, next) => {
        const sql = "SELECT name, first_name, last_name, email FROM users";
        db.query(sql, (err, results) => {
            if (err) return next(err);
            res.render('listusers', { users: results });
        });
    });

    // Audit log page
    router.get('/audit', (req, res, next) => {
        const sql = "SELECT * FROM audit_logs ORDER BY created_at DESC";
        db.query(sql, (err, logs) => {
            if (err) return next(err);
            res.render('audit', { logs });
        });
    });

    return router;
};
