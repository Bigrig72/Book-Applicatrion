'use strict';


// app dependencies

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const ejs = require('ejs');


require('dotenv').config();


// setup app canstants
const PORT = process.env.PORT;
const app = express();

// set view engine
app.set('view engine', 'ejs');

// allow public acces to our api
app.use(cors());
app.use(express.static('./public'));

// listening to server
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
});

// routes

app.get('/', (request, response) => {
  response.render('../public/views/pages/index');
});

