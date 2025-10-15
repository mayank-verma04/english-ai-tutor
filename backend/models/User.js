// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  points: { type: Number, default: 0 },
  streak: {
    count: { type: Number, default: 0 },
    lastActive: { type: Date, default: null }
  }
}, {
    timestamps: true
  });

module.exports = mongoose.model("User", userSchema);
