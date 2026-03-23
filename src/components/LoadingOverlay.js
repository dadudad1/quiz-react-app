import React from 'react';
import '../styles/LoadingOverlay.css';

const LoadingOverlay = ({ progress, errors }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-overlay-brand">Grile-Admitere</div>
      <div className="loading-spinner" />
      <div className="loading-progress-track">
        <div
          className="loading-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="loading-text">Se încarcă… {progress}%</div>
    </div>
  );
};

export default LoadingOverlay; 