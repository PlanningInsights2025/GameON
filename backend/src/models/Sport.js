const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  olympicCode: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Sport', sportSchema);
