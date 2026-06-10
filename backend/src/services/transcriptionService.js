const Groq = require('groq-sdk');
const fs = require('fs');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Transcribes an audio file using Groq's whisper-large-v3 model.
 * @param {string} filePath - Absolute path to the audio file.
 * @returns {Promise<string>} The transcribed text.
 */
const transcribeAudio = async (filePath) => {
  try {
    const fileStream = fs.createReadStream(filePath);
    
    const transcription = await groq.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-large-v3',
      prompt: 'Umm, let me think... Hmm, okay. Uh, interview candidate answering a technical question with filler words like um and hmm.',
      response_format: 'json',
      language: 'en',
      temperature: 0.0
    });

    return transcription.text;
  } catch (error) {
    console.error('Groq Whisper Transcription Error:', error);
    throw new Error('Failed to transcribe audio file');
  }
};

module.exports = {
  transcribeAudio,
};
