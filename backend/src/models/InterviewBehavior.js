const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true }, // seconds since interview start
  confidenceScore: { type: Number, default: 0 },
  eyeContactScore: { type: Number, default: 0 },
  engagementScore: { type: Number, default: 0 },
  bodyLanguageScore: { type: Number, default: 0 },
}, { _id: false });

const interviewBehaviorSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Interview',
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    // Aggregate scores (0-100)
    confidenceScore: { type: Number, default: 0 },
    eyeContactScore: { type: Number, default: 0 },
    bodyLanguageScore: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    smileScore: { type: Number, default: 0 },

    // Detailed metrics
    screenFocusPercentage: { type: Number, default: 0 },
    lookingAwayPercentage: { type: Number, default: 0 },
    longestDistractionSeconds: { type: Number, default: 0 },
    smileFrequency: { type: Number, default: 0 },
    averageSmileDuration: { type: Number, default: 0 },

    // Feedback strings
    eyeContactFeedback: { type: String, default: '' },
    confidenceFeedback: { type: String, default: '' },
    bodyLanguageFeedback: { type: String, default: '' },
    engagementFeedback: { type: String, default: '' },

    // Improvement suggestions
    suggestions: [{ type: String }],

    // Time-series snapshots (every 5 seconds)
    snapshots: [snapshotSchema],
  },
  {
    timestamps: true,
  }
);

const InterviewBehavior = mongoose.model('InterviewBehavior', interviewBehaviorSchema);

module.exports = InterviewBehavior;
