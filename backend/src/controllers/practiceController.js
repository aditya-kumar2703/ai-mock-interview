const PracticePlan = require('../models/PracticePlan');
const Resume = require('../models/Resume');
const { generatePracticePlan } = require('../services/aiService');

// @desc    Get or generate the practice plan for the user
// @route   GET /api/practice/plan
// @access  Private
const getPracticePlan = async (req, res, next) => {
  try {
    // Check if the user already has a plan
    let plan = await PracticePlan.findOne({ userId: req.user._id });

    if (!plan) {
      // If no plan exists, fetch their latest resume to get their skills
      const latestResume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
      const skills = latestResume ? latestResume.skills : [];

      // Generate a new plan via AI
      const aiPlan = await generatePracticePlan(skills);

      // Save the new plan to the database
      plan = await PracticePlan.create({
        userId: req.user._id,
        weeks: aiPlan.weeks,
        dailyGoals: aiPlan.dailyGoals,
      });
    }

    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle a daily goal's completed status
// @route   PATCH /api/practice/goals/:goalId
// @access  Private
const toggleGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const { completed } = req.body;

    const plan = await PracticePlan.findOneAndUpdate(
      { userId: req.user._id, 'dailyGoals._id': goalId },
      { $set: { 'dailyGoals.$.completed': completed } },
      { new: true }
    );

    if (!plan) {
      res.status(404);
      throw new Error('Goal not found in your practice plan');
    }

    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
};

// @desc    Generate a completely new practice plan with custom preferences
// @route   POST /api/practice/generate
// @access  Private
const generateNewPlan = async (req, res, next) => {
  try {
    const { targetRole, targetCompany, pace } = req.body;
    
    // Fetch latest resume to get skills
    const latestResume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    const skills = latestResume ? latestResume.skills : [];

    // Generate new plan via AI with preferences
    const aiPlan = await generatePracticePlan(skills, { targetRole, targetCompany, pace });

    // Update existing or create new
    const plan = await PracticePlan.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $set: {
          weeks: aiPlan.weeks,
          dailyGoals: aiPlan.dailyGoals,
        }
      },
      { new: true, upsert: true }
    );

    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPracticePlan,
  toggleGoal,
  generateNewPlan,
};
