import React, { useState, useEffect } from 'react';
import { formatTime } from './finishSimulation';
import '../styles/SimulationResults.css';

const SimulationResults = ({ 
  results, 
  totalQuestions, 
  timeSpentInSeconds, 
  onRestart, 
  onExit,
  totalAvailableQuestions = 0
}) => {
  const { correctCount, resultsByChapter } = results;
  const score = Math.round((correctCount / totalQuestions) * 100);
  
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
  
  // Load simulation statistics from localStorage
  useEffect(() => {
    // Load simulation stats
    const savedStats = localStorage.getItem('simulationStats');
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
        // This needs to be coordinated with the total question count in allChaptersData
        // For now, we'll use a calculation based on the chapter results
        const chaptersTotal = Object.values(resultsByChapter).reduce((total, chapter) => {
          // Estimate the total number of questions in the chapter
          // This is a rough estimation, adjust based on your actual data
          const estimatedChapterTotal = chapter.total * 5; // Assuming we're using about 20% of chapter questions
          return total + estimatedChapterTotal;
        }, 0);
        
        setCalculatedAvailableQuestions(chaptersTotal || 500); // Fallback to 500 if calculation fails
      } catch (e) {
        console.error('Eroare la calcularea numărului total de întrebări disponibile:', e);
        setCalculatedAvailableQuestions(500); // Default fallback
      }
    }
  }, [resultsByChapter, totalAvailableQuestions]);
  
  // Use the prop value if available, otherwise use calculated value
  const finalAvailableQuestions = totalAvailableQuestions || calculatedAvailableQuestions;
  
  return (
    <div className="simulation-container">
      <div className="two-column-layout">
        <div className="left-column">
          <div className="simulation-results">
            <h2 className="results-title">Rezultatele Simulării</h2>
            
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
            </div>
            
            <h3 className="section-title">Performanță pe capitole</h3>
            <div className="chapter-results">
              {Object.entries(resultsByChapter).map(([chapter, data]) => (
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
                </div>
              ))}
            </div>
            
            <div className="results-actions">
              <button 
                className="btn btn-primary"
                onClick={onRestart}
              >
                Reîncepe Simularea
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
            <h2 className="stats-title">Statistici globale</h2>
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
                      <div className="test-result-date">{new Date(test.date).toLocaleDateString()}</div>
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