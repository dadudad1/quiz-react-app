import React, { useState, useEffect } from 'react';
import '../styles/Timer.css';

const Timer = ({ initialTimeInMinutes, onTimeExpired }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeInMinutes * 60); // in seconds
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsActive(false);
      if (onTimeExpired) {
        onTimeExpired();
      }
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeRemaining, onTimeExpired]);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Calculate percentage of time remaining
  const timePercentage = Math.round((timeRemaining / (initialTimeInMinutes * 60)) * 100);
  
  // Determine timer color based on time remaining
  let timerClass = 'timer-normal';
  if (timePercentage < 25) {
    timerClass = 'timer-danger';
  } else if (timePercentage < 50) {
    timerClass = 'timer-warning';
  }

  return (
    <div className="timer-container">
      <div className={`timer ${timerClass}`}>
        <div className="timer-label">Timp rămas:</div>
        <div className="timer-display">{formatTime(timeRemaining)}</div>
      </div>
      <div className="timer-progress">
        <div 
          className="timer-progress-bar" 
          style={{ width: `${timePercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer; 