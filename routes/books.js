const { Book } = require('../models/book');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer'); // To upload files, for example uploading a photos of specific book

// MIME type - allowing only jpg, jpeg, and png as photo upload
const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

// --- APIs --- \\

// Multer API, to be able to upload photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isPhotoValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error(
      'Invalid photo type, use only jpg, jpeg or png'
    );

    if (isPhotoValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage }); // Passing this to POST endpoint where Admin creates books

// Create book
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category'); // error message if category is invalid

  const file = req.file;
  if (!file) return res.status(400).send('Please upload a photo'); // error message if photo doesn't exist

  const fileName = req.file.filename; // Uploaded photo url
  const photoPath = `${req.protocol}://${req.get('host')}/public/uploads/`; // Uploaded photo url

  const book = new Book({
    name: req.body.name,
    author: req.body.author,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${photoPath}${fileName}`, // --> "http://localhost:3000/public/uploads/image-3333"
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
router.put('/:id', uploadOptions.single('image'), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid book id');
  }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send('Invalid Category');

  const book = await Book.findById(req.params.id);
  if (!book) return res.status(400).send('Invalid book');

  const file = req.file;
  let photoPath;

  if (file) {
    const fileName = file.filename;
    const photoPath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    photoPath = `${photoPath}${fileName}`;
  } else {
    photoPath = book.image;
  }

  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      author: req.body.author,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: photoPath,
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

  if (!updatedBook) return res.status(500).send('The book cannot be updated!');

  res.send(updatedBook);
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

// Get amount of books in the BookFinity shop/database
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

// Update Book gallery images
router.put(
  '/gallery-images/:id',
  uploadOptions.array('images', 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send('Invalid book id');
    }

    const files = req.files;
    let imagesPaths = [];
    const photoPath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${photoPath}${file.filename}`);
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!updatedBook)
      return res.status(500).send('The book gallery cannot be updated!');

    res.send(updatedBook);
  }
);

module.exports = router;
