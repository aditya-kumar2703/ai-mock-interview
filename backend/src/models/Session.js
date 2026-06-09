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
