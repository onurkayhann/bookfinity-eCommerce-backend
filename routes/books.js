const { Book } = require('../models/book');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// APIs

// Create book
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

// Get all books
router.get(`/`, async (req, res) => {
  let filter = {};

  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') };
  }

  const bookList = await Book.find(filter).populate('category');

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

// Update book
router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid book id');
  }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category');

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
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
    },
    { new: true }
  );

  if (!book) return res.status(500).send('The book cannot be updated!');

  res.send(book);
});

// Delete book
router.delete('/:id', (req, res) => {
  Book.findByIdAndRemove(req.params.id)
    .then((book) => {
      if (book) {
        return res.status(200).json({
          success: true,
          message: 'The book was successfully deleted',
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'Book not found!' });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// Get amount of books in the database
router.get(`/get/count`, async (req, res) => {
  const bookCount = await Book.countDocuments();

  if (!bookCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    bookCount: bookCount,
  });
});

// Get featured books - with possibility to limit on the frontend
router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const bookFeatured = await Book.find({ isFeatured: true }).limit(+count);

  if (!bookFeatured) {
    res.status(500).json({ success: false });
  }
  res.send(bookFeatured);
});

module.exports = router;
