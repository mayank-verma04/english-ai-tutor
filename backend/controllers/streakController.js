// controllers/streakController.js
const User = require('../models/User');

exports.getStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('streak');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.streak);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
