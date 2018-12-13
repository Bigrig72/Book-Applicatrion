DROP DATABASE book_app;
CREATE DATABASE book_app;
\c book_app;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(255)
);

INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES ('do some shit', 'brian', 'FALSE', 'things that we do', 'when i do certain things i do shit', 'let do it');
