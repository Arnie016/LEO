import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaInfoCircle, FaChartBar, FaTimes } from 'react-icons/fa';
import './ParameterModal.css';

const ParameterModal = ({ parameter, paramName, onClose }) => {
  const data = [
    { name: 'Low', value: parameter.low },
    { name: 'Current', value: parameter.value },
    { name: 'High', value: parameter.high },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>{paramName}</h2>
        <div className="modal-details">
          <div className="value-display">
            <p className="current-value">{parameter.value}</p>
            <p className="unit">{parameter.unit}</p>
          </div>
          <p>
            <FaInfoCircle /> <strong>Normal Range:</strong> {parameter.low} - {parameter.high} {parameter.unit}
          </p>
          
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, Math.max(parameter.low, parameter.value, parameter.high) * 1.2]} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <div className="ai-recommendation">
            <h3>
              <FaChartBar /> AI Recommendation:
            </h3>
            <p>{getAIRecommendation(parameter)}</p>
          </div>

          <div className="additional-info">
            <h3>Additional Information:</h3>
            <p>
              The {paramName} is crucial in mechanical ventilation, directly affecting oxygenation and ventilation. Always consider the patient's overall clinical picture when adjusting this parameter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const getAIRecommendation = (parameter) => {
  if (parameter.value > parameter.high) {
    return `The current value is above the normal range. Consider decreasing it to improve patient safety and comfort.`;
  } else if (parameter.value < parameter.low) {
    return `The current value is below the normal range. Consider increasing it to ensure adequate ventilation.`;
  } else {
    return `The value is within the normal range. Continue monitoring and adjust based on the patient's condition and other parameters.`;
  }
};

export default ParameterModal;

