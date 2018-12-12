'use strict';


// app dependencies

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const ejs = require('ejs');

// pull in project specific enviroment variables
require('dotenv').config();

//specific database connection path
//TODO: 
const client = new pg.Client(`${DATABASE_URL}`);
client.connect();
client.on('error', err => console.error(err)); 

// setup app constants
const PORT = process.env.PORT;
const app = express();

// set server side view engine
app.set('view engine', 'ejs');

// allow public acces to our api - middleware
app.use(cors());
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));


// routes
app.get('/', (request, response) => {
  response.render('../public/views/pages/index');
});
// path from db
app.get('/', booksDB);

function booksDB(request, response) {
  // our table NEEDS to be named books with this syntax
  let SQL = 'SELECT * from books;';

  return client.query(SQL)
  // check pathway on 'index' pathway - tablename.rows as of now table is books
  .then( results => response.render('index', { results: books.rows }))
  .catch(err => console.error(err));
}


app.post('/searches', getBooks);


// Book model

function Book(data) {
  this.title = data.title;
  this.image = data.imageLinks.smallThumbnail;
  this.authors = data.authors[0];
  this.summary = data.description;

}

function getBooks(request, response) {

  let _URL = `https://www.googleapis.com/books/v1/volumes?q=`;
  console.log('request.body.search', request.body.search);

  if (request.body.search[1] === 'title') {
    _URL += `+intitle:${request.body.search[0]}`;
  }
  if (request.body.search[1] === 'author') {
    _URL += `+inauthor:${request.body.search[0]}`;
  }

  superagent.get(_URL)
    .then(apiResults => apiResults.body.items.map(book => new Book(book.volumeInfo)))

    .then(results => response.render('../public/views/pages/searches/show', {results: results}))
    
    .catch(error => console.log(error));
}

// catch-all route
app.get('*', (req, res) => res.status(404).send('Not Found'));

// listening to server
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
});
