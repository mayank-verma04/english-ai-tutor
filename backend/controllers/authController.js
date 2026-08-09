// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

// GET /api/auth/profile  — returns logged-in user details
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -__v');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      points: user.points,
      streak: user.streak,
      googleId: user.googleId || null,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// PUT /api/auth/profile  — update name, email, and/or password
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update name
    if (name && name.trim()) {
      user.name = name.trim();
    }

    // Update email
    if (email && email.trim() && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) return res.status(400).json({ msg: 'Email already in use' });
      user.email = email.toLowerCase();
    }

    // Update password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ msg: 'Current password is required to set a new password' });
      }
      // Google users with no passwordHash cannot verify old password the normal way
      if (user.passwordHash) {
        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) return res.status(400).json({ msg: 'Current password is incorrect' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ msg: 'New password must be at least 6 characters' });
      }
      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.json({
      msg: 'Profile updated successfully',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

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