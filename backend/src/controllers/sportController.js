const Sport = require('../models/Sport');

exports.createSport = async (req, res, next) => {
  try {
    const sport = await Sport.create(req.body);
    res.status(201).json(sport);
  } catch (err) { next(err); }
};

exports.listSports = async (req, res, next) => {
  try {
    const sports = await Sport.find().sort('name');
    res.json(sports);
  } catch (err) { next(err); }
};

exports.getSport = async (req, res, next) => {
  try { const sport = await Sport.findById(req.params.id); res.json(sport); } catch (err) { next(err); }
};

exports.updateSport = async (req, res, next) => {
  try { const sport = await Sport.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(sport); } catch (err) { next(err); }
};

exports.deleteSport = async (req, res, next) => {
  try { await Sport.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (err) { next(err); }
};
