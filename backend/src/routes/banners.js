const express = require('express');
const router = express.Router();
const { 
  getBanners, 
  getActiveBanners,
  createBanner, 
  updateBanner, 
  deleteBanner,
  toggleBannerStatus
} = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/auth');

// Public route - get active banners
router.get('/active', getActiveBanners);

// Admin routes
router.get('/', protect, admin, getBanners);
router.post('/', protect, admin, createBanner);
router.put('/:id', protect, admin, updateBanner);
router.delete('/:id', protect, admin, deleteBanner);
router.patch('/:id/toggle', protect, admin, toggleBannerStatus);

module.exports = router;
