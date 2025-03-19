import React from 'react';
import '../styles/LoadingOverlay.css';

const LoadingOverlay = ({ progress, errors }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <h2>Loading Quiz Data...</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p>{progress}% Complete</p>
        
        {Object.keys(errors || {}).length > 0 && (
          <div className="loading-errors">
            <h3>Loading Errors:</h3>
            <ul>
              {Object.entries(errors).map(([chapter, error]) => (
                error && <li key={chapter}>Chapter {chapter}: {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay; 