const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  name: String,
  author: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

exports.Book = mongoose.model('Book', bookSchema);
