// controllers/progressController.js
const Progress = require('../models/Progress');
const { updateStreak } = require('../services/streakService'); // ✅ Import the streak service

exports.updateProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { module, level, lastSeenSequence } = req.body;
    const step = req.params.step; // e.g., "vocabulary", "sentence"

    if (lastSeenSequence === undefined) {
      return res.status(400).json({ msg: 'lastSeenSequence is required.' });
    }

    let progress = await Progress.findOne({ userId, module, level, step });

    if (!progress) {
      progress = new Progress({
        userId,
        module,
        level,
        step,
        lastSeenSequence,
      });
    } else {
      // Only update if the new sequence is greater than the old one
      if (lastSeenSequence > progress.lastSeenSequence) {
        progress.lastSeenSequence = lastSeenSequence;
        progress.updatedAt = new Date();
      }
    }

    await progress.save();

    // ✅ UPDATE THE USER'S STREAK AFTER PROGRESS IS SAVED
    await updateStreak(userId);

    res.json({ msg: 'Progress updated', progress });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
