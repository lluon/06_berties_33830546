require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');

const db = require('./db');

// Routes
const mainRoutes    = require('./routes/main');
const usersRoutes   = require('./routes/users')(db);
const booksRoutes   = require('./routes/books')(db);
const weatherRoutes = require('./routes/weather')();
const apiRoutes     = require('./routes/api')(db);

const app = express();
const port = process.env.PORT || 8000;

// Set BASE_PATH globally and locally.
const BASE_PATH = process.env.BASE_PATH || "";
process.env.BASE_PATH = BASE_PATH;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));

// **CRITICAL FIX 1: Static Files (WITH BASE_PATH)**
// Static files (CSS/JS) must use BASE_PATH because the proxy does NOT strip the path for them.
app.use(BASE_PATH, express.static(path.join(__dirname, 'public')));
app.use(expressSanitizer());

app.use(session({
  secret: 'somerandomstuff',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000 } // 10 minutes
}));

// Global template data
app.locals.shopData = { shopName: "Bertie's Books" };
app.locals.BASE_PATH = BASE_PATH;

// API routes
app.use('/api', apiRoutes);

// **CRITICAL FIX 2: Routing (NO BASE_PATH)**
// All HTML/API routes must use root paths because the proxy STRIPS the BASE_PATH for them (including /users/login).
app.use('/', mainRoutes);
app.use('/users', usersRoutes);
app.use('/books', booksRoutes);
app.use('/weather', weatherRoutes);


// 404 handler 
app.use((req, res) => {
  console.log('404 Debug - Original URL:', req.originalUrl);
  res.status(404).send(`
    <h1>404 Not Found</h1>
    <p>The requested URL ${req.originalUrl} was not found on this server.</p>
    <p><a href="${BASE_PATH}/">Back to home</a></p>
  `);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`
    <h1>500 Internal Server Error</h1>
    <p>${err.message}</p>
    <p><a href="${BASE_PATH}/">Back to home</a></p>
  `);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}${BASE_PATH}/`);
  console.log(`API available at    http://localhost:${port}/api/books`);
});