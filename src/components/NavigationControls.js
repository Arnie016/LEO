// src/components/NavigationControls.js
import React from 'react';

const NavigationControls = ({ onControl }) => {
  return (
    <div className="navigation-controls">
      <button onClick={() => onControl('up')}>▲</button>
      <button onClick={() => onControl('enter')}>Enter</button>
      <button onClick={() => onControl('down')}>▼</button>
    </div>
  );
};

export default NavigationControls;