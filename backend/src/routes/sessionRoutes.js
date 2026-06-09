const express = require('express');
const { body } = require('express-validator');
const { submitAnswer, getSessionData } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.route('/answer')
  .post(
    protect,
    [
      body('interviewId', 'Interview ID is required').not().isEmpty(),
      body('question', 'Question is required').not().isEmpty(),
      body('userAnswer', 'User answer is required').not().isEmpty(),
    ],
    validate,
    submitAnswer
  );

router.route('/:interviewId')
  .get(protect, getSessionData);

module.exports = router;
