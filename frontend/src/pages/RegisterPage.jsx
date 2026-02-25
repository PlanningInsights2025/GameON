import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { otpService } from '../services/api';

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Email Verification
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [devOTP, setDevOTP] = useState(null);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (pass) => {
    return pass.length >= 6;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  // Step 1: Validate and submit basic info
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (!validatePassword(password)) newErrors.password = 'Password must be at least 6 characters';
    if (password !== passwordConfirm) newErrors.passwordConfirm = 'Passwords do not match';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setSendingOtp(true);
        // Send OTP to email via backend
        const response = await otpService.send(email);
        console.log('OTP Response:', response);
        
        // Store and show development OTP if available
        if (response.devOTP) {
          setDevOTP(response.devOTP);
          alert(`Development Mode - Your OTP: ${response.devOTP}`);
        }
        
        setOtpSent(true);
        setStep(2);
      } catch (error) {
        setErrors({ submit: error.response?.data?.message || 'Failed to send OTP' });
      } finally {
        setSendingOtp(false);
      }
    }
  };

  // Step 2: Verify OTP and complete registration
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!otp.trim()) newErrors.otp = 'OTP is required';
    else if (otp.length !== 6) newErrors.otp = 'OTP must be 6 digits';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        
        // Verify OTP with backend
        await otpService.verify(email, otp);
        
        // OTP verified, proceed with registration
        await register(name, email, password, phone);
        navigate('/');
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        setErrors({ otp: errorMessage });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setSendingOtp(true);
      setErrors({});
      const response = await otpService.send(email);
      
      // Show development OTP if available
      if (response.devOTP) {
        setDevOTP(response.devOTP);
        alert(`Development Mode - New OTP: ${response.devOTP}`);
      } else {
        alert('OTP resent successfully! Check your email.');
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to resend OTP' });
    } finally {
      setSendingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6">Create Account</h1>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit}>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-800">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className={`w-full border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-800">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-800">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={`w-full border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="9876543210"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-800">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Minimum 6 characters"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              {password && validatePassword(password) && (
                <p className="text-green-500 text-sm mt-1">✓ Password is strong</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-800">Confirm Password</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                className={`w-full border px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Re-enter password"
              />
              {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>}
            </div>

            {errors.submit && <p className="text-red-500 text-sm mb-3 p-3 bg-red-50 rounded">{errors.submit}</p>}

            <button 
              type="submit"
              disabled={sendingOtp}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {sendingOtp ? 'Sending OTP...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {/* Step 2: Email Verification */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit}>
            <div className="text-center mb-6">
              <svg className="w-12 h-12 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">Verify Your Email</h2>
              <p className="text-sm text-gray-600 mt-2">We sent a verification code to {email}</p>
            </div>

            {/* Development Mode OTP Display */}
            {devOTP && (
              <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800 mb-2">🔧 Development Mode</p>
                <p className="text-xs text-yellow-700 mb-2">Your verification code:</p>
                <p className="text-3xl font-bold text-yellow-900 text-center tracking-widest">{devOTP}</p>
                <p className="text-xs text-yellow-600 mt-2 text-center">Copy this code below</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-800">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={`w-full border px-4 py-3 text-center text-2xl tracking-widest rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="000000"
                maxLength="6"
              />
              {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
            </div>

            <button 
              type="button"
              onClick={handleResendOtp}
              className="text-sm text-blue-600 hover:text-blue-700 mb-4"
            >
              Didn't receive OTP? Resend
            </button>

            {errors.submit && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded">{errors.submit}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Verify & Create Account'}
            </button>

            <button 
              type="button"
              onClick={() => {
                setStep(1);
                setOtp('');
                setErrors({});
              }}
              className="w-full mt-3 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Back
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</a>
        </p>
      </div>
    </div>
  );
}
