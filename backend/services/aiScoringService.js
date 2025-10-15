// services/aiScoringService.js
const genAI = require('../config/gemini');
const scoringConfig = require('../config/scoringConfig');

function extractJson(text) {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error('Failed to parse extracted JSON:', e);
      return null;
    }
  }
  console.error('No JSON block found in the response.');
  return null;
}

exports.evaluateWithAI = async (module, step, level, question, answer) => {
  const taskConfig = scoringConfig[module]?.[step];
  if (!taskConfig) {
    throw new Error(
      `Configuration for module "${module}" and step "${step}" not found.`
    );
  }

  const { maxScore, evaluationCriteria } = taskConfig;
  const levelWeight = scoringConfig.levelWeights[level] || 1.0;

  const criteriaList = Object.keys(evaluationCriteria).join(', ');

  const prompt = `
You are a highly experienced English teacher providing feedback for a student at the "${level}" level. The student is completing a "${step}" exercise in a "${module}" module.

**The Question Was:**
${question}

**The Student's Answer:**
"${answer}"

**Evaluation Instructions:**
1.  Carefully analyze the student's answer based on the following criteria: **${criteriaList}**.
2.  For each criterion, provide a score from 0 to 10, where 0 is very poor and 10 is excellent.
3.  Provide constructive, encouraging, and actionable feedback in simple language suitable for a "${level}" learner. Explain what they did well and give specific examples of how they can improve.
4.  Return ONLY a single JSON object in a markdown code block. Do not add any text before or after the JSON block.

**JSON Output Format:**
{
  "scores": {
    "${Object.keys(evaluationCriteria)[0]}": <score_for_first_criterion>,
    "${Object.keys(evaluationCriteria)[1]}": <score_for_second_criterion>
  },
  "feedback": "<Your detailed feedback here>"
}
`;
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const rubric = extractJson(text);
  if (!rubric || !rubric.scores) {
    throw new Error(
      'Failed to parse a valid rubric from the AI response: ' + text
    );
  }

  let weightedScoreSum = 0;
  let totalWeight = 0;

  for (const criterion in rubric.scores) {
    if (evaluationCriteria.hasOwnProperty(criterion)) {
      const score = rubric.scores[criterion];
      const weight = evaluationCriteria[criterion];
      weightedScoreSum += (score / 10) * weight;
      totalWeight += weight;
    }
  }

  const finalScore = (weightedScoreSum / totalWeight) * maxScore;

  const finalWeightedScore = Math.round(finalScore * levelWeight);

  return {
    rubric: rubric.scores,
    score: Math.min(finalWeightedScore, maxScore),
    maxScore,
    feedback: rubric.feedback || 'Good attempt. Keep practicing!',
  };
};
