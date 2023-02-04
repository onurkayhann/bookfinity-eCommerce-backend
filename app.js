const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

require('dotenv').config();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
const booksRouter = require('./routes/books');
const categoriesRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

// Env Variable
const api = process.env.API_URL;

// Routers
app.use(`${api}/books`, booksRouter);
app.use(`${api}/categories`, categoriesRouter);
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
