const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { saveReport, getReport } = require('../controllers/webcamController');

// Save behavioral analysis report
router.route('/save-report')
  .post(protect, saveReport);

// Get behavioral report for an interview
router.route('/report/:interviewId')
  .get(protect, getReport);

module.exports = router;
