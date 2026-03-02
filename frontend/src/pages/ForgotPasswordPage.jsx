import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  // Step 1 — send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError('Please enter your email address');
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim().toLowerCase());
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setError('Please enter the 6-digit OTP');
    setError('');
    setStep(3);
  };

  // Resend OTP
  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await authService.forgotPassword(email);
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  // Step 3 — reset password
  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return setError('Password must be at least 6 characters');
    if (newPassword !== confirmPassword) return setError('Passwords do not match');
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(email, otp, newPassword);
      navigate('/login', { state: { message: 'Password reset successful! Please login with your new password.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
      if (err.response?.data?.message?.toLowerCase().includes('otp')) setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
              <span className="text-xl font-bold text-white">GO</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">GameON</span>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8 space-x-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>{s}</div>
              {s < 3 && <div className={`w-12 h-1 mx-1 rounded transition-all ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* ── Step 1: Email ── */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
            <p className="text-gray-500 mb-6 text-sm">Enter your registered email and we'll send you a reset code.</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 transition-all"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
            <p className="text-center text-sm text-gray-500 mt-5">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
            </p>
          </form>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
            <p className="text-gray-500 mb-6 text-sm">
              We sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span>. Enter it below.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5 text-center text-2xl tracking-widest font-mono"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Verify Code
            </button>
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Change email
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-blue-600 font-medium hover:underline disabled:opacity-60"
              >
                {resending ? 'Sending...' : 'Resend code'}
              </button>
            </div>
          </form>
        )}

        {/* ── Step 3: New Password ── */}
        {step === 3 && (
          <form onSubmit={handleReset}>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Set New Password</h2>
            <p className="text-gray-500 mb-6 text-sm">Choose a strong password for your GameON account.</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              required
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 transition-all"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
