const { Order } = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/orderItem');
const router = express.Router();

// --- APIs --- \\

// Getting all the orders
router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate('user', 'name')
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }

  res.send(orderList);
});

// Getting order by id
router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({
      path: 'orderItems',
      populate: { path: 'book', populate: 'category' },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }

  res.send(order);
});

// Create order
router.post('/', async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        book: orderItem.book,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const orderItemIdsResolved = await orderItemsIds; // To prevent Promise

  // Calculating the total price internally in the backend
  const totalPrices = await Promise.all(
    orderItemIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        'book',
        'price'
      );
      const totalPrice = orderItem.book.price * orderItem.quantity;

      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0); // Calculating the total amount internally in the backend

  console.log(totalPrices);

  let order = new Order({
    orderItems: orderItemIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  order = await order.save();

  if (!order) return res.status(400).send('Order cannot be created!');

  res.send(order);
});

// Update order status
router.put('/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return res.status(400).send('The order cannot be updated!');

  res.send(order);
});

// Delete order and orderItem altogether
router.delete('/:id', (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res.status(200).json({
          success: true,
          message: 'The order has been successfully deleted',
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Error when trying to delete the order, please try again',
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

// Show total amount of sales for the admin in the admin panel
router.get('/get/totalsales', async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } },
  ]);

  if (!totalSales) return res.status(400).send('Cannot get total sales!');

  res.send({ totalSales: totalSales.pop().totalsales });
});

// Get amount of sales in the admin panel for the admin
router.get(`/get/count`, async (req, res) => {
  const orderCount = await Order.countDocuments();

  if (!orderCount) res.status(500).json({ success: false });

  res.send({ orderCount: orderCount });
});

// Get user orders
router.get(`/get/userorders/:userid`, async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: 'orderItems',
      populate: {
        path: 'book',
        populate: 'category',
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) res.status(500).json({ success: false });

  res.send(userOrderList);
});

module.exports = router;
