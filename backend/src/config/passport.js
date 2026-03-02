const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'https://gameon-7sox.onrender.com'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false, { message: 'No email from Google' });

        // Check if user exists by googleId or email
        let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

        if (user) {
          // Link Google ID if they registered with email/password before
          if (!user.googleId) {
            user.googleId = profile.id;
            if (!user.avatar) user.avatar = profile.photos?.[0]?.value;
            await user.save();
          }
        } else {
          // Create new user
          user = await User.create({
            name: profile.displayName || email.split('@')[0],
            email,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || null,
            password: null, // No password for Google-only accounts
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Minimal session serialisation (we use JWT, sessions are only for the OAuth redirect handshake)
passport.serializeUser((user, done) => done(null, user._id.toString()));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
