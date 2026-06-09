const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadAndAnalyze } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// Configure multer to store files in memory as buffers
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/analyze', protect, upload.single('resume'), uploadAndAnalyze);

module.exports = router;
