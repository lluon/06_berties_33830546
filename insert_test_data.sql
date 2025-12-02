USE berties_books;

INSERT IGNORE INTO books (name, price) VALUES
('JavaScript Essentials', 15.99),
('Node.js Guide', 22.50),
('CSS Mastery', 18.75),
('Learning SQL', 19.99),
('Full Stack Handbook', 25.00),
('Harry Potter', 25.99),
('Lord of the Rings', 30.50),
('Bargain Book 1', 15.00),
('Bargain Book 2', 12.50);

-- dummy bcrypt hash for "smiths" (example from earlier). If you want to regenerate, replace with your own hashed value.
INSERT IGNORE INTO users (name, first_name, last_name, email, hashedPassword)
VALUES
('admin', 'Admin', 'User', 'admin@example.com', '$2b$10$abcdefghijklmnopqrstuv1234567890abcdefghijkl'),

('Gold', 'Gold', 'User', 'gold@example.com', '$2b$12$2uC2ot8lBJ0VENvN6iCwiOe8.tlCGiKn1XsFe8LQZjdxQxtTz/wpS');
