const Interview = require('../models/Interview');
const Session = require('../models/Session');

// @desc    Create new interview
// @route   POST /api/interviews/create
// @access  Private
const createInterview = async (req, res, next) => {
  try {
    const { jobRole, experienceLevel, techStack } = req.body;

    // TODO: In a real app, you would call an AI service here to generate customized questions based on the role and tech stack
    const mockQuestions = [
      `Can you explain your experience with ${techStack[0] || 'this stack'}?`,
      `How would you handle a difficult situation as a ${jobRole}?`,
      'Describe a complex problem you solved recently.',
    ];

    const interview = await Interview.create({
      userId: req.user._id,
      jobRole,
      experienceLevel,
      techStack,
      questions: mockQuestions,
    });

    res.status(201).json(interview);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all interviews for logged in user
// @route   GET /api/interviews
// @access  Private
const getInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(interviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Get interview by ID
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (interview && interview.userId.toString() === req.user._id.toString()) {
      res.json(interview);
    } else {
      res.status(404);
      throw new Error('Interview not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete interview
// @route   DELETE /api/interviews/:id
// @access  Private
const deleteInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (interview && interview.userId.toString() === req.user._id.toString()) {
      await Interview.deleteOne({ _id: interview._id });
      res.json({ message: 'Interview removed' });
    } else {
      res.status(404);
      throw new Error('Interview not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Finish interview and aggregate stats
// @route   POST /api/interviews/:id/finish
// @access  Private
const finishInterview = async (req, res, next) => {
  try {
    const { duration } = req.body; // duration in seconds
    const interview = await Interview.findById(req.params.id);

    if (!interview || interview.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Interview not found or unauthorized');
    }

    const sessions = await Session.find({ interviewId: interview._id });
    const totalQuestions = sessions.length;
    let overallScore = 0;
    
    let areas = {
      technical: 0,
      communication: 0,
      clarity: 0,
      confidence: 0
    };

    if (totalQuestions > 0) {
      overallScore = Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / totalQuestions);
      
      areas.technical = sessions.reduce((acc, s) => acc + (s.technicalScore || 0), 0) / totalQuestions;
      areas.communication = sessions.reduce((acc, s) => acc + (s.communicationScore || 0), 0) / totalQuestions;
      areas.clarity = sessions.reduce((acc, s) => acc + (s.clarityScore || 0), 0) / totalQuestions;
      areas.confidence = sessions.reduce((acc, s) => acc + (s.confidenceScore || 0), 0) / totalQuestions;
    }

    // Determine strongest and weakest
    const entries = Object.entries(areas);
    entries.sort((a, b) => a[1] - b[1]);
    
    const weakestArea = entries[0][0];
    const strongestArea = entries[entries.length - 1][0];

    interview.status = 'completed';
    interview.overallScore = overallScore;
    interview.duration = duration || 0;
    interview.totalQuestions = totalQuestions;
    
    if (totalQuestions > 0) {
      interview.weakestArea = weakestArea.charAt(0).toUpperCase() + weakestArea.slice(1);
      interview.strongestArea = strongestArea.charAt(0).toUpperCase() + strongestArea.slice(1);
    }

    await interview.save();
    res.json(interview);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById,
  deleteInterview,
  finishInterview,
};
