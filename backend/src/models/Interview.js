const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    jobRole: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String],
      required: true,
    },
    questions: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['ongoing', 'completed'],
      default: 'ongoing',
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    strongestArea: {
      type: String,
    },
    weakestArea: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
