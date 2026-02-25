const Discipline = require('../models/Discipline');

exports.createDiscipline = async (req, res, next) => {
  try { const d = await Discipline.create(req.body); res.status(201).json(d); } catch (err) { next(err); }
};

exports.listDisciplines = async (req, res, next) => {
  try {
    const { sport } = req.query;
    const filter = sport ? { sport } : {};
    const ds = await Discipline.find(filter).populate('sport');
    res.json(ds);
  } catch (err) { next(err); }
};

exports.updateDiscipline = async (req, res, next) => {
  try { const d = await Discipline.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(d); } catch (err) { next(err); }
};

exports.deleteDiscipline = async (req, res, next) => {
  try { await Discipline.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (err) { next(err); }
};
