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

  let order = new Order({
    orderItems: orderItemIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
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

module.exports = router;
