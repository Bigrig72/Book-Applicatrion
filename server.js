'use strict';

// app dependencies

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
// const methodoverride = require('method-override');

// pull in project specific enviroment variables
require('dotenv').config();

//specific database connection path
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// setup app constants
const PORT = process.env.PORT;
const app = express();

// app.use(methodoverride((request, response) => {
//   if (request.body && typeof request.body === 'object' && '_method' in request.body) {
//     let method = request.body._method;
//     delete request.body._method;
//     return method;
//   }
// }));

// set server side view engine
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));


//creates new search--talks to the api
app.post('/show', getBooks);

// checking for table query
app.get('/', booksDB);
app.get('/new', (req, res) => {res.render('../public/views/pages/searches/new');});

// app.get("../public/views/pages/searches/show");
app.get("../public/views/pages/books/save");
app.get("../public/views/pages/books/show");

app.post('/save', addBooks);
app.get('/books/detail/:id', getDetails);




// Book model

function Book(data) {
  this.authors = data.authors[0];
  this.title = data.title;
  this.image = data.imageLinks.smallThumbnail;
  this.summary = data.description;
  this.isbn = data.industryIdentifiers[0].type + data.industryIdentifiers[0].identifier;

}

function getBooks(request, response) {
  console.log('insidegetbooksfunction')
  let _URL = `https://www.googleapis.com/books/v1/volumes?q=`;
  console.log('request.body.search', request.body.search);

  if (request.body.search[1] === 'title') { _URL += `+intitle:${request.body.search[0]}`; }

  if (request.body.search[1] === 'author') { _URL += `+inauthor:${request.body.search[0]}`; }



  superagent.get(_URL)
    .then(apiResults => apiResults.body.items.map(book => new Book(book.volumeInfo)))

    .catch(error => console.log('MAYDAY Im an error: ' + error))

    .then(results => response.render('../public/views/pages/searches/show', { results: results }))

    .catch(error => console.log('I want a snow day bc I hate errors like: ' + error));
}



function booksDB(request, response) {
  // our table NEEDS to be named books with this syntax
  let SQL = 'SELECT * from books;';
  //log in terminal showing status of sql query--currently showing as pending

  return client.query(SQL)
    .then(results => response.render('../public/views/pages/index', { results: results.rows }))
    .catch(error => handleError(error, '109'));
}

function getDetails(request, response) {
  const SQL = (`SELECT * FROM books WHERE id=$1`);
  let values = [request.params.id];

  return client.query(SQL, values)
    .then(result => {
      response.render('../public/views/pages/books/detail', { book: result.rows[0] });
    })
    .catch(error => handleError(error, '12'));
}

function addBooks(request, response) {
  let { title, author, isbn, image, description } = request.body;
  let SQL = `INSERT INTO books (title, author, isbn, image, description) VALUES ($1,$2,$3,$4,$5);`;
  let values = [title, author, isbn, image, description];

  return client.query(SQL, values)
    .then(response.redirect('/'))
    .catch(error => handleError(error, '130'));
}

//errorHandler
function handleError(error, location) {
  console.error('Sorry, there was an error: ' + error + ' where am I?: ' + location);
}

// catch-all route
// app.get('*', (req, res) => res.status(404).send('Not Found'));

// listening to server
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
});
