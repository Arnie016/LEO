import React, { useEffect, useState, useCallback } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './AIRecommendations.css';

const AIRecommendations = ({ parameters }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);

  const generateRecommendations = useCallback(async (params) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an AI assistant specialized in ventilator management. Provide concise recommendations based on the given parameters."
            },
            {
              role: "user",
              content: `Analyze these ventilator parameters and provide 3 brief, specific recommendations:\n${JSON.stringify(params, null, 2)}`
            }
          ],
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const recommendationsText = response.data.choices[0].message.content.trim();
      return recommendationsText.split('\n').filter(rec => rec.trim() !== '');
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to fetch recommendations. Please try again later.');
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const newRecommendations = await generateRecommendations(parameters);
      setRecommendations(newRecommendations);
      if (newRecommendations.length > 0) {
        setShowPopup(true);
      }
    };

    fetchRecommendations();
  }, [parameters, generateRecommendations]);

  return (
    <div className={`ai-recommendations ${showPopup ? 'show' : ''}`}>
      <div className="ai-recommendations-header">
        <FaBell /> AI Recommendations
        <button onClick={() => setShowPopup(false)}><FaTimes /></button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default AIRecommendations;