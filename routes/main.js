// routres/main.js
const express = require("express")
const router = express.Router()

// Handle our routes
router.get('/',(req, res, next) => {
    res.render('index.ejs')
});

router.get('/about',(req, res, next) => {
    res.render('about.ejs')
});


// Registration success page - work from anywhere
router.post('/registered',(req, res, next) => {
const first = req.body.first || '';
    const last = req.body.last || '';
    const email = req.body.email || '';
    res.send('Hello ${first} ${last}, you are now registered! We will send an email to ${email}.')
});

// Export the router object so index.js can access it
module.exports = router