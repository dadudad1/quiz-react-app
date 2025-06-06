import React, { useState, useEffect } from 'react';
import { formatTime } from './finishSimulation';
import '../styles/SimulationResults.css';

const SimulationResults = ({ 
  results, 
  totalQuestions, 
  timeSpentInSeconds, 
  onRestart, 
  onExit,
  totalAvailableQuestions = 0,
  isCustom = false,
  customParams = {}
}) => {
  // Ensure results and wrongAnswers are properly initialized
  const { correctCount = 0, resultsByChapter = {}, wrongAnswers = [] } = results || {};
  const score = Math.round((correctCount / totalQuestions) * 100);
  const [showWrongAnswers, setShowWrongAnswers] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});
  
  // Determine if the simulation was passed (a score of 70% or higher is passing)
  const isPassed = score >= 70;
  
  // State for simulation statistics
  const [simulationStats, setSimulationStats] = useState({
    testsTaken: 0,
    testsPassed: 0,
    totalQuestionsAnswered: 0,
    last10Tests: []
  });
  
  // If totalAvailableQuestions is not provided, calculate it
  const [calculatedAvailableQuestions, setCalculatedAvailableQuestions] = useState(
    totalAvailableQuestions || 0
  );

  // Handle showing/hiding wrong answers with error handling
  const handleToggleWrongAnswers = () => {
    try {
      console.log('Wrong answers data:', wrongAnswers); // Debug log
      setShowWrongAnswers(prev => !prev);
    } catch (error) {
      console.error('Error toggling wrong answers:', error);
    }
  };

  // Handle toggling chapter expansion
  const handleToggleChapter = (chapter) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapter]: !prev[chapter]
    }));
  };

  // Get all answers for a specific chapter
  const getChapterAnswers = (chapter) => {
    return wrongAnswers.filter(answer => answer.chapter === chapter);
  };
  
  // Load simulation statistics from localStorage
  useEffect(() => {
    // Load simulation stats from the appropriate storage key
    const statsKey = isCustom ? 'customSimulationStats' : 'simulationStats';
    const savedStats = localStorage.getItem(statsKey);
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        setSimulationStats(stats);
      } catch (e) {
        console.error('Eroare la încărcarea statisticilor de simulare:', e);
      }
    }
    
    // Calculate total available questions if not provided as prop
    if (!totalAvailableQuestions) {
      try {
        const chaptersTotal = Object.values(resultsByChapter).reduce((total, chapter) => {
          const estimatedChapterTotal = chapter.total * 5;
          return total + estimatedChapterTotal;
        }, 0);
        
        setCalculatedAvailableQuestions(chaptersTotal || 500);
      } catch (e) {
        console.error('Eroare la calcularea numărului total de întrebări disponibile:', e);
        setCalculatedAvailableQuestions(500);
      }
    }
  }, [resultsByChapter, totalAvailableQuestions, isCustom]);
  
  // Use the prop value if available, otherwise use calculated value
  const finalAvailableQuestions = totalAvailableQuestions || calculatedAvailableQuestions;

  // Render answers for a specific chapter
  const renderChapterAnswers = (chapter) => {
    const chapterAnswers = getChapterAnswers(chapter);
    if (!chapterAnswers.length) return null;

    return (
      <div className="chapter-answers">
        <div className="answers-list">
          {chapterAnswers.map((answer, index) => {
            try {
              return (
                <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="answer-header">
                    <span className="answer-number">Întrebarea {answer.questionNumber}</span>
                    <span className={`answer-status ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                      {answer.isCorrect ? '✓ Corect' : '✗ Incorect'}
                    </span>
                  </div>
                  <div className="answer-question">{answer.question}</div>
                  <div className="answer-details">
                    <div className="answer-options">
                      {answer.options && Array.isArray(answer.options) ? (
                        answer.options.map((option, optIndex) => (
                          <div 
                            key={optIndex}
                            className={`option ${option === answer.correctAnswer ? 'correct' : option === answer.userAnswer ? 'incorrect' : ''}`}
                          >
                            {option}
                          </div>
                        ))
                      ) : (
                        <div className="error-message">Opțiunile nu sunt disponibile</div>
                      )}
                    </div>
                    <div className="answer-feedback">
                      <div className="feedback-item">
                        <span className="feedback-label">Răspunsul tău:</span>
                        <span className={`feedback-value ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                          {answer.userAnswer || 'N/A'}
                        </span>
                      </div>
                      <div className="feedback-item">
                        <span className="feedback-label">Răspunsul corect:</span>
                        <span className="feedback-value correct">{answer.correctAnswer || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } catch (error) {
              console.error('Error rendering answer:', error, answer);
              return null;
            }
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="simulation-container">
      <div className="two-column-layout">
        <div className="left-column">
          <div className="simulation-results">
            <h2 className="results-title">
              {isCustom ? 'Rezultatele Simulării Personalizate' : 'Rezultatele Simulării'}
            </h2>
            
            <div className={`score-display ${isPassed ? 'passed' : 'failed'}`}>
              <div className="score-value">{score}%</div>
              <div className="score-label">
                {isPassed ? 'Promovat!' : 'Nepromovat'}
              </div>
            </div>
            
            <div className="results-summary">
              <div className="summary-item">
                <span className="summary-label">Răspunsuri corecte:</span>
                <span className="summary-value">{correctCount} din {totalQuestions}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Timp utilizat:</span>
                <span className="summary-value">{formatTime(timeSpentInSeconds)}</span>
              </div>
              
              {isCustom && customParams.selectedChapters && (
                <div className="summary-item">
                  <span className="summary-label">Capitole incluse:</span>
                  <span className="summary-value">
                    {customParams.selectedChapters.map(ch => ch.replace('cap', '')).join(', ')}
                  </span>
                </div>
              )}
              
              {isCustom && customParams.simulationTime && (
                <div className="summary-item">
                  <span className="summary-label">Timp alocat:</span>
                  <span className="summary-value">{customParams.simulationTime} minute</span>
                </div>
              )}
            </div>
            
            <h3 className="section-title">Performanță pe capitole</h3>
            <div className="chapter-results">
              {Object.entries(resultsByChapter).map(([chapter, data]) => {
                const chapterAnswers = getChapterAnswers(chapter);
                return (
                  <div key={chapter} className="chapter-result">
                    <div className="chapter-header">
                      <h4>Capitolul {chapter.replace('cap', '')}</h4>
                      <div className="chapter-score">
                        {Math.round((data.correct / data.total) * 100)}%
                      </div>
                    </div>
                    <div className="chapter-detail">
                      {data.correct} corecte din {data.total} întrebări
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(data.correct / data.total) * 100}%` }}
                      ></div>
                    </div>
                    {chapterAnswers.length > 0 && (
                      <div className="chapter-actions">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleToggleChapter(chapter)}
                        >
                          {expandedChapters[chapter] ? 'Ascunde' : 'Arată'} răspunsuri ({chapterAnswers.length})
                        </button>
                      </div>
                    )}
                    {expandedChapters[chapter] && renderChapterAnswers(chapter)}
                  </div>
                );
              })}
            </div>
            
            <div className="results-actions">
              <button 
                className="btn btn-primary"
                onClick={onRestart}
              >
                {isCustom ? 'Nouă Simulare Personalizată' : 'Reîncepe Simularea'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={onExit}
              >
                Ieșire din Simulare
              </button>
            </div>
          </div>
        </div>
        
        <div className="right-column">
          {/* Statistics summary */}
          <div className="stats-summary">
            <h2 className="stats-title">
              {isCustom ? 'Statistici Simulări Personalizate' : 'Statistici Simulări Standard'}
            </h2>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-box-value">{simulationStats.testsTaken}</div>
                <div className="stat-box-label">Simulări efectuate</div>
              </div>
              
              <div className="stat-box">
                <div className="stat-box-value">{simulationStats.testsPassed}</div>
                <div className="stat-box-label">Simulări promovate</div>
              </div>
              
              <div className="stat-box">
                <div className="stat-box-value">
                  {simulationStats.testsTaken > 0 
                    ? Math.round((simulationStats.testsPassed / simulationStats.testsTaken) * 100) 
                    : 0}%
                </div>
                <div className="stat-box-label">Rată de promovare</div>
              </div>
              
              <div className="stat-box">
                <div className="stat-box-value">
                  {simulationStats.totalCorrectAnswers || 0}
                  <span className="stat-box-ratio">/{simulationStats.totalQuestionsAnswered || 0}</span>
                </div>
                <div className="stat-box-label">
                  Răspunsuri corecte
                  {simulationStats.totalQuestionsAnswered > 0 && (
                    <span className="stat-box-percentage">
                      ({Math.round((simulationStats.totalCorrectAnswers / simulationStats.totalQuestionsAnswered) * 100)}%)
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Show recent test history */}
            <h3 className="section-title">Ultimele Simulări</h3>
            {simulationStats.last10Tests.length > 0 ? (
              <div className="last-tests-list">
                {simulationStats.last10Tests.map((test, index) => (
                  <div 
                    key={index}
                    className={`test-result ${test.passed ? 'passed' : 'failed'}`}
                  >
                    <div className="test-result-score">{test.score}%</div>
                    <div className="test-result-details">
                      <div>{test.correctCount} din {test.totalQuestions} corecte</div>
                      <div className="test-result-date">
                        {new Date(test.date).toLocaleDateString()}
                        {isCustom && test.selectedChapters && (
                          <span className="test-chapters">
                            (Cap: {test.selectedChapters.map(ch => ch.replace('cap', '')).join(', ')})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">Nu există simulări recente</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults; 