DROP DATABASE book_app;
CREATE DATABASE book_app;

DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT,
  author VARCHAR(255),
  isbn VARCHAR(255),
  image VARCHAR(255),
  description TEXT
);

-- INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES ('do some shit', 'brian', 'FALSE', 'things that we do', 'when i do certain things i do shit', 'let do it');
