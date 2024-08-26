// src/components/HistoryLog.js
import React from 'react';
import './HistoryLog.css';

const HistoryLog = ({ history }) => {
  return (
    <div className="history-log">
      <h3>History Log</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            <span className="timestamp">{entry.timestamp}</span>: {entry.action}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryLog;
