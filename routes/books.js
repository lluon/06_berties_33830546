const express = require("express");
const router = express.Router();
const db = require("../db");

// Search form
router.get('/search', (req, res) => {
    res.render("search.ejs");
});

// Search results
router.get('/search-result', (req, res, next) => {
    let keyword = req.query.keyword?.trim() || "";

    if (!keyword) return res.render("search-result.ejs", { availableBooks: [] });
    const sql = "SELECT * FROM books WHERE name LIKE ?";
    db.query(sql, [`%${keyword}%`], (err, result) => {
        if (err) return next(err);
        res.render("search-result.ejs", { availableBooks: result });
    });
});

// Full book list
router.get('/list', (req, res, next) => {
    db.query("SELECT * FROM books", (err, result) => {
        if (err) return next(err);
        res.render("list.ejs", { availableBooks: result });
    });
});

// Bargain books
router.get('/bargainbooks', (req, res, next) => {
    db.query("SELECT * FROM books WHERE price < 20", (err, result) => {
        if (err) return next(err);
        res.render("list.ejs", { availableBooks: result });
    });
});

// Add book form
router.get('/addbook', (req, res) => {
    res.render('addbook.ejs');
});

// Add book submit
router.post('/bookadded', (req, res, next) => {
    const name = req.body.name?.trim();
    const price = req.body.price;

    if (!name || !price) return res.send("All fields required.");

    const sql = "INSERT INTO books (name, price) VALUES (?, ?)";
    db.query(sql, [name, price], (err) => {
        if (err) return next(err);
        res.render("bookadded.ejs", { name, price });
    });
});

module.exports = router;
