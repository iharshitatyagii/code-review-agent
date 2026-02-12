const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  repoName: { type: String, required: true }, // e.g., "facebook/react"
  prLink: { type: String, required: true },
  summary: { type: String, required: true },
  rating: { type: Number, required: true },
  issues: [
    {
      line: Number,
      type: String, // "Critical", "Style", etc.
      message: String,
      suggestion: String
    }
  ],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);