import React, { useState, useEffect } from 'react';
import './PowerSources.css';

const PowerSources = () => {
  const [acInput, setAcInput] = useState('CONNECTED');
  const [auxInput, setAuxInput] = useState('NOT CONNECTED');
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [activePowerSource, setActivePowerSource] = useState('NONE');

  useEffect(() => {
    if (isPoweredOn) {
      if (acInput === 'CONNECTED') {
        setAcInput('IN USE');
        setActivePowerSource('AC');
      } else if (auxInput === 'CONNECTED') {
        setAuxInput('IN USE');
        setActivePowerSource('AUX');
      } else {
        setActivePowerSource('BATTERY');
      }
    } else {
      setAcInput(acInput === 'IN USE' ? 'CONNECTED' : acInput);
      setAuxInput(auxInput === 'IN USE' ? 'CONNECTED' : auxInput);
      setActivePowerSource('NONE');
    }
  }, [isPoweredOn]);

  const togglePower = () => {
    setIsPoweredOn(prev => !prev);
  };

  const toggleAC = () => {
    if (acInput === 'NOT CONNECTED') {
      setAcInput('CONNECTED');
      if (isPoweredOn) {
        setAcInput('IN USE');
        setActivePowerSource('AC');
        if (auxInput === 'IN USE') setAuxInput('CONNECTED');
      }
    } else {
      if (isPoweredOn && acInput === 'IN USE') {
        if (auxInput === 'CONNECTED') {
          setAuxInput('IN USE');
          setActivePowerSource('AUX');
        } else {
          setActivePowerSource('BATTERY');
        }
      }
      setAcInput('NOT CONNECTED');
    }
  };

  const toggleAUX = () => {
    if (auxInput === 'NOT CONNECTED') {
      setAuxInput('CONNECTED');
      if (isPoweredOn && activePowerSource === 'BATTERY') {
        setAuxInput('IN USE');
        setActivePowerSource('AUX');
      }
    } else {
      if (isPoweredOn && auxInput === 'IN USE') {
        setActivePowerSource('BATTERY');
      }
      setAuxInput('NOT CONNECTED');
    }
  };

  return (
    <div className="power-sources-container">
      <div className="power-sources">
        <h2>Power Sources</h2>
        <div 
          className={`input-block ac ${acInput.toLowerCase().replace(' ', '-')}`} 
          onClick={toggleAC}
        >
          AC - {acInput}
        </div>
        <div 
          className={`input-block aux ${auxInput.toLowerCase().replace(' ', '-')}`} 
          onClick={toggleAUX}
        >
          AUX - {auxInput}
        </div>
        <div className="active-source">
          Active Source: {activePowerSource}
        </div>
        <div className="power-toggle">
          <label className="switch">
            <input type="checkbox" checked={isPoweredOn} onChange={togglePower} />
            <span className="slider"></span>
          </label>
          <span>Power {isPoweredOn ? 'On' : 'Off'}</span>
        </div>
      </div>
      <div className="additional-buttons">
    
      </div>
    </div>
  );
};

export default PowerSources;
