import React, { useState } from 'react';
import './VentilationModeDetails.css';

const VentilationModeDetails = ({ mode, onEnable, onDisable, onClose }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = () => {
    if (isEnabled) {
      onDisable();
    } else {
      onEnable();
    }
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="ventilation-mode-details">
      <h2>{mode.icon} {mode.name}</h2>
      <p><strong>Description:</strong> {mode.description}</p>
      <p><strong>Indications:</strong> {mode.indications}</p>
      <p><strong>Advantages:</strong> {mode.advantages}</p>
      <p><strong>Disadvantages:</strong> {mode.disadvantages}</p>
      <p><strong>Settings:</strong> {mode.settings}</p>
      <p><strong>Monitoring:</strong> {mode.monitoring}</p>
      <p><strong>Patient Suitability:</strong> {mode.patientSuitability}</p>
      <div className="button-group">
        <button 
          onClick={handleToggle} 
          className={`enable-button ${isEnabled ? 'enabled' : ''}`}
        >
          {isEnabled ? 'Disable Mode' : 'Enable Mode'}
        </button>
        <button onClick={onClose} className="back-button">Back</button>
      </div>
    </div>
  );
};

export default VentilationModeDetails;
