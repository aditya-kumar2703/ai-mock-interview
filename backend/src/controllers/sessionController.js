const Session = require('../models/Session');
const Interview = require('../models/Interview');
const { evaluateAnswer } = require('../services/aiService');

// @desc    Submit an answer for a question
// @route   POST /api/sessions/answer
// @access  Private
const submitAnswer = async (req, res, next) => {
  try {
    const { interviewId, question, userAnswer } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview || interview.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Interview not found or unauthorized');
    }

    // Call Gemini to evaluate the answer
    const evaluation = await evaluateAnswer(
      interview.jobRole,
      interview.experienceLevel,
      question,
      userAnswer
    );

    const session = await Session.create({
      interviewId,
      question,
      userAnswer,
      feedback: evaluation.feedback,
      score: evaluation.score,
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all session answers/feedback for an interview
// @route   GET /api/sessions/:interviewId
// @access  Private
const getSessionData = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.interviewId);

    if (!interview || interview.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Interview not found or unauthorized');
    }

    const sessions = await Session.find({ interviewId: req.params.interviewId }).sort({ timestamp: 1 });
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAnswer,
  getSessionData,
};
