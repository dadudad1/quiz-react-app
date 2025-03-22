import React, { useMemo } from 'react';
import '../styles/QuestionDisplay.css';

const QuestionDisplay = ({ 
  question, 
  selectedAnswers, 
  onAnswerSelect,
  feedback,
  correctAnswer,
  randomizeAnswers = true // Default to true for backward compatibility
}) => {
  // Process the answers based on randomizeAnswers flag
  const processedAnswers = useMemo(() => {
    if (!question || !question.variante) return [];
    
    // Convert object entries to array
    const entries = Object.entries(question.variante);
    
    if (randomizeAnswers) {
      // Fisher-Yates shuffle algorithm
      for (let i = entries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [entries[i], entries[j]] = [entries[j], entries[i]];
      }
    } else {
      // Sort by letter for ordered display (A, B, C, D, etc.)
      entries.sort((a, b) => a[0].localeCompare(b[0]));
    }
    
    return entries;
  }, [question, randomizeAnswers]);
  
  return (
    <div className="question-display">
      <div className="question">
        {question.numar}. {question.intrebare}
      </div>
      
      <div className="answers">
        {processedAnswers.map(([letter, text]) => {
          const isSelected = selectedAnswers.includes(letter);
          const shouldBeSelected = feedback.visible && correctAnswer.includes(letter);
          const isIncorrect = feedback.visible && isSelected && !correctAnswer.includes(letter);
          
          let className = "answer-option";
          if (!feedback.visible && isSelected) {
            className += " selected";
          } else if (feedback.visible) {
            if (shouldBeSelected) {
              className += " correct";
            } else if (isIncorrect) {
              className += " incorrect";
            }
          }
          
          return (
            <div 
              key={letter}
              className={className}
              onClick={() => !feedback.visible && onAnswerSelect(letter)}
              data-letter={letter}
            >
              {text}
            </div>
          );
        })}
      </div>
      
      {feedback.visible && (
        <div className={`feedback ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay; 