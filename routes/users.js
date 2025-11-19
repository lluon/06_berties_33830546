// Create a new router
const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

// get route to display registration form
router.get('/register',(req,res)=>{
    res.render('register.ejs');
});

//post route to handle registration
router.post('/register', (req, res, next) => {
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
        // Confirmation message
        let message = `Hello ${first} ${last}, you are now registered <br>`;
        message += `We will send an email to ${email},<br>`;
        message += `your password is ${password},and your hashes password is: ${hashedPassword}<br>`;
        res.send(message);
    });
  });
}); 

// Export the router object so index.js can access it
module.exports = router
