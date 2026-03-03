const nodemailer = require('nodemailer');

// Create transporter with Gmail or other SMTP service
const createTransporter = () => {
  // For production, use real SMTP credentials from .env
  
  if (process.env.EMAIL_SERVICE === 'gmail') {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ Gmail credentials missing: EMAIL_USER and EMAIL_PASSWORD must be set in environment variables.');
      throw new Error('Email service not configured. Please set EMAIL_USER and EMAIL_PASSWORD on Render.');
    }
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD  // Use a Gmail App Password, not your regular password
        },
        // Prevent hanging indefinitely on bad credentials or network issues
        connectionTimeout: 10000,  // 10 seconds to establish connection
        greetingTimeout: 10000,    // 10 seconds for SMTP greeting
        socketTimeout: 15000,      // 15 seconds of inactivity before aborting
      });
      console.log('✓ Gmail transporter created successfully');
      return transporter;
    } catch (error) {
      console.error('Error creating Gmail transporter:', error);
      throw error;
    }
  }
  
  // Default: Use console logging for development
  console.warn('⚠️  EMAIL_SERVICE is not set to "gmail" — emails will only be logged to console (dev mode).');
  return {
    sendMail: async (mailOptions) => {
      console.log('\n📧 [DEV] Email would be sent:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Text:', mailOptions.text);
      console.log('---\n');
      return { messageId: 'dev-' + Date.now() };
    }
  };
};

const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();

  // Format sender with custom name when using Gmail
  const fromEmail = process.env.EMAIL_USER 
    ? `GameON <${process.env.EMAIL_USER}>`
    : 'GameON <noreply@gameon.com>';

  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: 'Email Verification - GameON',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">GameON</h1>
            <p style="color: #6b7280; margin-top: 5px;">Sports Equipment Store</p>
          </div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email Address</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Thank you for registering with GameON! To complete your registration, please use the verification code below:
          </p>
          
          <div style="background-color: #eff6ff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Your Verification Code:</p>
            <h1 style="color: #2563eb; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">${otp}</h1>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 10px;">
            This code will expire in <strong>10 minutes</strong>.
          </p>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            If you didn't request this code, please ignore this email or contact our support team.
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2026 GameON - Sports Equipment. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
      GameON - Email Verification
      
      Your verification code is: ${otp}
      
      This code will expire in 10 minutes.
      
      If you didn't request this code, please ignore this email.
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

const sendLoginNotificationEmail = async (email, name, loginTime) => {
  const transporter = createTransporter();
  const fromEmail = process.env.EMAIL_USER ? `GameON <${process.env.EMAIL_USER}>` : 'GameON <noreply@gameon.com>';
  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: 'New Login to Your GameON Account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background-color:#f9fafb;">
        <div style="background:#fff;padding:30px;border-radius:10px;box-shadow:0 2px 4px rgba(0,0,0,.1)">
          <div style="text-align:center;margin-bottom:24px">
            <h1 style="color:#2563eb;margin:0">GameON</h1>
            <p style="color:#6b7280;margin-top:5px">Sports Equipment Store</p>
          </div>
          <h2 style="color:#1f2937">Hi ${name}, a new login was detected</h2>
          <p style="color:#4b5563;line-height:1.6">We noticed a new sign-in to your GameON account.</p>
          <div style="background:#f1f5f9;border-left:4px solid #2563eb;border-radius:6px;padding:16px;margin:24px 0">
            <p style="margin:0;color:#374151"><strong>Time:</strong> ${loginTime}</p>
          </div>
          <p style="color:#4b5563;line-height:1.6">If this was you, no action is needed. If you didn't sign in, please <strong>change your password immediately</strong> and contact our support team.</p>
          <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb">
            <p style="color:#9ca3af;font-size:12px;margin:0">© 2026 GameON - Sports Equipment. All rights reserved.</p>
          </div>
        </div>
      </div>`,
    text: `Hi ${name}, a new login to your GameON account was detected at ${loginTime}. If this wasn't you, change your password immediately.`
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Login notification email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending login notification:', error);
    // Non-critical — don't throw, just log
  }
};

const sendPasswordResetEmail = async (email, name, otp) => {
  const transporter = createTransporter();
  const fromEmail = process.env.EMAIL_USER ? `GameON <${process.env.EMAIL_USER}>` : 'GameON <noreply@gameon.com>';
  const mailOptions = {
    from: fromEmail,
    to: email,
    subject: 'Reset Your GameON Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background-color:#f9fafb;">
        <div style="background:#fff;padding:30px;border-radius:10px;box-shadow:0 2px 4px rgba(0,0,0,.1)">
          <div style="text-align:center;margin-bottom:24px">
            <h1 style="color:#2563eb;margin:0">GameON</h1>
            <p style="color:#6b7280;margin-top:5px">Sports Equipment Store</p>
          </div>
          <h2 style="color:#1f2937">Hi ${name}, reset your password</h2>
          <p style="color:#4b5563;line-height:1.6">Use the code below to reset your GameON password. This code expires in <strong>10 minutes</strong>.</p>
          <div style="background:#eff6ff;border:2px solid #2563eb;border-radius:8px;padding:20px;text-align:center;margin:30px 0">
            <p style="color:#6b7280;font-size:14px;margin:0 0 10px 0">Your Password Reset Code:</p>
            <h1 style="color:#2563eb;font-size:36px;letter-spacing:8px;margin:0;font-family:monospace">${otp}</h1>
          </div>
          <p style="color:#6b7280;font-size:14px;line-height:1.6">If you didn't request a password reset, please ignore this email. Your password will not change.</p>
          <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb">
            <p style="color:#9ca3af;font-size:12px;margin:0">© 2026 GameON - Sports Equipment. All rights reserved.</p>
          </div>
        </div>
      </div>`,
    text: `Hi ${name}, your GameON password reset code is: ${otp}. It expires in 10 minutes.`
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

module.exports = { sendOTPEmail, sendLoginNotificationEmail, sendPasswordResetEmail };
