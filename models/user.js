const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  author: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

// Converting _id to id for frontend purposes
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
