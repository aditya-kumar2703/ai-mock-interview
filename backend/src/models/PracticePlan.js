const mongoose = require('mongoose');

const weekSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['completed', 'active', 'locked'], default: 'locked' },
  modules: [{ type: String }]
});

const dailyGoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  time: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const practicePlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weeks: {
    type: [weekSchema],
    default: [],
  },
  dailyGoals: {
    type: [dailyGoalSchema],
    default: [],
  }
}, {
  timestamps: true,
});

const PracticePlan = mongoose.model('PracticePlan', practicePlanSchema);

module.exports = PracticePlan;
