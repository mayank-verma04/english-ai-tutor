// controllers/onDemandTestController.js
const aiTestService = require('../services/aiTestService');
const { updateStreak } = require('../services/streakService');

const testTopicsList = [
  // --- Comprehension Group ---
  {
    value: 'Main Idea and Key Details',
    label: 'Main Idea & Key Details (Comprehension)',
  },
  {
    value: 'Making Inferences',
    label: 'Making Inferences (Comprehension)',
  },
  {
    value: "Understanding Author's Tone",
    label: "Understanding Author's Tone (Comprehension)",
  },
  // --- Composition Group ---
  {
    value: 'Paragraph Structuring',
    label: 'Paragraph Structuring (Composition)',
  },
  {
    value: 'Formal Email Writing',
    label: 'Formal Email Writing (Composition)',
  },
  {
    value: 'Persuasive Writing',
    label: 'Persuasive Writing (Composition)',
  },
  {
    value: 'Descriptive Writing',
    label: 'Descriptive Writing (Composition)',
  },
];

exports.generateQuestion = async (req, res) => {
  try {
    const { level, topic, questionType } = req.body;

    if (!level || !topic || !questionType) {
      return res
        .status(400)
        .json({ msg: 'Level, topic, and questionType are required.' });
    }

    const testContent = await aiTestService.generateQuestionForTest({
      level,
      topic,
      questionType,
    });
    res.json(testContent);
  } catch (err) {
    console.error('Error in generateQuestion controller:', err);
    res.status(500).json({ msg: err.message });
  }
};

exports.evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, level } = req.body;

    if (!question || !answer || !level) {
      return res.status(400).json({
        msg: 'Question, answer, and level are required for evaluation.',
      });
    }

    const evaluation = await aiTestService.evaluateAnswerForTest(
      question,
      answer,
      level
    );

    await updateStreak(req.user.id);

    res.json(evaluation);
  } catch (err) {
    console.error('Error in evaluateAnswer controller:', err);
    res.status(500).json({ msg: err.message });
  }
};

exports.evaluateObjective = async (req, res) => {
  try {
    // Expects an array of objects with the user's answer and the correct answer
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ msg: 'A valid "questions" array is required.' });
    }

    let score = 0;
    // Loop through each question to check the answer
    for (const item of questions) {
      if (!item.userAnswer || !item.correctAnswer) {
        // Skip malformed items but log a warning
        console.warn('Skipping malformed item in evaluateObjective:', item);
        continue;
      }

      // Compare answers, ignoring case and extra whitespace for fill-in-the-blanks
      const userAnswerCleaned = item.userAnswer.trim().toLowerCase();
      const correctAnswerCleaned = item.correctAnswer.trim().toLowerCase();

      if (userAnswerCleaned === correctAnswerCleaned) {
        score++;
      }
    }

    await updateStreak(req.user.id);

    res.json({
      score: score,
      totalQuestions: questions.length,
    });
  } catch (err) {
    console.error('Error in evaluateObjective controller:', err);
    res.status(500).json({ msg: err.message });
  }
};
