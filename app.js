const express = require('express');
const app = express();
const morgan = require('morgan');

require('dotenv').config();

const api = process.env.API_URL;

// Middleware
app.use(express.json());
app.use(morgan('dev'));

app.get(`${api}/books`, (req, res) => {
  const book = {
    id: 1,
    name: 'hair dresser',
    image: 'some_url',
  };
  res.send(book);
});

app.post(`${api}/books`, (req, res) => {
  const newBook = req.body;
  console.log(newBook);
  res.send(newBook);
});

app.listen(3000, () => {
  console.log('server is running now at http://localhost:3000');
});
