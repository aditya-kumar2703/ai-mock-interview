/**
 * Behavior Analysis Service
 * 
 * Takes raw client-side MediaPipe metrics and computes aggregate scores,
 * generates natural-language feedback, and improvement suggestions.
 */

/**
 * Generates feedback text based on a score.
 */
const getFeedbackForScore = (category, score) => {
  const feedbackMap = {
    eyeContact: {
      high: 'Excellent! You maintained strong, consistent eye contact throughout the interview, projecting confidence and engagement.',
      medium: 'You maintained eye contact for most of the interview, but there were occasional moments of looking away. Try to keep your gaze focused on the camera.',
      low: 'You frequently looked away from the screen, which can signal discomfort or lack of preparation. Practice maintaining steady eye contact with the camera lens.',
    },
    confidence: {
      high: 'Your facial posture remained stable and engaged. You appeared calm, composed, and authoritative throughout.',
      medium: 'You appeared slightly distracted or uncertain at times. Try to keep your head steady and maintain a composed expression.',
      low: 'You frequently looked away and appeared uncertain. Work on maintaining a stable head position and relaxed facial expression to project more confidence.',
    },
    bodyLanguage: {
      high: 'Excellent posture! You maintained an upright, professional position throughout the interview, conveying strong presence.',
      medium: 'Your posture was generally acceptable, but you slouched or shifted at times. Maintain an upright posture for a stronger professional presence.',
      low: 'Your posture needs significant improvement. You frequently slouched, tilted, or shifted excessively. Practice sitting upright with squared shoulders.',
    },
    engagement: {
      high: 'You appeared highly attentive and responsive throughout the interview, showing genuine interest and active listening.',
      medium: 'You showed moderate engagement. Try to appear more attentive by maintaining eye contact and natural facial expressions.',
      low: 'Your engagement appeared low. You seemed distracted or disinterested at times. Practice active listening cues and maintain focus on the interviewer.',
    },
  };

  const level = score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low';
  return feedbackMap[category]?.[level] || '';
};

/**
 * Generate improvement suggestions based on scores.
 */
const generateSuggestions = (metrics) => {
  const suggestions = [];

  if (metrics.eyeContactScore < 80) {
    suggestions.push('Practice looking directly at the camera lens instead of the screen to simulate natural eye contact.');
  }
  if (metrics.lookingAwayPercentage > 25) {
    suggestions.push('Reduce the time spent looking away from the screen. Keep your attention focused during responses.');
  }
  if (metrics.longestDistractionSeconds > 5) {
    suggestions.push(`Your longest distraction was ${Math.round(metrics.longestDistractionSeconds)} seconds. Try to avoid sustained periods of looking away.`);
  }
  if (metrics.bodyLanguageScore < 75) {
    suggestions.push('Improve your posture by sitting upright with your shoulders squared and head level.');
  }
  if (metrics.confidenceScore < 70) {
    suggestions.push('Work on maintaining a stable head position and calm facial expression to project more confidence.');
  }
  if (metrics.smileScore < 50) {
    suggestions.push('A natural smile at appropriate moments helps build rapport. Practice smiling genuinely during introductions and when discussing achievements.');
  }
  if (metrics.smileScore > 90) {
    suggestions.push('While smiling is positive, excessive smiling can appear nervous. Aim for natural, contextually appropriate expressions.');
  }
  if (metrics.engagementScore < 70) {
    suggestions.push('Show more engagement through active listening cues: occasional nods, attentive expressions, and consistent focus.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Great overall performance! Continue maintaining your strong non-verbal communication skills.');
  }

  return suggestions;
};

/**
 * Process raw metrics from the client and produce a complete behavioral report.
 * 
 * @param {Object} rawMetrics - Raw metrics from the frontend MediaPipe analysis
 * @returns {Object} Processed report ready for database storage
 */
const processMetrics = (rawMetrics) => {
  const {
    eyeContactScore = 0,
    confidenceScore = 0,
    bodyLanguageScore = 0,
    engagementScore = 0,
    smileScore = 0,
    screenFocusPercentage = 0,
    lookingAwayPercentage = 0,
    longestDistractionSeconds = 0,
    smileFrequency = 0,
    averageSmileDuration = 0,
    snapshots = [],
  } = rawMetrics;

  // Clamp all scores to 0-100
  const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));

  const report = {
    eyeContactScore: clamp(eyeContactScore),
    confidenceScore: clamp(confidenceScore),
    bodyLanguageScore: clamp(bodyLanguageScore),
    engagementScore: clamp(engagementScore),
    smileScore: clamp(smileScore),

    screenFocusPercentage: clamp(screenFocusPercentage),
    lookingAwayPercentage: clamp(lookingAwayPercentage),
    longestDistractionSeconds: Math.max(0, longestDistractionSeconds),
    smileFrequency: Math.max(0, smileFrequency),
    averageSmileDuration: Math.max(0, averageSmileDuration),

    eyeContactFeedback: getFeedbackForScore('eyeContact', eyeContactScore),
    confidenceFeedback: getFeedbackForScore('confidence', confidenceScore),
    bodyLanguageFeedback: getFeedbackForScore('bodyLanguage', bodyLanguageScore),
    engagementFeedback: getFeedbackForScore('engagement', engagementScore),

    snapshots: snapshots.map(s => ({
      timestamp: s.timestamp,
      confidenceScore: clamp(s.confidenceScore || 0),
      eyeContactScore: clamp(s.eyeContactScore || 0),
      engagementScore: clamp(s.engagementScore || 0),
      bodyLanguageScore: clamp(s.bodyLanguageScore || 0),
    })),
  };

  report.suggestions = generateSuggestions(report);

  return report;
};

module.exports = {
  processMetrics,
};
