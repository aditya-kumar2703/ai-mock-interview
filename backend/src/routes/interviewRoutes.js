const express = require('express');
const { body } = require('express-validator');
const { createInterview, getInterviews, getInterviewById, deleteInterview } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getInterviews);

router.route('/create')
  .post(
    protect,
    [
      body('jobRole', 'Job role is required').not().isEmpty(),
      body('experienceLevel', 'Experience level is required').not().isEmpty(),
      body('techStack', 'Tech stack must be an array').isArray(),
    ],
    validate,
    createInterview
  );

router.route('/:id')
  .get(protect, getInterviewById)
  .delete(protect, deleteInterview);

module.exports = router;
