const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');   // STEP 11

const path = require('path');
require('dotenv').config();

const db = require('./db');

//routes
//________________________________________

const mainRoutes = require('./routes/main');
const usersRoutes = require('./routes/users')(db);  // pass db
const booksRoutes = require('./routes/books');

//express app
//________________________________________

const app = express();
const port = process.env.PORT || 8000;

//________________________________
// view engine and static files
//________________________________


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// step 11 Sanitizer middleware
//_________________________________
app.use(expressSanitizer()); //task (6)

// Session (from 8a) middleware
//_______________________________________
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Sanitizer middleware
//_______________________________________
const expressSanitizer = require('express-sanitizer');
app.use(expressSanitizer())



//local variables
//_______________________________________
app.locals.shopData = { shopName: "Bertie's Books" };

// routes
//_______________________________________
app.use('/', mainRoutes);
app.use('/users', usersRoutes);
app.use('/books', booksRoutes);

// Start server
//_______________________________________

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

