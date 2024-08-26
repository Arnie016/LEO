import React, { useState, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import './App.css';
import PowerSources from './components/PowerSources';
import VentilationMode from './components/VentilationMode';
import Parameters from './components/Parameters';
import Options from './components/Options';
import Help from './components/Help';
import GraphPage from './components/GraphPage';
import ParameterModal from './components/ParameterModal';
import { FaArrowUp, FaArrowDown, FaInfoCircle } from 'react-icons/fa';

const initialParameters = {
  RR: { value: 18, unit: 'breaths/min', low: 16, high: 22 },
  LPM: { value: 8.2, unit: 'L/min', low: 6.7, high: 9.8 },
  FLOW: { value: 60, unit: 'L/min', low: 40, high: 70 },
  TV: { value: 460, unit: 'mL', low: 385, high: 500 },
  PMAX: { value: 36, unit: 'cmH₂O', low: 16, high: 40 },
  PPEAK: { value: 26, unit: 'cmH₂O', low: 20, high: 36 },
  PINSP: { value: 19, unit: 'cmH₂O', low: 10, high: 23 },
  FiO2: { value: 50, unit: '%', low: 42, high: 61 },
  Trigger: { value: 4, unit: 'cmH₂O', low: 2, high: 6 },
  IE: { value: { inhalation: 1, exhalation: 2 }, unit: 'inhalation:exhalation' },
};

function AppContent() {
  const navigate = useNavigate();
  const [parameters, setParameters] = useState(initialParameters);
  const [tempParameters, setTempParameters] = useState(initialParameters);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [isAlarmMuted, setIsAlarmMuted] = useState(false);
  const [alarmTimeout, setAlarmTimeout] = useState(null);
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null);
  const [modalParam, setModalParam] = useState(null);
  const [enabledModes, setEnabledModes] = useState([]);

  // Create the BroadcastChannel and memoize it
  const broadcast = useMemo(() => new BroadcastChannel('ventilator_channel'), []);

  const parameterFullNames = {
    RR: 'Respiratory Rate',
    TV: 'Tidal Volume',
    PINSP: 'Inspiratory Pressure',
    FiO2: 'Fraction of Inspired Oxygen',
    FLOW: 'Flow Rate',
    PMAX: 'Maximum Pressure',
    PPEAK: 'Peak Pressure',
    LPM: 'Liters Per Minute',
    IE: 'Inspiratory:Expiratory Ratio',
    Trigger: 'Trigger Sensitivity',
  };

  const speak = useCallback((text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  }, []);

  const muteAlarm = useCallback(() => {
    if (isAlarmMuted) {
      clearTimeout(alarmTimeout);
      setIsAlarmMuted(false);
      speak('Alarm unmuted.');
    } else {
      setIsAlarmMuted(true);
      const timeout = setTimeout(() => {
        setIsAlarmMuted(false);
        speak('Alarm unmuted.');
      }, 300000);
      setAlarmTimeout(timeout);
      speak('Alarm muted for 5 minutes.');
    }
  }, [alarmTimeout, isAlarmMuted, speak]);

  const handleIncrement = useCallback(() => {
    if (selectedParameter) {
      setTempParameters((prev) => {
        const newValue = Math.min(prev[selectedParameter].value + 1, prev[selectedParameter].high);
        return {
          ...prev,
          [selectedParameter]: { ...prev[selectedParameter], value: newValue },
        };
      });
    }
  }, [selectedParameter]);

  const handleDecrement = useCallback(() => {
    if (selectedParameter) {
      setTempParameters((prev) => {
        const newValue = Math.max(prev[selectedParameter].value - 1, prev[selectedParameter].low);
        return {
          ...prev,
          [selectedParameter]: { ...prev[selectedParameter], value: newValue },
        };
      });
    }
  }, [selectedParameter]);

  const togglePower = () => {
    setIsPoweredOn(prev => !prev);
  };

  const handleModeSelect = (modesList) => {
    setModes(modesList);
  };

  const handleParameterSelect = (mode) => {
    setSelectedMode(mode);
  };

  const handleInfoClick = () => {
    if (!selectedMode && selectedParameter) {
      setModalParam(selectedParameter);
    }
  };

  const handleEnableMode = () => {
    if (selectedMode) {
      if (enabledModes.includes(selectedMode.name)) {
        setEnabledModes(prev => prev.filter(mode => mode !== selectedMode.name));
      } else {
        setEnabledModes(prev => [...prev, selectedMode.name]);
      }
      setSelectedMode(null);
    }
  };

  const handleBack = () => {
    // Reset the states to show the Parameters view
    setSelectedMode(null);
    setModes([]);
  };

  const handleCloseModal = () => {
    setModalParam(null);
  };

  const handleEnter = () => {
    setParameters(tempParameters); // Save the tempParameters to parameters
    broadcast.postMessage(tempParameters); // Broadcast the updated parameters
  };

  const handleViewGraphClick = () => {
    const graphWindow = window.open('/graph', '_blank');
    graphWindow.onbeforeunload = () => {
      broadcast.close();
    };
  };

  return (
    <div className="App">
      <header>
        <div className="header-title">
          <h1>Ventilator Management System</h1>
        </div>
        <nav>
          {enabledModes.map((mode, index) => (
            <Link key={index} to="/" className="enabled-mode">{mode}</Link>
          ))}
          <div className="spacer"></div>
          <button onClick={handleViewGraphClick}>View Graph</button>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={
          <div className="main-container">
            <div className="left-panel">
              <VentilationMode onModeSelect={handleModeSelect} />
              <PowerSources isPoweredOn={isPoweredOn} togglePower={togglePower} />
              <div className="left-panel-buttons">
                <button onClick={() => navigate('/help')} className="big-button">?</button>
                <button onClick={() => navigate('/options')} className="big-button">Options</button>
              </div>
            </div>
            <div className="center-panel">
              {selectedMode ? (
                <div className="mode-details">
                  <h3>{selectedMode.name}</h3>
                  <p>{selectedMode.description}</p>
                  <p><strong>Indications:</strong> {selectedMode.indications}</p>
                  <p><strong>Advantages:</strong> {selectedMode.advantages}</p>
                  <p><strong>Disadvantages:</strong> {selectedMode.disadvantages}</p>
                  <p><strong>Settings:</strong> {selectedMode.settings}</p>
                  <p><strong>Monitoring:</strong> {selectedMode.monitoring}</p>
                  <p><strong>Patient Suitability:</strong> {selectedMode.patientSuitability}</p>
                  <div className="button-group">
                    <button 
                      onClick={handleEnableMode} 
                      className={`enable-button ${enabledModes.includes(selectedMode.name) ? 'enabled' : ''}`}
                    >
                      Enable Mode
                    </button>
                    <button onClick={handleBack} className="back-button">Back</button>
                  </div>
                </div>
              ) : (
                <>
                  {modes.length > 0 ? (
                    <div className="mode-selection">
                      {modes.map((mode) => (
                        <button 
                          key={mode.id} 
                          onClick={() => handleParameterSelect(mode)} 
                          className="mode-button"
                        >
                          {mode.icon} {mode.name}
                        </button>
                      ))}
                      <button onClick={handleBack} className="back-button">Back</button> {/* Add Back Button */}
                    </div>
                  ) : (
                    <Parameters 
                      parameters={tempParameters} 
                      onParameterSelect={setSelectedParameter}
                      selectedParameter={selectedParameter}
                    />
                  )}
                </>
              )}
            </div>
            <div className="right-panel">
              <button className="control-button up" onClick={handleIncrement}>
                <FaArrowUp />
              </button>
              <button className="control-button enter" onClick={handleEnter}>
                Enter
              </button>
              <button className="control-button down" onClick={handleDecrement}>
                <FaArrowDown />
              </button>
              <button onClick={muteAlarm} className={`control-button mute-alarm ${isAlarmMuted ? 'muted' : ''}`}>
                Mute Alarm
              </button>
              {selectedParameter && (
                <button className="control-button info" onClick={handleInfoClick}>
                  <FaInfoCircle /> Info
                </button>
              )}
            </div>
          </div>
        } />
        <Route path="/help" element={<Help />} />
        <Route path="/options" element={<Options />} />
        <Route path="/graph" element={<GraphPage parameters={parameters} />} />
      </Routes>
      {modalParam && (
        <ParameterModal 
          parameter={parameters[modalParam]}
          paramName={parameterFullNames[modalParam]}
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
