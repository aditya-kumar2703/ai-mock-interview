const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const { analyzeResume } = require('../services/aiService');

// @desc    Upload and analyze a PDF resume
// @route   POST /api/resume/analyze
// @access  Private
const uploadAndAnalyze = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No resume file uploaded');
    }

    // Ensure it's a PDF
    if (req.file.mimetype !== 'application/pdf') {
      res.status(400);
      throw new Error('Only PDF files are supported');
    }

    // Extract text from the PDF buffer
    let resumeText = '';
    try {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } catch (parseError) {
      res.status(400);
      throw new Error('Failed to parse PDF file. Ensure it is a valid, text-based PDF.');
    }

    if (!resumeText || resumeText.trim().length === 0) {
      res.status(400);
      throw new Error('No readable text found in the PDF. It may be an image-based scan.');
    }

    // Send the raw text to Groq AI for analysis
    const analysis = await analyzeResume(resumeText);

    // Save the result to the database
    const resumeDoc = await Resume.create({
      userId: req.user._id,
      originalFileName: req.file.originalname,
      score: analysis.score,
      skills: analysis.skills,
      feedback: analysis.feedback,
    });

    res.status(201).json(resumeDoc);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAndAnalyze,
};
