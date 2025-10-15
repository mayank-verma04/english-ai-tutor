// services/aiTestService.js
const genAI = require('../config/gemini');

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

exports.generateQuestionForTest = async (config) => {
  const { level, topic, questionType } = config;
  let prompt;

  if (questionType === 'mcq' || questionType === 'fill-in-the-blank') {
    prompt = `
      You are an English test creator. Generate a set of 6 to 10 objective questions for an English learner.
      
      **Specifications:**
      - Level: "${level}"
      - Topic: "${topic}"
      - Question Type: "${questionType}"
      
      **Instructions:**
      - For "mcq", provide 4 options and the correct answer text.
      - For "fill-in-the-blank", the question should contain a blank (e.g., "___") and you must provide the correct word(s).
      - Return ONLY a single JSON object in a markdown code block.
      - Do not give both types of questions together; only provide the type requested.
      
      **JSON Output Format:**
      {
        "questions": [
        // For "fill-in-the-blank"
          {
            "questionText": "The cat is sitting ___ the table.",
            "questionType": "fill-in-the-blank",
            "correctAnswer": "on"
          },
        // For "mcq"
          {
            "questionText": "What is the past tense of 'run'?",
            "questionType": "mcq",
            "options": ["runned", "ran", "running", "runs"],
            "correctAnswer": "ran"
          }
        ]
      }
    `;
  } else if (questionType === 'short-answer' || questionType === 'essay') {
    // --- PROMPT FOR SUBJECTIVE QUESTIONS (Short Answer / Essay) ---
    prompt = `
      You are an English test creator. Generate ONE SINGLE subjective question prompt for an English learner.
      
      **Specifications:**
      - Level: "${level}"
      - Topic: "${topic}"
      - Question Type: "${questionType}"
      
      **Instructions:**
      - The question should be open-ended and suitable for the user's level.
      - Return ONLY a single JSON object in a markdown code block.
      
      **JSON Output Format:**
      {
        "question": {
          "questionText": "Describe your favorite holiday in 3-4 sentences.",
          "questionType": "${questionType}"
        }
      }
    `;
  } else {
    throw new Error('Unsupported question type.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const jsonResponse = extractJson(result.response.text());

  if (!jsonResponse) {
    throw new Error('Failed to generate a valid test from AI.');
  }
  return jsonResponse;
};

exports.evaluateAnswerForTest = async (question, answer, level) => {
  const prompt = `
    You are an expert English teacher evaluating a student's answer.
    
    **Student's Level:** ${level}
    **The Question Asked:** "${question}"
    **The Student's Answer:** "${answer}"
    
    **Instructions:**
    1. Evaluate the answer based on grammar, relevance to the question, clarity, and vocabulary.
    2. Provide a score from 0 to 10.
    3. Write constructive and encouraging feedback suitable for the student's level.
    4. Return ONLY a single JSON object in a markdown code block.
    
    **JSON Output Format:**
    {
      "evaluation": {
        "score": 8,
        "feedback": "Great job! You answered the question clearly. Try using more descriptive adjectives next time to make your writing even better. For example, instead of 'nice holiday,' you could say 'relaxing and joyful holiday.'"
      }
    }
  `;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const jsonResponse = extractJson(result.response.text());

  if (!jsonResponse) {
    throw new Error('Failed to get a valid evaluation from AI.');
  }
  return jsonResponse;
};
