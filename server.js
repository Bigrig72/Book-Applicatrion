'use strict';

// app dependencies

const express = require('express');
//this error is fine for now
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');


// pull in project specific enviroment variables
require('dotenv').config();

//specific database connection path
//TODO:
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// setup app constants
const PORT = process.env.PORT;
const app = express();

// set server side view engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
//line 30 isnt working...full pathway typed on line 52 to show index
app.use(express.static('./public'));

//

// routes
// app.get('/', (request, response) => {
//   response.render('pages');
// });

// path from db
app.get('/', booksDB);

app.post('/searches', getBooks);

function booksDB(request, response) {
  // our table NEEDS to be named books with this syntax
  console.log('hi from booksDB');
  let SQL = 'SELECT * from books;';
  //log in terminal showing status of sql query--currently showing as pending
  console.log('client.query(sql)', client.query(SQL));
  return client.query(SQL)

    .then(results => response.render('../public/views/pages/index', { results: results.rows }))
    .catch(error => handleError(error, response));
}

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

    .then(results => response.render('../public/views/pages/searches/show', { results: results }))

    .catch(error => console.log(error));
}

//errorHandler
function handleError(error, response) {
  response.render('pages/error-view', {error: 'Oh, something went wrong!'});
}

// catch-all route
app.get('*', (req, res) => res.status(404).send('Not Found'));

// listening to server
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
});
