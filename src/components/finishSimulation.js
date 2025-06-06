/**
 * Calculate final results for a simulation
 * @param {Array} questions - All questions in the simulation
 * @param {Object} userAnswers - User answers keyed by question index
 * @param {Object} correctAnswersData - Correct answers data keyed by chapter and question number
 * @param {Object} allChaptersData - Object containing all chapters data
 * @returns {Object} Results object with correctCount, resultsByChapter, and allAnswers
 */
export const calculateSimulationResults = (questions, userAnswers, correctAnswersData, allChaptersData) => {
  let correctCount = 0;
  let resultsByChapter = {};
  let allAnswers = [];
  
  // Initialize results for each chapter
  Object.keys(allChaptersData).forEach(chapter => {
    resultsByChapter[chapter] = { total: 0, correct: 0 };
  });
  
  // Evaluate each question
  questions.forEach((question, index) => {
    const questionNumber = question.numar;
    const chapter = question.chapter;
    const correctAnswer = correctAnswersData[chapter][questionNumber] || "";
    const userAnswer = userAnswers[index]?.join('') || "";
    
    // Update totals for this chapter
    resultsByChapter[chapter].total += 1;
    
    // Check if answer is correct
    if (userAnswer === correctAnswer) {
      correctCount++;
      resultsByChapter[chapter].correct += 1;
    }
    
    // Track all answers (both correct and incorrect)
    allAnswers.push({
      questionNumber,
      chapter,
      question: question.intrebare,
      userAnswer,
      correctAnswer,
      options: question.optiuni,
      isCorrect: userAnswer === correctAnswer
    });
  });
  
  return {
    correctCount,
    resultsByChapter,
    wrongAnswers: allAnswers // Keep wrongAnswers name for backward compatibility
  };
};

/**
 * Format time in seconds to HH:MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    remainingSeconds.toString().padStart(2, '0')
  ].join(':');
}; 