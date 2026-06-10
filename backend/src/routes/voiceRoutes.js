const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const { transcribe, evaluateVoiceAnswer } = require('../controllers/voiceController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Setup Multer for audio uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename(req, file, cb) {
    cb(null, `audio-${Date.now()}${path.extname(file.originalname || '.webm')}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25000000 }, // 25MB limit (Groq Whisper limit)
});

router.route('/transcribe')
  .post(protect, upload.single('audio'), transcribe);

router.route('/evaluate')
  .post(
    protect,
    [
      body('interviewId', 'Interview ID is required').not().isEmpty(),
      body('question', 'Question is required').not().isEmpty(),
      body('transcript', 'Transcript is required').not().isEmpty(),
    ],
    validate,
    evaluateVoiceAnswer
  );

module.exports = router;
