const Review = require('../models/Review');
const Product = require('../models/Product');

// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ product, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      product,
      user: userId,
      rating,
      comment
    });

    await review.save();

    // Update product rating
    await updateProductRating(product);

    const populatedReview = await Review.findById(review._id).populate('user', 'name email');
    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Update product rating
    await updateProductRating(review.product);

    const populatedReview = await Review.findById(review._id).populate('user', 'name email');
    res.json(populatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    await updateProductRating(productId);

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update product rating
async function updateProductRating(productId) {
  const reviews = await Review.find({ product: productId });
  
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, { rating: 0 });
  } else {
    const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: avgRating.toFixed(1) });
  }
}
