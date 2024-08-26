import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import './GraphPage.css';

const GraphPage = ({ parameters }) => {
  const [data, setData] = useState([]);
  const [batteryPercentage, setBatteryPercentage] = useState(100);
  const [timeScale, setTimeScale] = useState(100);
  const [currentParameters, setCurrentParameters] = useState(parameters);
  const [wavePhase, setWavePhase] = useState(0);

  useEffect(() => {
    const broadcast = new BroadcastChannel('ventilator_channel');

    broadcast.onmessage = (event) => {
      setCurrentParameters(event.data);
    };

    return () => {
      broadcast.close();
    };
  }, []);

  const generateDataPoint = useCallback(() => {
    const addRandomVariation = (value, range) => {
      const variation = (Math.random() * range * 2) - range; 
      return value + variation;
    };

    const simulateBreathingCycle = (amplitude, frequency, phase) => {
      const cycle = amplitude * Math.sin(frequency * phase) + addRandomVariation(0, amplitude * 0.1); 
      return cycle;
    };

    const simulateAnomaly = (value, anomalyChance, anomalyAmplitude) => {
      if (Math.random() < anomalyChance) {
        return value + (Math.random() * anomalyAmplitude * 2 - anomalyAmplitude);
      }
      return value;
    };

    const newWavePhase = wavePhase + 0.2; 
    setWavePhase(newWavePhase);

    return {
      time: new Date().toLocaleTimeString(),
      pressure: simulateAnomaly(
        currentParameters.PINSP.value + simulateBreathingCycle(10, 1, newWavePhase), 
        0.05, 15
      ),
      flow: simulateAnomaly(
        currentParameters.FLOW.value + simulateBreathingCycle(30, 1, newWavePhase), 
        0.05, 25
      ),
      volume: simulateAnomaly(
        currentParameters.TV.value + simulateBreathingCycle(100, 1, newWavePhase), 
        0.05, 50
      ),
    };
  }, [currentParameters, wavePhase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData, generateDataPoint()];
        return newData.slice(-timeScale);
      });
    }, 1000);

    const batteryInterval = setInterval(() => {
      setBatteryPercentage(prev => Math.max(prev - 1, 0));
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(batteryInterval);
    };
  }, [timeScale, generateDataPoint]);

  const renderGraph = (title, dataKey, unit, color, yDomain) => (
    <div className="graph">
      <h3 className="graph-label">{title}</h3>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="time" stroke="#666" />
          <YAxis stroke="#666" domain={yDomain} />
          <Tooltip contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #ddd' }} />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={color} name={`${title} (${unit})`} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const captureScreenshot = () => {
    const graphContainer = document.querySelector('.graphs-container');
    html2canvas(graphContainer).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'graph_screenshot.png';
      link.click();
    });
  };

  return (
    <div className="graph-page">
      <div className="graphs-container">
        {renderGraph("Pressure", "pressure", "cmH2O", "#3498db", [0, 40])}
        {renderGraph("Flow", "flow", "L/min", "#2ecc71", [-60, 60])}
        {renderGraph("Volume", "volume", "mL", "#e67e22", [0, 800])}
        <div className="bottom-controls">
          <select 
            className="time-scale-select" 
            value={timeScale} 
            onChange={(e) => setTimeScale(Number(e.target.value))}
          >
            <option value={60}>1 minute</option>
            <option value={180}>3 minutes</option>
            <option value={300}>5 minutes</option>
          </select>
          <button className="control-btn" onClick={captureScreenshot}>Capture Screenshot</button>
          <button className="control-btn">Trigger</button>
          <button className="control-btn">Alarm</button>
          <div className="battery-status">🔋 Battery: {batteryPercentage}%</div>
        </div>
      </div>
      <div className="right-panel">
        <h2 className="panel-title">Ventilation Parameters</h2>
        <div className="parameter-grid">
          {[
            { name: "RR", value: currentParameters.RR.value, unit: "breaths/min", normal: "12-20" },
            { name: "TV", value: currentParameters.TV.value, unit: "mL", normal: "4-8 mL/kg" },
            { name: "PINSP", value: currentParameters.PINSP.value, unit: "cmH₂O", normal: "10-20" },
            { name: "FiO2", value: currentParameters.FiO2.value, unit: "%", normal: "21-60" },
            { name: "FLOW", value: currentParameters.FLOW.value, unit: "L/min", normal: "40-80" },
            { name: "PPEAK", value: currentParameters.PPEAK.value, unit: "cmH₂O", normal: "<30" },
          ].map((param, index) => (
            <div key={index} className="parameter">
              <span className="param-name">{param.name}</span>
              <span className="param-value">{param.value}</span>
              <span className="param-unit">{param.unit}</span>
              <span className="param-normal">Normal: {param.normal}</span>
            </div>
          ))}
        </div>
        <div className="alarm-log">
          <h3>Recent Alarms</h3>
          <ul>
            <li>10:15 AM - High Pressure Alarm</li>
            <li>10:05 AM - Low Tidal Volume</li>
          </ul>
        </div>
        <button onClick={() => window.close()} className="control-btn">Back to Home</button>
      </div>
    </div>
  );
};

export default GraphPage;
