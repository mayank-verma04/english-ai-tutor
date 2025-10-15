// models/Progress.js
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    module: { type: String, required: true }, // e.g., Comprehension, Composition
    level: { type: String, required: true },  // e.g., Beginner, Intermediate, Advanced
    step: { type: String, required: true },   // e.g., vocabulary, sentences, passage
    lastSeenSequence: { type: Number, default: 0 }, // track last learned sequence number
});

module.exports = mongoose.model("Progress", progressSchema);
