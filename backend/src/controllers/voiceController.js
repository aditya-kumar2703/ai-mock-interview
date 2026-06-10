const fs = require('fs');
const Session = require('../models/Session');
const Interview = require('../models/Interview');
const { transcribeAudio } = require('../services/transcriptionService');
const { analyzeSpeech } = require('../services/voiceAnalyticsService');
const { evaluateSpokenAnswer } = require('../services/aiService');

// @desc    Transcribe an uploaded audio file
// @route   POST /api/voice/transcribe
// @access  Private
const transcribe = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Audio file is required');
    }

    const filePath = req.file.path;

    // Call Groq Whisper
    const transcript = await transcribeAudio(filePath);

    // Clean up temporary file
    fs.unlinkSync(filePath);

    res.status(200).json({ transcript });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Evaluate a spoken answer (using the transcript)
// @route   POST /api/voice/evaluate
// @access  Private
const evaluateVoiceAnswer = async (req, res, next) => {
  try {
    const { interviewId, question, transcript, durationSeconds } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview || interview.userId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error('Interview not found or unauthorized');
    }

    // 1. Voice Analytics (Filler words, WPM, etc)
    const analytics = analyzeSpeech(transcript, durationSeconds || 60);

    // 2. AI Evaluation of the spoken content
    const evaluation = await evaluateSpokenAnswer(
      interview.jobRole,
      interview.experienceLevel,
      question,
      transcript
    );

    // 3. Save the session
    const session = await Session.create({
      interviewId,
      question,
      userAnswer: transcript, // treat the transcript as the user answer for history
      transcript,
      feedback: evaluation.feedback,
      score: evaluation.overallScore, // the general score field
      technicalScore: evaluation.technicalScore,
      communicationScore: evaluation.communicationScore,
      clarityScore: evaluation.clarityScore,
      confidenceScore: evaluation.confidenceScore,
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || [],
      suggestions: evaluation.suggestions || [],
      fillerWordCount: analytics.fillerWordCount,
      speakingTime: durationSeconds,
      wordsPerMinute: analytics.wordsPerMinute,
    });

    // Send back the session plus the extra analytics that aren't stored natively on the session doc (like detected words array)
    res.status(201).json({
      session,
      detectedWords: analytics.detectedWords,
      averageSentenceLength: analytics.averageSentenceLength
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  transcribe,
  evaluateVoiceAnswer,
};
