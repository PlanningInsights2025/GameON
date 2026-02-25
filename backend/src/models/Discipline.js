const mongoose = require('mongoose');

const disciplineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Discipline', disciplineSchema);
