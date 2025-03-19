import React from 'react';
import '../styles/Statistics.css';

const Statistics = ({ correctCount, totalCount, bookmarkedCount, resetStats }) => {
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  
  return (
    <div className="statistics">
      <div className="stat-item">
        <strong>Total răspunsuri corecte:</strong> {correctCount}
      </div>
      <div className="stat-item">
        <strong>Total întrebări:</strong> {totalCount}
      </div>
      <div className="stat-item">
        <strong>Procentaj:</strong> {percentage}%
      </div>
      <div className="stat-item">
        <strong>Întrebări salvate:</strong> {bookmarkedCount}
      </div>
      <div className="stat-actions">
        <button 
          className="btn btn-reset" 
          onClick={resetStats}
          disabled={totalCount === 0}
        >
          Resetează statisticile
        </button>
      </div>
    </div>
  );
};

export default Statistics; 