const express = require('express');
const {
  getHistory,
  getReplayTimeline,
  getReplaySummary,
  updateSessionNote,
} = require('../controllers/replayController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/history', protect, getHistory);
router.get('/:id', protect, getReplayTimeline);
router.get('/:id/summary', protect, getReplaySummary);
router.post('/sessions/:sessionId/notes', protect, updateSessionNote);

module.exports = router;
