const express = require("express");
const router = express.Router();

// Home page
router.get('/', (req, res) => {
 res.render('index', { shopData: req.app.locals.shopData });
});

// About page
router.get('/about', (req, res) => {
    res.render('about', { shopData: req.app.locals.shopData });
});

module.exports = router;
