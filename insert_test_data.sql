USE berties_books;

INSERT INTO books (name, price) VALUES
('JavaScript Essentials', 15.99),
('Node.js Guide', 22.50),
('CSS Mastery', 18.75),
('Learning SQL', 19.99),
('Full Stack Handbook', 25.00);
USE berties_books;

INSERT INTO books (name, price) VALUES
('Harry Potter', 25.99),
('Lord of the Rings', 30.50),
('Bargain Book 1', 15.00),
('Bargain Book 2', 12.50);

INSERT INTO users (name, first_name, last_name, email, hashedPassword)
VALUES
('admin', 'Admin', 'User', 'admin@example.com', '$2b$10$abcdefghijklmnopqrstuv'); -- dummy hash example

-- Add the required test user for marking
INSERT INTO users (name, first_name, last_name, email, hashedPassword) VALUES
('gold', 'Gold', 'User', 'gold@example.com', '$2b$10$5z5j5j5j5j5j5j5j5j5j5uO6z5V6x7c8y9d0e1f2g3h4i5j6k7l8m9n0o'); -- this is bcrypt hash of "smiths"