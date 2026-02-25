const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
  discipline: { type: mongoose.Schema.Types.ObjectId, ref: 'Discipline' },
  images: [{ type: String }],
  brand: { type: String },
  rating: { type: Number, default: 4.0, min: 0, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
