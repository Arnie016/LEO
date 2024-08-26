// src/components/Chatbot.js
import React, { useState } from 'react';
import './Chatbot.css';
import { FaRobot } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button className="chatbot-toggle" onClick={toggleChat}>
        <FaRobot />
      </button>
      {isOpen && (
        <div className="chatbot-content">
          <div className="chatbot-header">
            <h4>Chatbot</h4>
          </div>
          <div className="chatbot-messages">
            {/* Messages will be dynamically rendered here */}
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="Type your question..." />
            <button type="button">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
