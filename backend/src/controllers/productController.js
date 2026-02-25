const Product = require('../models/Product');

exports.createProduct = async (req, res, next) => {
  try { const p = await Product.create(req.body); res.status(201).json(p); } catch (err) { next(err); }
};

exports.listProducts = async (req, res, next) => {
  try {
    const { sport, discipline, brand, minPrice, maxPrice, q } = req.query;
    const filter = {};
    if (sport) filter.sport = sport;
    if (discipline) filter.discipline = discipline;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (q) filter.name = { $regex: q, $options: 'i' };
    const products = await Product.find(filter).populate('sport discipline');
    res.json(products);
  } catch (err) { next(err); }
};

exports.getProduct = async (req, res, next) => {
  try { const p = await Product.findById(req.params.id).populate('sport discipline'); res.json(p); } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try { const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(p); } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (err) { next(err); }
};
