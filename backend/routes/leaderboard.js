// routes/leaderboard.js
const express = require('express');
const { getLeaderboard } = require('../controllers/leaderboardController');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/leaderboard - Get the top users and current user's rank
router.get('/', auth, getLeaderboard);

module.exports = router;
