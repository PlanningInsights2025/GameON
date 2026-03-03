const { sendOTPEmail } = require('../utils/emailService');

// In-memory OTP storage (in production, use Redis)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to email
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP with expiration (10 minutes)
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    const isProductionEmail = process.env.EMAIL_SERVICE === 'gmail';

    console.log(`[OTP] Sending OTP to ${email} | mode: ${isProductionEmail ? 'gmail' : 'dev-console'}`);

    // Send OTP email (throws on failure so catch block handles it)
    await sendOTPEmail(email, otp);

    // In dev mode (no Gmail configured), include OTP in response so registration still works
    res.status(200).json({ 
      message: isProductionEmail
        ? 'Verification code sent to your email'
        : 'OTP generated (dev mode — email not actually sent)',
      devOTP: isProductionEmail ? undefined : otp
    });
  } catch (error) {
    console.error('[OTP] sendOTP error:', error.message || error);

    // Give a specific message for common Gmail failures
    let userMessage = 'Failed to send verification email. Please try again.';
    if (error.message && error.message.includes('not configured')) {
      userMessage = 'Email service is not configured on the server. Contact support.';
    } else if (error.code === 'EAUTH' || (error.message && error.message.includes('Invalid login'))) {
      userMessage = 'Email service authentication failed. Contact support.';
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      userMessage = 'Could not connect to email service. Please try again in a moment.';
    }

    return res.status(500).json({ message: userMessage });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    // Check if OTP expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP verified successfully, remove it
    otpStore.delete(email);

    res.status(200).json({ 
      message: 'OTP verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes
