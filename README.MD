# Bertie's Books

A simple, fully functional online bookstore web application built with **Node.js**, **Express**, **EJS** templates, and **MySQL**.  
Perfect teaching example for the Dynamic Web Development module.

---

## Features

- Home, About, and Registration pages
- Full book catalogue with:
  - List all books
  - Search books by keyword (partial match)
  - Filter bargain books (under £20)
  - Add new books to the database (admin-style feature)
- Clean, responsive styling with custom CSS
- MySQL backend with connection pooling
- EJS templating for dynamic content
- Form handling and user feedback pages

---

## Tech Stack

- **Node.js** (v18+ recommended)
- **Express.js** – web framework
- **EJS** – embedded JavaScript templating
- **MySQL** (via `mysql2` driver with connection pool)
- **bcrypt**
- **dotenv**
- Custom CSS

---
### dotenv
Database credentials are no longer hard-coded. They are stored in a `.env` file and loaded using the `dotenv` package. This prevents accidental exposure if the code is pushed to a public repository.

### Audit Logging
Every login attempt (successful or failed) and registration attempt is recorded in the `audit_logs` table with:
- username
- success (1/0)
- detail message
- timestamp

A new route `/users/audit` displays the full history in a table.

## Project Structure

berties_books/<br>
├── .env                     # Contains DB credentials (ignored in Git)<br>
├── index.js                 # Application entry point<br>
├── server.js                # Optional alt entry point if used<br>
├── db.js                    # Database connection (dotenv-enabled)<br>
├── routes/<br>
│   ├── main.js              # Home & About pages<br>
│   ├── users.js             # Registration, login, audit logging<br>
│   └── books.js             # Book listing, search, add book<br>
├── views/<br>
│   ├── index.ejs<br>
│   ├── about.ejs<br>
│   ├── register.ejs<br>
│   ├── registered.ejs       # Registration output (assignment requirement)<br>
│   ├── login.ejs<br>
│   ├── loggedin.ejs<br>
│   ├── list.ejs             # All books<br>
│   ├── listuser.ejs         # List of registered users (no passwords)<br>
│   ├── audit.ejs            # New — audit log table<br>
│   ├── search.ejs<br>
│   ├── search-result.ejs<br>
│   ├── addbook.ejs<br>
│   └── bookadded.ejs<br>
├── public/<br>
│   └── main.css             # Global stylesheet<br>
├── create_db.sql            # Database + tables + user creation<br>
├── insert_test_data.sql     # Sample book data<br>
├── package.json<br>
└── README.md<br>

---
## Main Routes - Page updated: 18 November 2025

| Route                        | Description                              |
|------------------------------|------------------------------------------|
| `/`                          | Home page                                |
| `/about`                     | About the shop                           |
| `/users/register`            | User registration form                   |
| `/users/login                | Login form                               |
| `/users/audit`               | Audit log history                        |
| `/users/list`                | List registered users                    |
| `/book/list`                 | All books                                |
| `/books/bargainbooks`        | Books priced under £20 (bargain offers)  |
| `/books/search`              | Search form                              |
| `/books/search-result` (GET) | Search results (partial keyword match)   |
| `/books/addbook`             | Form to add a new book                   |
| `/books/bookadded` (POST)    | Confirmation after adding a book         |

---

## Setup & Installation

### 1. Prerequisites
- Node.js (v18 or higher)
- MySQL server running locally

---

### 2. Installation

npm install
mysql -u root -p < create_db.sql
mysql -u root -p < insert_test_data.sql

### 3. create .env file
DB_HOST=localhost
DB_USER=berties_books_app
DB_PASSWORD=qwertyuiop
DB_NAME=berties_books

---

## Author
Educational project created by Llewelyn Fernandes
for the Dynamic Web Applications module in creative computing
© 2025 – Goldsmiths, University of London

---
