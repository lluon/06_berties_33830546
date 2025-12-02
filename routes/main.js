const express = require("express");
const router = express.Router();

// Home page
router.get('/', (req, res) => {
 res.render('index', { BASE_PATH: process.env.BASE_PATH });
});
// About page
router.get('/about', (req, res) => {
    res.render('about', { BASE_PATH: process.env.BASE_PATH });
});

module.exports = router;
