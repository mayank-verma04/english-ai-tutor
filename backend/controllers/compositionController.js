// controllers/compositionController.js
const { evaluateWithAI } = require('../services/aiScoringService');
const { saveEvaluation } = require('../services/pointsService');

exports.submitComposition = async (req, res) => {
  try {
    const userId = req.user.id;
    const step = req.params.step; // e.g., "essays", "letters"
    const {
      module = 'composition',
      level,
      sequence,
      question,
      answer,
    } = req.body;

    if (!answer || !level || !sequence || !question) {
      return res.status(400).json({
        error: 'Missing fields: answer, level, sequence, question required',
      });
    }

    // 1. AI Evaluation
    const evaluation = await evaluateWithAI(
      module,
      step,
      level,
      question,
      answer
    );

    // 2. Save result + update user points
    const result = await saveEvaluation(
      userId,
      module,
      step,
      level,
      sequence,
      answer,
      evaluation
    );

    // 3. Response
    res.json({
      msg: 'Composition evaluated successfully',
      evaluation,
      points: result,
    });
  } catch (err) {
    console.error('Error in submitComposition:', err);
    res.status(500).json({ error: err.message });
  }
};
