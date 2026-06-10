const Interview = require('../models/Interview');
const Session = require('../models/Session');
const InterviewBehavior = require('../models/InterviewBehavior');

// @desc    Get all completed interviews for history page
// @route   GET /api/replay/history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ 
      userId: req.user._id,
      status: 'completed'
    }).sort({ createdAt: -1 });

    res.json(interviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Get complete replay timeline (Interview + Sessions + Behaviors)
// @route   GET /api/replay/:id
// @access  Private
const getReplayTimeline = async (req, res, next) => {
  try {
    const interviewId = req.params.id;

    const interview = await Interview.findById(interviewId);
    if (!interview || interview.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Interview not found or unauthorized');
    }

    // Get sessions sorted by time
    const sessions = await Session.find({ interviewId }).sort({ timestamp: 1 });

    // Get behavioral analysis if exists
    const behavior = await InterviewBehavior.findOne({ interviewId });

    res.json({
      interview,
      sessions,
      behavior
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get summary report for an interview
// @route   GET /api/replay/:id/summary
// @access  Private
const getReplaySummary = async (req, res, next) => {
  try {
    const interviewId = req.params.id;

    const interview = await Interview.findById(interviewId);
    if (!interview || interview.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Interview not found or unauthorized');
    }

    const sessions = await Session.find({ interviewId });

    // Calculate dynamic stats
    const totalSpeakingTime = sessions.reduce((acc, s) => acc + (s.speakingTime || 0), 0);
    const totalFillerWords = sessions.reduce((acc, s) => acc + (s.fillerWordCount || 0), 0);
    const averageAnswerLength = totalSpeakingTime / (sessions.length || 1);

    // Extract all suggestions to find top ones
    let allSuggestions = [];
    sessions.forEach(s => {
      if (s.suggestions && s.suggestions.length > 0) {
        allSuggestions.push(...s.suggestions);
      }
    });

    const topImprovementSuggestion = allSuggestions.length > 0 
      ? allSuggestions[0] 
      : "Provide more structured answers.";

    res.json({
      overallScore: interview.overallScore,
      strongestArea: interview.strongestArea,
      weakestArea: interview.weakestArea,
      totalQuestions: interview.totalQuestions,
      averageAnswerLength: Math.round(averageAnswerLength),
      topImprovementSuggestion,
      totalSpeakingTime,
      totalFillerWords,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save user note for a specific session/question
// @route   POST /api/replay/sessions/:sessionId/notes
// @access  Private
const updateSessionNote = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { note } = req.body;

    const session = await Session.findById(sessionId).populate('interviewId');
    if (!session || session.interviewId.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Session not found or unauthorized');
    }

    session.userNotes = note;
    await session.save();

    res.json({ message: 'Note saved successfully', session });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistory,
  getReplayTimeline,
  getReplaySummary,
  updateSessionNote
};
