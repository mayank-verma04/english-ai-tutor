// controllers/leaderboardController.js
const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 10;

    const topUsers = await User.find()
      .sort({ points: -1, createdAt: 1 })
      .limit(limit)
      .select('name points');

    let lastPoints = -1;
    let currentRank = 0;
    const rankedLeaderboard = topUsers.map((user, index) => {
      if (user.points !== lastPoints) {
        currentRank = index + 1;
      }
      lastPoints = user.points;

      return {
        rank: currentRank,
        _id: user._id,
        name: user.name,
        points: user.points,
      };
    });

    const currentUser = await User.findById(userId).select('points');
    if (!currentUser) {
      return res.status(404).json({ msg: 'Current user not found' });
    }

    const userRank =
      (await User.countDocuments({ points: { $gt: currentUser.points } })) + 1;

    res.json({
      leaderboard: rankedLeaderboard,
      currentUser: {
        rank: userRank,
        points: currentUser.points,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
