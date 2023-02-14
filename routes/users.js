const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ---- APIs ---- //

// Get all users
router.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash'); // <-- exclude user password in the api call

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

// Get one user
router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash'); // <-- exclude user password in the api call

  if (!user) {
    res.status(500).json({ message: 'The user with that id was not found' });
  }

  res.status(200).send(user);
});

// For admin, remove or add users
router.post(`/`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) return res.status(400).send('the user cannot be created!');

  res.send(user);
});

// Register user
router.post(`/register`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) return res.status(400).send('the user cannot be created!');

  res.send(user);
});

// Login user
router.post(`/login`, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const secret = process.env.SECRET;

  if (!user) {
    return res.status(400).send('User not found');
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      secret,
      { expiresIn: '1d' } // token will expire in one day
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    return res.status(400).send('Invalid password!');
  }
});

module.exports = router;
