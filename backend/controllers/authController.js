// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    email = email.toLowerCase();

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash: hash });
    await user.save();

    res.json({ msg: 'User created' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase();

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: 'Invalid' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ msg: 'Invalid' });

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message || 'Server error' });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body; // Get token from frontend

    // 1. Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // 2. Get user info from the payload
    const { name, email, sub } = ticket.getPayload(); // 'sub' is the Google unique ID

    // 3. Check if user exists in your DB
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // Option: If user exists but has no googleId, you could link it here
      if (!user.googleId) {
        user.googleId = sub;
        await user.save();
      }
    } else {
      // 4. If user doesn't exist, create them (No password required)
      user = new User({
        name,
        email: email.toLowerCase(),
        passwordHash: null, // No password for Google users
        googleId: sub,
      });
      await user.save();
    }

    // 5. Generate your App's JWT (Same logic as your standard login)
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Google login failed' });
  }
};