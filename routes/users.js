// Create a new router
const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

// GET route to display registration form
router.get('/register',(req,res)=>{
    res.render('register.ejs');
});

//POST route to handle registration
router.post('users/register', (req, res, next) => {
    const {name,first,last,email,password} = req.body;

    //hash the password
    bcrypt.hash(password,saltRounds,function(err,hashedPassword) {
        if (err) throw err;

        // store user in the database
        const sql = `INSERT INTO users (name, first_name, last_name, email, hashedPassword)
                    VALUES (?, ?, ?, ?, ?)`;
        db.query(sql,[name,first,last,email,hashedPassword],(err,result) =>{
            if (err){
                console.error(err);
                return res.send('error registering user.');
            }
        
        // succes response
            res.send(`
                <h1>Hello ${first} ${last}, you are now registered!</h1>
                <p>Email: ${email}</p>
                <p>Password:${password}</p>
                <p><a href="/users/login">Login here</a></p>
                `);
        });
    });
});

// GET route to display login form
router.get('/login', (req, res) => {
    res.render('login.ejs');
});

// POST route to handle login
router.post('/loggedin', (req, res) => {
    const { username, password } = req.body;

    // Select hashed password for this user from the database
    const sql = "SELECT hashedPassword, first_name, last_name, email FROM users WHERE name = ?";
    db.query(sql, [username], (err, results) => {
        if (err) return res.send('Database error.');

        if (results.length === 0) {
            // User not found
            return res.send(`<h1>Login failed</h1><p>User not found.</p><p><a href="/users/login">Try again</a></p>`);
        }

        const hashedPassword = results[0].hashedPassword;
        const first = results[0].first_name;
        const last = results[0].last_name;
        const email = results[0].email;

        // Compare the password supplied with the hashed password
        bcrypt.compare(password, hashedPassword, function(err, result) {
            if (err) return res.send('Error during password check.');

            if (result === true) {
                // Login successful
                res.send(`
                    <h1>Welcome back, ${first} ${last}!</h1>
                    <p>You have successfully logged in.</p>
                    <p>Email: ${email}</p>
                    <p><a href="/">Back to home</a></p>
                `);
            } else {
                // Password incorrect
                res.send(`<h1>Login failed</h1><p>Incorrect password.</p><p><a href="/users/login">Try again</a></p>`);
            }
        });
    });
});


// Export the router object so index.js can access it
module.exports = router
