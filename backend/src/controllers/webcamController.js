const InterviewBehavior = require('../models/InterviewBehavior');
const Interview = require('../models/Interview');
const { processMetrics } = require('../services/behaviorAnalysisService');

// @desc    Save behavioral analysis report after interview
// @route   POST /api/webcam/save-report
// @access  Private
const saveReport = async (req, res, next) => {
  try {
    const { interviewId, metrics } = req.body;

    if (!interviewId || !metrics) {
      res.status(400);
      throw new Error('interviewId and metrics are required');
    }

    // Verify interview ownership
    const interview = await Interview.findById(interviewId);
    if (!interview || interview.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Interview not found or unauthorized');
    }

    // Process raw metrics into report
    const report = processMetrics(metrics);

    // Upsert — update if already exists (e.g., retake)
    const behaviorDoc = await InterviewBehavior.findOneAndUpdate(
      { interviewId },
      {
        interviewId,
        userId: req.user._id,
        ...report,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(behaviorDoc);
  } catch (error) {
    next(error);
  }
};

// @desc    Get behavioral analysis report for an interview
// @route   GET /api/webcam/report/:interviewId
// @access  Private
const getReport = async (req, res, next) => {
  try {
    const { interviewId } = req.params;

    const report = await InterviewBehavior.findOne({
      interviewId,
      userId: req.user._id,
    });

    if (!report) {
      // Not an error — just means webcam wasn't used for this interview
      return res.status(200).json(null);
    }

    res.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveReport,
  getReport,
};
