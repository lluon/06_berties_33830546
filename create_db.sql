-- Create database for Bertie's Books
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10,2) 
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    hashedPassword VARCHAR(255) 
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    success TINYINT(1),
    detail VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create app user
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost'
IDENTIFIED BY 'qwertyuiop';

GRANT ALL PRIVILEGES ON berties_books.* 
TO 'berties_books_app'@'localhost';

FLUSH PRIVILEGES;
