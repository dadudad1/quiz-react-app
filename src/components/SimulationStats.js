import React from 'react';
import '../styles/SimulationStats.css';

const SimulationStats = ({ 
  stats, 
  onResetStats, 
  totalAvailableQuestions = 0,
  isCustom = false 
}) => {
  const { 
    testsTaken, 
    testsPassed, 
    totalQuestionsAnswered,
    totalCorrectAnswers = 0,
    last10Tests 
  } = stats;

  // Calculate overall passing percentage
  const passingPercentage = testsTaken > 0 
    ? Math.round((testsPassed / testsTaken) * 100) 
    : 0;
  
  // Calculate last 10 tests passing percentage
  const last10TestsCount = last10Tests.length;
  const last10TestsPassed = last10Tests.filter(test => test.passed).length;
  const last10PassingPercentage = last10TestsCount > 0 
    ? Math.round((last10TestsPassed / last10TestsCount) * 100) 
    : 0;

  // Calculate correct answers percentage
  const correctAnswersPercentage = totalQuestionsAnswered > 0
    ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100)
    : 0;

  return (
    <div className="simulation-stats">
      <h2 className="stats-title">
        {isCustom ? 'Statistici Simulări Personalizate' : 'Statistici Simulări Standard'}
      </h2>
      
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-card-value">{testsTaken}</div>
          <div className="stat-card-label">Simulări efectuate</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-value">{testsPassed}</div>
          <div className="stat-card-label">Simulări promovate</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-value">{passingPercentage}%</div>
          <div className="stat-card-label">Rată de promovare</div>
        </div>
      </div>
      
      <div className="stats-section">
        <h3 className="section-title">Ultimele 10 Simulări</h3>
        {last10Tests.length > 0 ? (
          <>
            <div className="last-10-percentage">
              <div className="percentage-label">Rata de promovare:</div>
              <div className="percentage-value">{last10PassingPercentage}%</div>
            </div>
            
            <div className="last-tests-list">
              {last10Tests.map((test, index) => (
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
          </>
        ) : (
          <div className="no-data">Nu există simulări recente</div>
        )}
      </div>
      
      <div className="stats-section">
        <h3 className="section-title">Răspunsuri Corecte</h3>
        <div className="total-questions">
          <div className="total-questions-value">
            {totalCorrectAnswers}
            <span className="total-questions-ratio">/{totalQuestionsAnswered}</span>
          </div>
          <div className="total-questions-label">
            răspunsuri corecte ({correctAnswersPercentage}%)
          </div>
        </div>
      </div>
      
      <div className="stats-actions">
        <button 
          className="btn btn-reset" 
          onClick={onResetStats}
          disabled={testsTaken === 0}
        >
          Resetează statisticile
        </button>
      </div>
    </div>
  );
};

export default SimulationStats; 