const Order = require('../models/Order');

const ONLINE_PAYMENT_METHODS = ['upi', 'card', 'netbanking'];

const generateTransactionId = () => {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TXN-${Date.now()}-${random}`;
};

const statusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1);

exports.createOrder = async (req, res, next) => {
  try {
    const { products, total, address, paymentMethod = 'cod', paymentDetails = {}, paymentConfirmed = false } = req.body;
    const isOnlinePayment = ONLINE_PAYMENT_METHODS.includes(paymentMethod);

    if (isOnlinePayment && !paymentConfirmed) {
      return res.status(400).json({ message: 'Complete prepaid payment before placing the order.' });
    }

    if (paymentMethod === 'upi' && !paymentDetails.upiId) {
      return res.status(400).json({ message: 'UPI ID is required for UPI payment.' });
    }

    if (paymentMethod === 'card' && !paymentDetails.cardLast4) {
      return res.status(400).json({ message: 'Valid card details are required for card payment.' });
    }

    if (paymentMethod === 'netbanking' && !paymentDetails.bankName) {
      return res.status(400).json({ message: 'Bank name is required for net banking payment.' });
    }

    const payment = {
      method: paymentMethod,
      status: isOnlinePayment ? 'paid' : 'pending',
      transactionId: isOnlinePayment ? generateTransactionId() : null,
      gateway: 'GameON Pay',
      paidAt: isOnlinePayment ? new Date() : null,
      details: {
        upiId: paymentMethod === 'upi' ? paymentDetails.upiId || null : null,
        cardLast4: paymentMethod === 'card' ? paymentDetails.cardLast4 || null : null,
        bankName: paymentMethod === 'netbanking' ? paymentDetails.bankName || null : null,
        note: paymentDetails.note || null
      }
    };

    const order = await Order.create({
      user: req.user.id,
      products,
      total,
      address,
      payment,
      updates: [
        {
          type: 'order_placed',
          title: 'Order placed',
          message: 'Your order has been placed successfully.'
        },
        {
          type: 'payment',
          title: isOnlinePayment ? 'Payment successful' : 'Payment pending',
          message: isOnlinePayment
            ? `Payment received via ${paymentMethod.toUpperCase()}.`
            : 'Cash on delivery selected. Payment will be collected at delivery.'
        },
        {
          type: 'status',
          title: 'Order status updated',
          message: `Current status: ${statusLabel('pending')}.`
        }
      ]
    });
    res.status(201).json(order);
  } catch (err) { next(err); }
};

exports.listOrders = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      const all = await Order.find().populate('user').populate('products.product');
      return res.json(all);
    }
    const userOrders = await Order.find({ user: req.user.id }).populate('products.product');
    res.json(userOrders);
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status.' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const previousStatus = order.status;
    order.status = status;
    if (!Array.isArray(order.updates)) {
      order.updates = [];
    }

    if (previousStatus !== status) {
      order.updates.push({
        type: 'status',
        title: 'Order status updated',
        message: `Status changed from ${statusLabel(previousStatus)} to ${statusLabel(status)}.`
      });
    }

    const isPrepaid = ONLINE_PAYMENT_METHODS.includes(order.payment?.method);
    const isPaid = order.payment?.status === 'paid';

    if (status === 'cancelled' && isPrepaid && isPaid) {
      order.payment.status = 'refunded';
      order.payment.refund = {
        status: 'processed',
        processedAt: new Date(),
        reason: 'Cancelled by admin'
      };
      order.updates.push({
        type: 'refund',
        title: 'Refund processed',
        message: 'Your prepaid order was cancelled by admin and refund has been processed.'
      });
    } else if (!order.payment?.refund) {
      order.payment.refund = {
        status: 'not_required',
        processedAt: null,
        reason: null
      };
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) { next(err); }
};
