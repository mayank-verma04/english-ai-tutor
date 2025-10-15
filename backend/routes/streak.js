// routes/streak.js
const express = require('express');
const { getStreak } = require('../controllers/streakController');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/streak - Get current user's streak
router.get('/', auth, getStreak);

module.exports = router;
