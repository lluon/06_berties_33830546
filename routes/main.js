
const express = require("express")
const router = express.Router()

// home page
router.get('/',(req, res, next) => {
    res.render('index.ejs')
});

router.get('/about',(req, res, next) => {
    res.render('about.ejs')
});

// Registration success 
router.post('/registered',(req, res, next) => {
const first = req.body.first?.trim() || '';
    const last = req.body.last.trim() || '';
    const email = req.body.email.trim() || '';

    res.send(`
        <!doctype html>
        <html>
               <head>
                <title>
                    registered - <%=shopData.shopName%>
                </title>
                <link rel="stylesheet"  type="text/css" href="/main.css" />
            </head>
            <body>
                <h1> Welcome ${first} ${last}!</h1>
                 <p>Thank you for registering!</p>
                 <p>you are now registered with <br><br><strong>${email}</strong>.</p>
                 <p><a href="/">back to home</a></p>
    
            </body>
        </html>
    `);
});

// Export the router object so index.js can access it
module.exports = router