const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, getMe, forgotPassword, resetPassword, googleCallback } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Email / password auth
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Forgot / reset password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: true }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'https://gameon24.netlify.app'}/login?error=google_auth_failed`, session: true }),
  googleCallback
);

module.exports = router;
