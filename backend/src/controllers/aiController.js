const { generateInterviewQuestions } = require('../services/aiService');
const Interview = require('../models/Interview');

// @desc    Generate AI interview questions and create interview
// @route   POST /api/ai/generate-questions
// @access  Private
const generateQuestionsAndCreateInterview = async (req, res, next) => {
  try {
    const { jobRole, experienceLevel, techStack } = req.body;

    // 1. Generate questions using Gemini Service
    const aiResponse = await generateInterviewQuestions(jobRole, experienceLevel, techStack);
    
    // Convert the array of objects [{question: "..."}] into an array of strings to match the Mongoose schema
    const stringQuestions = aiResponse.map(q => q.question);

    // 2. Save the generated questions in the Interview collection
    const interview = await Interview.create({
      userId: req.user._id,
      jobRole,
      experienceLevel,
      techStack,
      questions: stringQuestions,
    });

    // 3. Return the response in the exact format requested
    res.status(201).json({
      interviewId: interview._id,
      jobRole: interview.jobRole,
      experienceLevel: interview.experienceLevel,
      techStack: interview.techStack,
      questions: aiResponse // Return the [{ question: "..." }] JSON format
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQuestionsAndCreateInterview,
};
