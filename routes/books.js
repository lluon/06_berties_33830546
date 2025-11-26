const express = require('express');
const router = express.Router();

module.exports = (db) => {

    // Helper to restrict access
    const redirectLogin = (req, res, next) => {
        if (!req.session.userId) {
            res.redirect('/users/login');
        } else {
            next();
        }
    };

    // GET all books
    router.get('/', (req, res, next) => {
        const sql = "SELECT * FROM books";
        db.query(sql, (err, results) => {
            if (err) return next(err);
            res.render('books', { books: results });
        });
    });

    // GET add book form
    router.get('/add', redirectLogin, (req, res) => {
        res.render('addbook');
    });

    // POST add book
    router.post('/add', redirectLogin, (req, res, next) => {
        // sanitize all fields
        const title = req.sanitize(req.body.title);
        const author = req.sanitize(req.body.author);
        const description = req.sanitize(req.body.description);
        const price = parseFloat(req.body.price); // numeric, no sanitization

        if (!title || !author || isNaN(price)) {
            return res.send("All fields are required and price must be a number.");
        }

        const sql = `INSERT INTO books (title, author, description, price)
                     VALUES (?, ?, ?, ?)`;
        db.query(sql, [title, author, description, price], (err) => {
            if (err) return next(err);
            res.redirect('/books');
        });
    });

    // GET edit book form
    router.get('/edit/:id', redirectLogin, (req, res, next) => {
        const id = req.sanitize(req.params.id);
        const sql = "SELECT * FROM books WHERE id = ?";
        db.query(sql, [id], (err, results) => {
            if (err) return next(err);
            res.render('editbook', { book: results[0] });
        });
    });

    // POST update book
    router.post('/edit/:id', redirectLogin, (req, res, next) => {
        const id = req.sanitize(req.params.id);
        const title = req.sanitize(req.body.title);
        const author = req.sanitize(req.body.author);
        const description = req.sanitize(req.body.description);
        const price = parseFloat(req.body.price);

        if (!title || !author || isNaN(price)) {
            return res.send("All fields are required and price must be a number.");
        }

        const sql = `UPDATE books SET title = ?, author = ?, description = ?, price = ? WHERE id = ?`;
        db.query(sql, [title, author, description, price, id], (err) => {
            if (err) return next(err);
            res.redirect('/books');
        });
    });

    // GET delete book
    router.get('/delete/:id', redirectLogin, (req, res, next) => {
        const id = req.sanitize(req.params.id);
        const sql = "DELETE FROM books WHERE id = ?";
        db.query(sql, [id], (err) => {
            if (err) return next(err);
            res.redirect('/books');
        });
    });

    return router;
};
