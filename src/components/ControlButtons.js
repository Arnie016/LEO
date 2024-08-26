import React from 'react';
import './ControlButtons.css';

const ControlButtons = ({ toggleChatbot, toggleHistoryLog, isChatbotVisible, isHistoryLogVisible, handleMuteAlarm, isAlarmMuted }) => {
  return (
    <div className="control-buttons-container">
      <div className="control-buttons-group">
        <button className="control-button" onClick={toggleChatbot}>
          {isChatbotVisible ? 'HIDE CHATBOT' : 'SHOW CHATBOT'}
        </button>
        <button className="control-button" onClick={toggleHistoryLog}>
          {isHistoryLogVisible ? 'HIDE HISTORY LOG' : 'SHOW HISTORY LOG'}
        </button>
        <button className={`control-button mute-alarm ${isAlarmMuted ? 'muted' : ''}`} onClick={handleMuteAlarm}>
          {isAlarmMuted ? 'UNMUTE ALARM' : 'MUTE ALARM'}
        </button>
      </div>
    </div>
  );
};

export default ControlButtons;
