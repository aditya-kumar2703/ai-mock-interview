const express = require('express');
const { body } = require('express-validator');
const { generateQuestionsAndCreateInterview } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/generate-questions')
  .post(
    protect,
    [
      body('jobRole', 'Job role is required').not().isEmpty(),
      body('experienceLevel', 'Experience level is required').not().isEmpty(),
      body('techStack', 'Tech stack must be an array').isArray({ min: 1 }),
    ],
    validate,
    generateQuestionsAndCreateInterview
  );

module.exports = router;
