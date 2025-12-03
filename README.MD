# Bertie's Books  
### The Ultimate Full-Stack Bookstore Web Application  
**Node.js • Express • EJS • MySQL • bcrypt • Session Auth • Audit Logging • Responsive Design**

<img src="https://img.shields.io/badge/Node.js-v20.18.0-success?style=for-the-badge&logo=node.js" alt="Node.js">
<img src="https://img.shields.io/badge/Express-4.21-blue?style=for-the-badge&logo=express" alt="Express">
<img src="https://img.shields.io/badge/MySQL-8.0%2B-orange?style=for-the-badge&logo=mysql" alt="MySQL">
<img src="https://img.shields.io/badge/EJS-Templating-yellow?style=for-the-badge" alt="EJS">
<img src="https://img.shields.io/badge/bcrypt-Password%20Hashing-purple?style=for-the-badge" alt="bcrypt">
<img src="https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge" alt="License">

> **Live Demo (Goldsmiths Students)** → https://doc.gold.ac.uk/usr/388/  
> **Last Updated**: 26 November 2025

---

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Setup & Installation](#setup--installation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Audit Logging System](#audit-logging-system)
- [All Routes (Complete List)](#all-routes-complete-list)
- [Test Users](#test-users)
- [Future Enhancements](#future-enhancements)
- [Author & Credits](#author--credits)
- [License](#license)

---

## Project Overview

**Bertie's Books** is a fully functional, secure, and beautifully styled online bookstore built from scratch as a teaching exemplar for **Dynamic Web Development** and **Full-Stack JavaScript** modules.

It demonstrates **real-world best practices** including:
- User authentication with password hashing
- Session management
- Input validation & sanitization
- SQL injection prevention
- Audit logging
- Protected routes
- Responsive front-end design

---

## Key Features

| Feature                          | Status | Description                                      |
|----------------------------------|--------|--------------------------------------------------|
| Home & About pages               | Done   | Branded landing pages                            |
| Full Book Catalogue              | Done   | List, search, filter under £20                   |
| Secure User Registration         | Done   | bcrypt + validation + sanitization               |
| Login / Logout (Session-based)   | Done   | Persistent login with 10-minute cookies          |
| Protected Admin Routes           | Done   | `/users/list`, `/users/audit`, `/books/addbook`  |
| Add New Books                    | Done   | Authenticated users only                         |
| Search Engine (Partial Match)    | Done   | `LIKE '%keyword%'` with sanitization             |
| Bargain Books Filter             | Done   | All books < £20                                  |
| Audit Logging System             | Done   | Every login/registration attempt logged          |
| Responsive CSS Design            | Done   | Mobile-first, clean orange theme                 |
| Form Validation & Error Handling | Done   | `express-validator` + user-friendly messages     |
| MySQL Connection Pooling         | Done   | Efficient database handling                      |

---

## Tech Stack

| Layer             | Technology                          |
|-------------------|-------------------------------------|
| Runtime           | Node.js (v20+)                      |
| Framework         | Express.js                          |
| Templating        | EJS (Embedded JavaScript)           |
| Database          | MySQL 8.0+ (via `mysql2` with pool) |
| Password Hashing  | bcrypt (10 salt rounds)             |
| Session Management| express-session                     |
| Input Sanitization| express-sanitizer                   |
| Validation        | express-validator                   |
| Environment       | dotenv                              |
| Styling           | Custom CSS (mobile-responsive)      |

---


## Project Structure

berties_books/<br>
├── .env                     # DB + WEATHER_API_KEY (ignored in Git)<br>
├── index.js                 # main server entry point<br>
├── db.js                    # Database connection (dotenv-enabled)<br>
├── package.json<br>
├── package-lock.json<br>
├── public/<br>
│   └── main.css             # Global stylesheet<br>
├── routes/<br>
│   ├── main.js              # Home, About <br>
│   ├── users.js             # Auth + audit + user list<br>
│   ├── weather.js           # OpenWeatherMap integration <br>
│   ├── api.js               # Public JSON API<br>
│   └── books.js             # Catalogue, search, add book<br>
├── views/<br>
│   ├── weather.ejs          # Weather page<br>
│   ├── index.ejs<br>
│   ├── about.ejs<br>
│   ├── register.ejs<br>
│   ├── registered.ejs<br>
│   ├── login.ejs<br>
│   ├── loggedin.ejs<br>
│   ├── list.ejs             # All books<br>
│   ├── listuser.ejs         # List of registered users<br>
│   ├── audit.ejs            # Full audit log table<br>
│   ├── search.ejs<br>
│   ├── search-result.ejs<br>
│   ├── addbook.ejs<br>
│   └── bookadded.ejs<br>
├── create_db.sql            # DB + tables + user + privileges<br>
├── insert_test_data.sql    # Sample books + dummy users<br>
├── package.json<br>
└── README.md<br>
---

## Weather Forecast Integration

- Route: `/weather`
- Uses **OpenWeatherMap Current Weather API**
- Interactive city search
- Displays: temperature, description, humidity, wind speed
- Beautiful blue-to-cyan gradient design


---

## Books API 

**Public JSON API** available at:

**Base URL:** `http://localhost:8000/api/books`
---
## Main Routes 

| Query Parameter   | Example                              | Description                          |
|-------------------|--------------------------------------|--------------------------------------|
| `search`          | `?search=java`                       | Search book title (partial match)    |
| `minprice`        | `?minprice=10`                       | Minimum price                        |
| `maxprice`        | `?maxprice=25`                       | Maximum price                        |
| `sort`            | `?sort=price` or `?sort=name`        | Sort results                         |

**Examples:**
- All books: `/api/books`
- Books with "java": `/api/books?search=java`
- £10–£25: `/api/books?minprice=10&maxprice=25`
- Sorted by price: `/api/books?sort=price`

**No authentication required** – fully public for marking

| Route                     | Method   | Auth? | Description                              |
|---------------------------|----------|-------|------------------------------------------|
| `/`                       | GET      | No    | Home page                                |
| `/about`                  | GET      | No    | About page                               |
| `/weather`                | GET      | No    | **Live weather forecast**                |
| `/api/books`              | GET      | No    | **Public JSON API** (search/sort/price)  |
| `/users/register`         | GET      | No    | Registration form                        |
| `/users/registered`       | POST     | No    | Registration success                     |
| `/users/login`            | GET/POST | No    | Login form & processing                  |
| `/users/logout`           | GET      | Yes   | Logout                                   |
| `/users/list`             | GET      | Yes   | List all users (protected)               |
| `/users/audit`            | GET      | Yes   | Audit log (protected)                    |
| `/books/list`             | GET      | No    | All books                                |
| `/books/bargainbooks`     | GET      | No    | Books under £20                          |
| `/books/search`           | GET      | No    | Search form                              |
| `/books/search-result`    | GET      | No    | Search results                           |
| `/books/addbook`          | GET      | Yes   | Add book form (protected)                |
| `/books/add`              | POST     | Yes   | Submit new book                          |
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
---

## Test Users

| Username | Password    | Role                                     |
|----------|-------------|------------------------------------------|
| `Gold`   | `smiths`    | **Admin** (can access audit & user list) |
| `admin`  | *(any)*     | Dummy account for testing                |

Or register your own!

---
### Security Features

| Threat                  | Protection Used                                                |
|-------------------------|----------------------------------------------------------------|
| **SQL Injection**       | Parameterized queries + `express-sanitizer`                    |
| **XSS**                 | `express-sanitizer` strips dangerous HTML/script tags          |
| **Weak Passwords**      | `bcrypt` hashing (10 salt rounds) + minimum length validation  |
| **Session Hijacking**   | Secure random session secret + 10-minute cookie expiry         |
| **Unauthorized Access** | `redirectLogin` middleware protects all admin-style routes     |
| **Credential Exposure** | Database credentials stored in `.env` (never committed to Git) |

### Audit Logging System (New in 2025!)

Every authentication-related event is permanently recorded in the `audit_logs` table:

| Event                     | Logged Detail                                   | Success |
|---------------------------|--------------------------------------------------|---------|
| Registration success      | "Successful registration"                        | 1       |
| Registration duplicate    | "Registration failed (duplicate or db error)"    | 0       |
| Login success             | "Successful login"                               | 1       |
| Login failed (user)       | "User not found"                                 | 0       |
| Login failed (password)   | "Incorrect password"                             | 0       |
| Logout                    | "User logged out"                                | 1       |

**View the full audit trail at:** `/users/audit` **(protected route – login required)**


## Author
Educational project created by Llewelyn Fernandes
for the Dynamic Web Applications module in creative computing
© 2025 – Goldsmiths, University of London

---
