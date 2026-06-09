const Interview = require('../models/Interview');

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

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById,
  deleteInterview,
};
