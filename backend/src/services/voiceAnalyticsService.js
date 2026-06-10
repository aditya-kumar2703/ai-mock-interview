/**
 * Analyzes a transcript to detect filler words and calculate speaking pace.
 * @param {string} transcript - The transcribed text.
 * @param {number} durationSeconds - The total audio duration in seconds.
 * @returns {Object} Voice analytics metrics.
 */
const analyzeSpeech = (transcript, durationSeconds) => {
  const fillerWordsList = ['um', 'uh', 'hmm', 'like', 'you know', 'actually', 'basically', 'sort of', 'kind of'];
  
  const text = transcript.toLowerCase();
  const words = text.match(/\b(\w+)\b/g) || [];
  const wordCount = words.length;
  
  // Calculate WPM
  const minutes = durationSeconds / 60;
  const wordsPerMinute = minutes > 0 ? Math.round(wordCount / minutes) : 0;
  
  // Sentence parsing for average length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const averageSentenceLength = sentences.length > 0 ? Math.round(wordCount / sentences.length) : wordCount;

  // Detect Filler Words
  let totalFillerCount = 0;
  const detectedWordsMap = {};

  fillerWordsList.forEach(filler => {
    // Escape regex for phrases like "you know"
    const regex = new RegExp(`\\b${filler}\\b`, 'g');
    const matches = text.match(regex);
    if (matches) {
      totalFillerCount += matches.length;
      detectedWordsMap[filler] = matches.length;
    }
  });

  const detectedWords = Object.keys(detectedWordsMap).map(word => ({
    word,
    count: detectedWordsMap[word]
  })).sort((a, b) => b.count - a.count); // sort descending

  return {
    wordCount,
    wordsPerMinute,
    averageSentenceLength,
    fillerWordCount: totalFillerCount,
    detectedWords
  };
};

module.exports = {
  analyzeSpeech,
};
