require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');

const db = require('./db');

const mainRoutes = require('./routes/main');
const usersRoutes = require('./routes/users')(db);
const booksRoutes = require('./routes/books')(db);

const app = express();
const port = process.env.PORT || 8000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSanitizer());

app.use(session({
  secret: 'somerandomstuff',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 } // 10 minutes
}));

// Global template data
app.locals.shopData = { shopName: "Bertie's Books" };

// Routes
app.use('/', mainRoutes);
app.use('/users', usersRoutes);
app.use('/books', booksRoutes);

// Start
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
