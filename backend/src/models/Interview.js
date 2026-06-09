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
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
