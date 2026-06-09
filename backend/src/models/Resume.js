const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'warning', 'danger'],
    required: true,
  }
});

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalFileName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  feedback: {
    type: [feedbackSchema],
    default: [],
  },
}, {
  timestamps: true,
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
