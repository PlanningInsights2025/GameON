const express = require('express');
const router = express.Router();
const { createOrder, listOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, listOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
