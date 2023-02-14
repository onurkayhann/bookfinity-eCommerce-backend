const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authJwt = require('./helper/jwt');

// Cors
app.use(cors());
app.options('*', cors);

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(authJwt());

// Routes
const categoriesRouter = require('./routes/categories');
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');

// Env Variable
const api = process.env.API_URL;

// Routers
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/books`, booksRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);

// Database connection
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'bookfinity-database',
  })
  .then(() => {
    console.log('Database Connection is ready...');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log('server is running now at http://localhost:3000');
});
