const Groq = require('groq-sdk');

// Initialize the Groq API client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateInterviewQuestions = async (jobRole, experienceLevel, techStack) => {
  try {
    const prompt = `
      You are an expert technical interviewer.
      Generate 5 highly relevant and completely unique interview questions for a candidate applying for the following position:
      - Job Role: ${jobRole}
      - Experience Level: ${experienceLevel}
      - Tech Stack: ${techStack.join(', ')}
      - Randomization Seed: ${Math.random().toString(36).substring(7)} // Ensure questions are completely different from previous sessions.

      Do not ask generic textbook questions. Focus on practical scenarios and deep conceptual understanding.

      Return the questions STRICTLY in the following JSON array format without any markdown wrappers or additional text:
      [
        { "question": "Question text here..." }
      ]
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an API that only returns valid JSON arrays."
        },
        {
          role: "user",
          content: prompt,
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    // Handle Groq's json_object format which requires an object wrapper
    // Since we requested an array in our prompt, we must parse the output carefully
    const content = chatCompletion.choices[0]?.message?.content || "[]";
    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(content);
      // Llama3 might wrap it in a root key if json_object is used
      if (!Array.isArray(parsedQuestions) && typeof parsedQuestions === 'object') {
         const keys = Object.keys(parsedQuestions);
         if (keys.length > 0 && Array.isArray(parsedQuestions[keys[0]])) {
           parsedQuestions = parsedQuestions[keys[0]];
         }
      }
    } catch (e) {
      console.error("Failed to parse JSON array from Groq:", content);
      throw e;
    }
    
    return parsedQuestions;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to generate interview questions with AI');
  }
};

const evaluateAnswer = async (jobRole, experienceLevel, question, userAnswer) => {
  try {
    const prompt = `
      You are an expert technical interviewer evaluating a candidate's answer.
      - Job Role: ${jobRole}
      - Experience Level: ${experienceLevel}
      - Question Asked: "${question}"
      - Candidate's Answer: "${userAnswer}"

      Evaluate the candidate's answer. Provide a score from 0 to 100 based on technical accuracy, clarity, and completeness.
      Provide brief, constructive feedback on what they did well and what they missed.
      Also provide 1-3 concise points for their strengths, weaknesses, and suggestions for improvement.

      Return STRICTLY in the following JSON format:
      {
        "score": 85,
        "feedback": "Your detailed critique here...",
        "strengths": ["Clear explanation of concept"],
        "weaknesses": ["Missed edge cases"],
        "suggestions": ["Include examples in future answers"]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an API that only returns valid JSON objects."
        },
        {
          role: "user",
          content: prompt,
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error('Groq API Evaluation Error:', error);
    throw new Error('Failed to evaluate answer with AI');
  }
};

