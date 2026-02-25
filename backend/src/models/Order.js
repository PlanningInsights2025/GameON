const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      qty: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  address: {
    name: { type: String, default: null },
    phone: { type: String, default: null },
    street: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    zipCode: { type: String, default: null },
    country: { type: String, default: 'India' }
  },
  status: { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
  payment: {
    method: {
      type: String,
      enum: ['cod', 'upi', 'card', 'netbanking'],
      default: 'cod'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: { type: String, default: null },
    gateway: { type: String, default: 'GameON Pay' },
    paidAt: { type: Date, default: null },
    details: {
      upiId: { type: String, default: null },
      cardLast4: { type: String, default: null },
      bankName: { type: String, default: null },
      note: { type: String, default: null }
    },
    refund: {
      status: {
        type: String,
        enum: ['not_required', 'pending', 'processed'],
        default: 'not_required'
      },
      processedAt: { type: Date, default: null },
      reason: { type: String, default: null }
    }
  },
  updates: [
    {
      type: {
        type: String,
        enum: ['order_placed', 'payment', 'status', 'refund', 'note'],
        required: true
      },
      title: { type: String, required: true },
      message: { type: String, required: true },
      at: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
