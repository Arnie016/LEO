import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Options.css';

const Options = () => {
  const [settings, setSettings] = useState({
    alarmVolume: 50,
    screenBrightness: 70,
    language: 'English',
    units: 'Metric',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
  };

  return (
    <div className="options">
      <h2 className="options-title">Settings</h2>
      <form className="options-form">
        <div className="option-group">
          <label htmlFor="alarmVolume">Alarm Volume</label>
          <input
            type="number"
            id="alarmVolume"
            name="alarmVolume"
            min="0"
            max="100"
            value={settings.alarmVolume}
            onChange={handleChange}
            className="option-input"
          />
          <span>%</span>
        </div>
        <div className="option-group">
          <label htmlFor="screenBrightness">Screen Brightness</label>
          <input
            type="number"
            id="screenBrightness"
            name="screenBrightness"
            min="0"
            max="100"
            value={settings.screenBrightness}
            onChange={handleChange}
            className="option-input"
          />
          <span>%</span>
        </div>
        <div className="option-group">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            name="language"
            value={settings.language}
            onChange={handleChange}
            className="option-select"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
        <div className="option-group">
          <label htmlFor="units">Units</label>
          <select
            id="units"
            name="units"
            value={settings.units}
            onChange={handleChange}
            className="option-select"
          >
            <option value="Metric">Metric</option>
            <option value="Imperial">Imperial</option>
          </select>
        </div>
      </form>
      <button onClick={() => navigate('/')} className="back-button">Back</button>
    </div>
  );
};

export default Options;