const evaluateSpokenAnswer = async (jobRole, experienceLevel, question, transcript) => {
  try {
    const prompt = `
      You are an expert technical interviewer evaluating a candidate's spoken answer to an interview question.
      The answer was transcribed via Speech-to-Text, so it may contain filler words or slight misinterpretations. Look past minor transcription errors to evaluate the core content.

      - Job Role: ${jobRole}
      - Experience Level: ${experienceLevel}
      - Question Asked: "${question}"
      - Candidate's Spoken Transcript: "${transcript}"

      Evaluate the candidate's spoken answer. Provide the following scores (0 to 100):
      - technicalScore: Accuracy, completeness, and depth of technical knowledge.
      - communicationScore: Structure, flow, and effectiveness of conveying the point.
      - clarityScore: Conciseness, directness, and lack of rambling (heavily penalize excessive filler words like 'um', 'uh', 'like').
      - confidenceScore: Perceived authority and decisiveness in the language used (penalize hesitation and filler words).
      - overallScore: A weighted average or holistic grade.

      Also provide brief, constructive feedback on what they did well and what they missed, focusing on both technical content and communication style.
      Also provide 1-3 concise points for their strengths, weaknesses, and suggestions for improvement.

      Return STRICTLY in the following JSON format:
      {
        "technicalScore": 85,
        "communicationScore": 82,
        "clarityScore": 90,
        "confidenceScore": 78,
        "overallScore": 84,
        "feedback": "Your detailed critique here...",
        "strengths": ["Confident tone"],
        "weaknesses": ["Filler words used"],
        "suggestions": ["Pause instead of saying um"]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an API that only returns valid JSON objects."
        },
        {
          role: "user",
          content: prompt,
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error('Groq API Spoken Evaluation Error:', error);
    throw new Error('Failed to evaluate spoken answer with AI');
  }
};

const analyzeResume = async (resumeText) => {
  try {
    const prompt = `
      You are an expert technical recruiter and ATS (Applicant Tracking System) optimizer.
      Analyze the following raw text extracted from a candidate's resume.

      Resume Text:
      "${resumeText}"

      Tasks:
      1. Extract a list of the candidate's core technical skills (max 15 skills).
      2. Provide an overall resume score from 0 to 100 based on impact, clarity, and ATS readability.
      3. Provide a list of 4-6 specific, actionable feedback points. For each point:
         - Provide a short "category" (e.g., "Impact", "Formatting", "Keywords").
         - Provide a "comment" explaining the issue or praise.
         - Assign a "status" of either "success" (for praise), "warning" (for minor issues), or "danger" (for critical errors).

      Return STRICTLY in the following JSON format:
      {
        "score": 82,
        "skills": ["JavaScript", "React", "Node.js"],
        "feedback": [
          {
            "category": "Impact",
            "comment": "Good use of action verbs, but missing quantifiable metrics (e.g., 'increased performance by 20%').",
            "status": "warning"
          }
        ]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an API that only returns valid JSON objects."
        },
        {
          role: "user",
          content: prompt,
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error('Groq Resume Analysis Error:', error);
    throw new Error('Failed to analyze resume with AI');
  }
};

const generatePracticePlan = async (resumeSkills = [], preferences = {}) => {
  try {
    const { targetRole = 'Software Engineer', targetCompany = 'General Tech', pace = 4 } = preferences;
    
    const prompt = `
      You are an expert technical recruiter and interview coach. 
      Generate a customized ${pace}-week interview preparation roadmap and 3 daily practice goals for a candidate.
      
      Candidate's Extracted Skills: ${resumeSkills.length > 0 ? resumeSkills.join(', ') : 'General Software Engineering'}
      Target Role: ${targetRole}
      Target Company/Industry: ${targetCompany}
      
      Tasks:
      1. Create a ${pace}-week roadmap tailored to the target role and company. For each week, provide a "title" and 3 specific technical or behavioral "modules" to study.
      2. Create 3 highly specific daily practice goals (e.g. "Complete 2 Leetcode Arrays questions"). For each, provide a "title", a short "category", and an estimated "time" (e.g., "45m").

      Return STRICTLY in the following JSON format:
      {
        "weeks": [
          { "week": 1, "title": "Fundamentals", "status": "active", "modules": ["...", "...", "..."] }
          // MUST contain exactly ${pace} objects in this array
        ],
        "dailyGoals": [
          { "title": "Complete 2 Array Questions", "category": "Data Structures", "time": "45m", "completed": false },
          { "title": "Draft STAR stories", "category": "Behavioral", "time": "30m", "completed": false },
          { "title": "Review System Design Concepts", "category": "System Design", "time": "1h", "completed": false }
        ]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an API that only returns valid JSON objects."
        },
        {
          role: "user",
          content: prompt,
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error('Groq Practice Plan Error:', error);
    throw new Error('Failed to generate practice plan with AI');
  }
};

const generateDailyGoals = async (resumeSkills = [], preferences = {}) => {
  try {
    const { targetRole = 'Software Engineer', targetCompany = 'General Tech' } = preferences;
    
    const prompt = `
      You are an expert technical recruiter and interview coach. 
      Generate 3 fresh daily practice goals for a candidate.
      
      Candidate's Extracted Skills: ${resumeSkills.length > 0 ? resumeSkills.join(', ') : 'General Software Engineering'}
      Target Role: ${targetRole}
      Target Company/Industry: ${targetCompany}
      
      Tasks:
      Create 3 highly specific daily practice goals (e.g. "Complete 2 Leetcode Arrays questions"). For each, provide a "title", a short "category", and an estimated "time" (e.g., "45m").

      Return STRICTLY in the following JSON format:
      {
        "dailyGoals": [
          { "title": "Complete 2 Array Questions", "category": "Data Structures", "time": "45m", "completed": false },
          { "title": "Draft STAR stories", "category": "Behavioral", "time": "30m", "completed": false },
          { "title": "Review System Design Concepts", "category": "System Design", "time": "1h", "completed": false }
        ]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an API that only returns valid JSON objects."
        },
        {
          role: "user",
          content: prompt,
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6, // slightly higher temperature to get varied daily goals
      response_format: { type: "json_object" }
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    return parsed.dailyGoals || [];
  } catch (error) {
    console.error('Groq Daily Goals Error:', error);
    throw new Error('Failed to generate daily goals with AI');
  }
};

module.exports = {
  generateInterviewQuestions,
  evaluateAnswer,
  evaluateSpokenAnswer,
  analyzeResume,
  generatePracticePlan,
  generateDailyGoals,
};
