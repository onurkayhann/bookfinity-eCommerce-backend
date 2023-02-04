const { Book } = require('../models/book');
const express = require('express');
const router = express.Router();

// APIs
router.get(`/`, async (req, res) => {
  const bookList = await Book.find();

  if (!bookList) {
    res.status(500).json({ success: false });
  }
  res.send(bookList);
});

router.post(`/`, (req, res) => {
  const book = new Book({
    name: req.body.name,
    author: req.body.author,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  book
    .save()
    .then((createdBook) => {
      res.status(201).json(createdBook);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

module.exports = router;
