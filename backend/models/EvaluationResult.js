// models/EvaluationResult.js
const mongoose = require("mongoose");

const evaluationResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  module: { type: String, enum: ["comprehension", "composition"], required: true },
  step: { type: String, required: true },       // e.g., essays, vocabulary
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
  sequence: { type: Number, required: true },   // which exercise number
  answer: { type: String, required: true },     // user’s submitted text

  rubric: {
    grammar: { type: Number, default: 0 },
    vocabulary: { type: Number, default: 0 },
    structure: { type: Number, default: 0 },
    creativity: { type: Number, default: 0 },
    feedback: { type: String }
  },

  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  pointsAwarded: { type: Number, required: true },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EvaluationResult", evaluationResultSchema);
