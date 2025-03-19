import React, { useMemo } from 'react';
import '../styles/QuestionDisplay.css';

const QuestionDisplay = ({ 
  question, 
  selectedAnswers, 
  onAnswerSelect,
  feedback,
  correctAnswer
}) => {
  // Randomize the order of answers using useMemo to prevent re-randomization on each render
  const randomizedAnswers = useMemo(() => {
    if (!question || !question.variante) return [];
    
    // Convert object entries to array and shuffle
    const entries = Object.entries(question.variante);
    
    // Fisher-Yates shuffle algorithm
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    
    return entries;
  }, [question]);
  
  return (
    <div className="question-display">
      <div className="question">
        {question.numar}. {question.intrebare}
      </div>
      
      <div className="answers">
        {randomizedAnswers.map(([letter, text]) => {
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