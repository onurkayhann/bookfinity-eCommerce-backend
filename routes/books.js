const { Book } = require('../models/book');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

// APIs

// Get all books
router.get(`/`, async (req, res) => {
  const bookList = await Book.find().populate('category');

  // const bookList = await Book.find().select('name author');
  // select and you can get specific data - put minus(-) before a data and you exclude it

  if (!bookList) {
    res.status(500).json({ success: false });
  }
  res.send(bookList);
});

// Get one book
router.get(`/:id`, async (req, res) => {
  const book = await Book.findById(req.params.id).populate('category');

  if (!book) {
    res.status(500).json({ success: false });
  }
  res.send(book);
});

router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category');

  const book = new Book({
    name: req.body.name,
    author: req.body.author,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    genre: req.body.genre,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  await book.save();

  if (!book) return res.status(500).send('The book cannot be created.');

  res.send(book);
});

module.exports = router;
