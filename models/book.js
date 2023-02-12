const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    defult: '',
  },
  image: {
    type: String,
    defult: '',
  },
  images: [
    {
      type: String,
    },
  ],
  genre: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  author: String,
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  rating: {
    type: Number,
    defult: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Converting _id to id for frontend purposes
bookSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

bookSchema.set('toJSON', {
  virtuals: true,
});

exports.Book = mongoose.model('Book', bookSchema);
