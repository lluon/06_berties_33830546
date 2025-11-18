// Create a new router
const express = require("express")
const router = express.Router()

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});
// Registration success page - work from anywhere
router.post('/registered'),function(req, res, next){
    const first = req.body.first.trim()
    const last = req.body.last.trim()
    const email = req.body.email.trim()
    res.send('Hello ${first} ${last}, you are noew registered! We will send an email to ${email}.')
}

// Export the router object so index.js can access it
module.exports = router