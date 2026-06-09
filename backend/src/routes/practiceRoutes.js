const express = require('express');
const router = express.Router();
const { getPracticePlan, toggleGoal, generateNewPlan } = require('../controllers/practiceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/plan', protect, getPracticePlan);
router.patch('/goals/:goalId', protect, toggleGoal);
router.post('/generate', protect, generateNewPlan);

module.exports = router;
