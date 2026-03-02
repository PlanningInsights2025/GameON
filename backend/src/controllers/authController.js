const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendLoginNotificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

// In-memory store for password-reset OTPs (same pattern as otpController)
const resetOtpStore = new Map();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: generateToken(user), user: safeUser(user) });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.password) return res.status(401).json({ message: 'This account uses Google sign-in. Please login with Google.' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Send login notification email (non-blocking)
    const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST';
    sendLoginNotificationEmail(user.email, user.name, loginTime).catch(() => {});

    res.json({ token: generateToken(user), user: safeUser(user) });
  } catch (err) { next(err); }
};

// GET /api/auth/me — returns logged-in user info
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: safeUser(user) });
  } catch (err) { next(err); }
};

// POST /api/auth/forgot-password — send OTP to registered email
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });
    if (!user.password) return res.status(400).json({ message: 'This account uses Google sign-in. Password reset is not available.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    resetOtpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    await sendPasswordResetEmail(email, user.name, otp);
    res.json({ message: 'Password reset OTP sent to your email' });
  } catch (err) { next(err); }
};

// POST /api/auth/reset-password — verify OTP and set new password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: 'Email, OTP and new password are required' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const stored = resetOtpStore.get(email);
    if (!stored) return res.status(400).json({ message: 'OTP not found or expired. Please request a new one.' });
    if (Date.now() > stored.expiresAt) { resetOtpStore.delete(email); return res.status(400).json({ message: 'OTP expired. Please request a new one.' }); }
    if (stored.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    resetOtpStore.delete(email);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword; // pre-save hook will hash it
    await user.save();

    res.json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (err) { next(err); }
};

// GET /api/auth/google/callback — called by Passport after Google OAuth
exports.googleCallback = (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user);
    const frontendUrl = process.env.FRONTEND_URL || 'https://gameon24.netlify.app';
    // Redirect to frontend with token in query string; frontend reads it and stores in localStorage
    res.redirect(`${frontendUrl}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(safeUser(user)))}`);
  } catch (err) {
    const frontendUrl = process.env.FRONTEND_URL || 'https://gameon24.netlify.app';
    res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
  }
};
