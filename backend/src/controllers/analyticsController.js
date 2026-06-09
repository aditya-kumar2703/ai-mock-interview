const Interview = require('../models/Interview');
const Session = require('../models/Session');
const Resume = require('../models/Resume');

// @desc    Get aggregated analytics data for the user
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Fetch all interviews for the user, sorted newest first
    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });

    const history = [];
    const performanceMap = new Map(); // For grouping scores by Month
    let totalSessions = 0;

    for (const interview of interviews) {
      // Fetch all sessions for this interview to calculate average score
      const sessions = await Session.find({ interviewId: interview._id });
      totalSessions += sessions.length;
      
      let interviewAvg = 0;
      if (sessions.length > 0) {
        const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);
        interviewAvg = Math.round(totalScore / sessions.length);
      } else {
        interviewAvg = 0; // Or skip if we don't want empty interviews
      }

      // Format date
      const dateStr = interview.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      history.push({
        id: interview._id,
        date: dateStr,
        role: interview.jobRole,
        type: interview.techStack.join(', ').length > 0 ? interview.techStack[0] : 'General',
        score: interviewAvg,
        duration: sessions.length > 0 ? `${sessions.length * 5}m` : '0m'
      });

      // For performance chart: Group by Month (e.g. "Oct")
      if (interviewAvg >= 0) {
        const monthStr = interview.createdAt.toLocaleDateString('en-US', { month: 'short' });
        if (!performanceMap.has(monthStr)) {
          performanceMap.set(monthStr, { total: 0, count: 0 });
        }
        const mData = performanceMap.get(monthStr);
        mData.total += interviewAvg;
        mData.count += 1;
      }
    }

    // 2. Build Performance Chart Data (Chronological)
    const performanceData = {
      labels: [],
      scores: []
    };
    
    // Reverse the map to chronological order (since we processed newest first)
    const reversedMonths = Array.from(performanceMap.entries()).reverse();
    for (const [month, data] of reversedMonths) {
      performanceData.labels.push(month);
      performanceData.scores.push(Math.round(data.total / data.count));
    }

    // 3. Skills Data (Radar)
    // We'll base this off the Resume analysis if available, otherwise fallback
    const latestResume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
    let baseScore = latestResume ? latestResume.score : 50;
    
    // If we have interview history, blend the base score with the recent average
    if (history.length > 0 && history[0].score > 0) {
      baseScore = Math.round((baseScore + history[0].score) / 2);
    }

    // Mock realistic distributions around the base score
    const skillData = [
      Math.min(100, baseScore + Math.floor(Math.random() * 10 - 5)), // Communication
      Math.min(100, baseScore + Math.floor(Math.random() * 10 - 5)), // Technical
      Math.min(100, baseScore + Math.floor(Math.random() * 15 - 5)), // Problem Solving
      Math.min(100, baseScore + Math.floor(Math.random() * 20 - 10)), // System Design
      Math.min(100, baseScore + Math.floor(Math.random() * 10 - 5))  // Behavioral
    ];

    res.status(200).json({
      history,
      performance: performanceData,
      skills: skillData,
      totalSessions
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};
