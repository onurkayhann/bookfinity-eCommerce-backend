const { Order } = require('../models/order');
const express = require('express');
const router = express.Router();

// APIs
router.get(`/`, async (req, res) => {
  const orderList = await Order.find();

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

module.exports = router;
