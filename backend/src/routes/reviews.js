const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Get reviews for a product (public)
router.get('/product/:productId', reviewController.getProductReviews);

// Create a review (protected)
router.post('/', protect, reviewController.createReview);

// Update a review (protected)
router.put('/:id', protect, reviewController.updateReview);

// Delete a review (protected)
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
