import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Help.css';

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="help">
      <h2 className="help-title">Help Center</h2>
      <div className="help-sections">
        <section className="help-section">
          <h3 className="section-title">Documentation</h3>
          <p className="section-description">Access comprehensive guides and manuals for the ventilator system. Find everything you need to operate and maintain the equipment efficiently.</p>
        </section>
        <section className="help-section">
          <h3 className="section-title">FAQs</h3>
          <p className="section-description">Find answers to commonly asked questions about operation, maintenance, and troubleshooting. Get quick solutions to your problems.</p>
        </section>
        <section className="help-section">
          <h3 className="section-title">Support</h3>
          <p className="section-description">Contact our technical support team for personalized assistance. We're here to help you resolve any issues and answer your questions.</p>
        </section>
        <section className="help-section">
          <h3 className="section-title">Training Videos</h3>
          <p className="section-description">Watch instructional videos on ventilator operation, troubleshooting, and best practices. Enhance your knowledge and skills with our visual guides.</p>
        </section>
      </div>
      <button onClick={() => navigate('/')} className="back-button">Back</button>
    </div>
  );
};

export default Help;
