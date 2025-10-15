// services/pointsService.js
const User = require('../models/User');
const EvaluationResult = require('../models/EvaluationResult');
const { updateStreak } = require('./streakService');

exports.saveEvaluation = async (
  userId,
  module,
  step,
  level,
  sequence,
  answer,
  evaluation
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  let evalRecord = await EvaluationResult.findOne({
    userId,
    module,
    step,
    level,
    sequence,
  });

  let pointsChange = 0;
  let result;

  if (evalRecord) {
    // Logic for an EXISTING evaluation
    const oldScore = evalRecord.score || 0;
    pointsChange = evaluation.score - oldScore;

    evalRecord.answer = answer;
    evalRecord.rubric = evaluation.rubric;
    evalRecord.score = evaluation.score;
    evalRecord.maxScore = evaluation.maxScore;
    evalRecord.pointsAwarded = evaluation.score;

    result = {
      success: true,
      updated: true,
      pointsAwarded: evaluation.score,
      evalId: evalRecord._id,
    };
  } else {
    // Logic for a NEW evaluation
    pointsChange = evaluation.score;
    evalRecord = new EvaluationResult({
      userId,
      module,
      step,
      level,
      sequence,
      answer,
      rubric: evaluation.rubric,
      score: evaluation.score,
      maxScore: evaluation.maxScore,
      pointsAwarded: evaluation.score,
    });

    result = {
      success: true,
      updated: false,
      pointsAwarded: evaluation.score,
      evalId: evalRecord._id,
    };
  }

  // ✅ ATOMICALLY UPDATE POINTS
  // This is safer and prevents race conditions
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { points: pointsChange } },
    { new: true } // This option returns the updated document
  );

  await evalRecord.save();

  // ✅ UPDATE STREAK FOR BOTH NEW AND UPDATED SUBMISSIONS
  await updateStreak(userId);

  result.totalPoints = updatedUser.points;
  return result;
};
