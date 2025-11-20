const express = require('express');
const path = require('path');
require('dotenv').config();

const db = require('./db');

const mainRoutes = require('./routes/main');
const usersRoutes = require('./routes/users')(db);  // pass db
const booksRoutes = require('./routes/books');

const app = express();
const port = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.shopData = { shopName: "Bertie's Books" };

app.use('/', mainRoutes);
app.use('/users', usersRoutes);
app.use('/books', booksRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});