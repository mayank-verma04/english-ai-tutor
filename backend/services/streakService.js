// services/streakService.js
const User = require('../models/User');

/**
 * A helper function to get the start of a given date in UTC.
 * This removes the time component, ensuring we only compare dates.
 * @param {Date} date The date to normalize.
 * @returns {Date} The start of the day in UTC.
 */
const getStartOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
};

exports.updateStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`Streak Service: User ${userId} not found.`);
      return;
    }

    const today = getStartOfDay(new Date());
    const lastActiveDate = user.streak.lastActive
      ? getStartOfDay(user.streak.lastActive)
      : null;

    // Case 1: First activity ever
    if (!lastActiveDate) {
      user.streak.count = 1;
      user.streak.lastActive = new Date();
    } else {
      // Case 2: Already active today, do nothing
      if (today.getTime() === lastActiveDate.getTime()) {
        console.log(`Streak for ${user.name} is already updated for today.`);
        return user.streak;
      }

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Case 3: Continued streak from yesterday
      if (lastActiveDate.getTime() === yesterday.getTime()) {
        user.streak.count += 1;
        user.streak.lastActive = new Date();
      }
      // Case 4: Streak is broken (last active was before yesterday)
      else {
        user.streak.count = 1;
        user.streak.lastActive = new Date();
      }
    }

    await user.save();
    console.log(`Streak for ${user.name} updated to ${user.streak.count}.`);
    return user.streak;
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};
