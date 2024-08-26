import React from 'react';
import PropTypes from 'prop-types';
import './Parameters.css';

const Parameters = ({ parameters, onParameterSelect, selectedParameter }) => {
  const parameterOrder = ['RR', 'PPEAK', 'TV', 'PINSP', 'FiO2', 'FLOW', 'LPM', 'IE', 'PMAX', 'Trigger'];

  return (
    <div className="parameters-grid">
      {parameterOrder.map(param => {
        const { value, unit } = parameters[param];
        let alarmLow, alarmHigh;
        switch (param) {
          case 'RR':
            alarmLow = 16;
            alarmHigh = 22;
            break;
          case 'LPM':
            alarmLow = 6.7;
            alarmHigh = 9.8;
            break;
          case 'FLOW':
            alarmLow = 40;
            alarmHigh = 70;
            break;
          case 'TV':
            alarmLow = 385;
            alarmHigh = 500;
            break;
          case 'PPEAK':
            alarmLow = 20;
            alarmHigh = 36;
            break;
          case 'PINSP':
            alarmLow = 10;
            alarmHigh = 23;
            break;
          case 'FiO2':
            alarmLow = 42;
            alarmHigh = 61;
            break;
          default:
            alarmLow = null;
            alarmHigh = null;
        }
        const isObject = typeof value === 'object' && value !== null;
        return (
          <div 
            key={param} 
            className={`parameter-tile ${selectedParameter === param ? 'selected' : ''}`}
            onClick={() => onParameterSelect?.(param)}
          >
            <div className="parameter-header">
              <span className="param-name">{param}</span>
            </div>
            <div className="parameter-content">
              <div className="parameter-value">
                {isObject
                  ? `${value.inhalation}:${value.exhalation}`
                  : typeof value === 'number'
                  ? value.toFixed(1)
                  : value}
              </div>
              <div className="unit">{unit}</div>
              {param === 'PMAX' || param === 'IE' || param === 'Trigger' ? (
                <div className="alarm-set">
                  <div className="label">SET</div>
                </div>
              ) : (
                <div className="alarm-set">
                  <div className="label">ALARM SET</div>
                  <div className="low-high-container">
                    <div className="low">
                      <div>LOW</div>
                      <div>{alarmLow}</div>
                    </div>
                    <div className="high">
                      <div>HIGH</div>
                      <div>{alarmHigh}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Parameters.propTypes = {
  parameters: PropTypes.object.isRequired,
  onParameterSelect: PropTypes.func,
  selectedParameter: PropTypes.string,
};

export default Parameters;
