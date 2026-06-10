const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Interview',
    },
    question: {
      type: String,
      required: true,
    },
    userAnswer: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    userNotes: {
      type: String,
      default: '',
    },
    transcript: {
      type: String,
    },
    audioUrl: {
      type: String,
    },
    technicalScore: {
      type: Number,
    },
    communicationScore: {
      type: Number,
    },
    clarityScore: {
      type: Number,
    },
    confidenceScore: {
      type: Number,
    },
    fillerWordCount: {
      type: Number,
    },
    speakingTime: {
      type: Number, // in seconds
    },
    wordsPerMinute: {
      type: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
