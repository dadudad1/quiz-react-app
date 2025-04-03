import React from 'react';
import '../styles/YearSelector.css';

const YearSelector = ({ selectedYear, onYearChange }) => {
  return (
    <div className="year-selector">
      <label htmlFor="year-select">Selecteaza anul: </label>
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="year-select"
      >
        <option value="2024">2024</option>
        <option value="2025">2025</option>
      </select>
    </div>
  );
};

export default YearSelector; 