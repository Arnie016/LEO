import React from 'react';
import { FaLungs, FaHeartbeat, FaWind, FaCompressArrowsAlt } from 'react-icons/fa';
import './VentilationMode.css';

const VentilationMode = ({ onModeSelect }) => {
  const modes = [
    { 
      id: 'Mode 1', 
      name: 'Assist-Control (AC)', 
      icon: <FaLungs />, 
      description: 'Delivers a set number of breaths per minute, allowing patient-triggered breaths.',
      indications: 'Patients with weak respiratory muscles who need full ventilatory support.',
      advantages: 'Ensures full support and control over the patient\'s ventilation.',
      disadvantages: 'Risk of hyperventilation and respiratory alkalosis if not monitored properly.',
      settings: 'Set respiratory rate, tidal volume, inspiratory flow rate, and sensitivity.',
      monitoring: 'Monitor patient\'s respiratory rate, tidal volume, peak inspiratory pressure, and patient-ventilator synchrony.',
      patientSuitability: 'Suitable for patients with respiratory failure, postoperative patients, and patients under deep sedation.'
    },
    { 
      id: 'Mode 2', 
      name: 'SIMV', 
      icon: <FaHeartbeat />, 
      description: 'Synchronized Intermittent Mandatory Ventilation combines mandatory breaths with spontaneous breathing.',
      indications: 'Patients who are partially able to breathe on their own but need some ventilatory support.',
      advantages: 'Allows spontaneous breathing, reduces the risk of respiratory muscle atrophy.',
      disadvantages: 'May lead to patient-ventilator asynchrony if not set correctly.',
      settings: 'Set respiratory rate, tidal volume for mandatory breaths, pressure support for spontaneous breaths.',
      monitoring: 'Monitor patient\'s spontaneous breathing efforts, synchrony with ventilator, and overall respiratory function.',
      patientSuitability: 'Suitable for weaning patients off mechanical ventilation and patients with moderate respiratory muscle strength.'
    },
    { 
      id: 'Mode 3', 
      name: 'CPAP', 
      icon: <FaWind />, 
      description: 'Continuous Positive Airway Pressure maintains constant positive airway pressure during spontaneous breathing.',
      indications: 'Patients with obstructive sleep apnea, mild respiratory distress, or at risk of alveolar collapse.',
      advantages: 'Keeps airways open, improves oxygenation, reduces work of breathing.',
      disadvantages: 'Patient must initiate all breaths; not suitable for patients with apnea.',
      settings: 'Set CPAP level, FiO2 (fraction of inspired oxygen).',
      monitoring: 'Monitor patient\'s oxygenation status, respiratory rate, and comfort with the CPAP level.',
      patientSuitability: 'Suitable for patients with obstructive sleep apnea, mild respiratory distress, and postoperative patients at risk of atelectasis.'
    },
    { 
      id: 'Mode 4', 
      name: 'PSV', 
      icon: <FaCompressArrowsAlt />, 
      description: 'Pressure Support Ventilation supports spontaneous breathing with preset pressure assistance.',
      indications: 'Patients who can initiate breaths but need assistance to overcome airway resistance and improve tidal volume.',
      advantages: 'Enhances patient comfort, reduces work of breathing, and improves tidal volume.',
      disadvantages: 'Patient must be able to initiate breaths; risk of hypoventilation if pressure support is inadequate.',
      settings: 'Set pressure support level, FiO2.',
      monitoring: 'Monitor patient\'s respiratory rate, tidal volume, and synchrony with the ventilator.',
      patientSuitability: 'Suitable for weaning patients off mechanical ventilation, patients with COPD, and patients with weak respiratory muscles.'
    },
  ];

  return (
    <div className="ventilation-mode">
      <button onClick={() => onModeSelect(modes)} className="expand-button large-button">
        Ventilation Modes
      </button>
    </div>
  );
};

export default VentilationMode;
