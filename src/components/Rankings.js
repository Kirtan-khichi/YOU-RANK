import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const initialParameters = {
  ss: { weight: 0.30, value: 20 },
  fsr: { weight: 0.3, value: 25 },
  fqe: { weight: 0.30, value: 20 },
  fru: { weight: 0.30, value: 20 },
  oe: { weight: 0.3, value: 15 },
  pu: { weight: 0.3, value: 35 },
  qp: { weight: 0.3, value: 35 },
  ipr: { weight: 0.3, value: 15 },
  fppp: { weight: 0.3, value: 15 },
  gue: { weight: 0.2, value: 60 },
  gphd: { weight: 0.2, value: 40 },
  rd: { weight: 0.1, value: 30 },
  wd: { weight: 0.1, value: 30 },
  escs: { weight: 0.1, value: 20 },
  pcs: { weight: 0.1, value: 20 },
  pr: { weight: 0.1, value: 100 },
};

const categoryMap = {
  'Teaching, Learning & Resources': ['ss', 'fsr', 'fqe', 'fru', 'oe'],
  'Research and Professional Practice': ['pu', 'qp', 'ipr', 'fppp'],
  'Graduation Outcomes': ['gue', 'gphd'],
  'Outreach and Inclusivity': ['rd', 'wd', 'escs', 'pcs'],
  'Perception': ['pr'],
};

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [parameters, setParameters] = useState(initialParameters);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showSliders, setShowSliders] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchData();
    checkIfMobile();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rankings');
      setRankings(response.data);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  const calculateScore = (ranking) => {
    let score = Object.keys(parameters).reduce((totalScore, param) => {
      return totalScore + (ranking[param.toLowerCase()] || 0) * (parameters[param].weight);
    }, 0);
    return score.toFixed(2);
  };

  const handleSliderChange = (param, value) => {
    setParameters(prev => ({
      ...prev,
      [param]: { ...prev[param], weight: parseFloat(value) },
    }));
  };

  const applyScores = () => {
    setRankings(rankings.map(ranking => ({
      ...ranking,
      Total: calculateScore(ranking),
    })));
    setShowSliders(false); // Hide sliders after submitting
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedRankings = [...rankings].sort((a, b) => {
    const keyA = a[sortConfig.key];
    const keyB = b[sortConfig.key];
    
    if (keyA === undefined || keyB === undefined) {
      return 0;
    }
  
    if (!isNaN(keyA) && !isNaN(keyB)) {
      return sortConfig.direction === 'ascending' ? keyA - keyB : keyB - keyA;
    } else {
      return sortConfig.direction === 'ascending' ? keyA.localeCompare(keyB) : keyB.localeCompare(keyA);
    }
  });

  const checkIfMobile = () => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  };

  return (
    <div className="flex-container">
      {isMobile ? (
        <>
          {showSliders && (
            <div className="sliders-overlay">
              <div className="sliders-container">
                {Object.entries(categoryMap).map(([category, params]) => (
                  <div key={category}>
                    <h2>{category}</h2>
                    {params.map(param => (
                      <div className="slider-item" key={param}>
                        <div className="slider-wrapper">
                          <label className="slider-label" htmlFor={`${param}-weight`}>{param}</label>
                          <input
                            className="slider"
                            type="range"
                            id={`${param}-weight`}
                            name={`${param}-weight`}
                            min="0"
                            max="1"
                            step="0.01"
                            value={parameters[param].weight}
                            onChange={(e) => handleSliderChange(param, e.target.value)}
                            style={{ backgroundImage: `linear-gradient(to right, #576D46 ${parameters[param].weight * 100}%, #FBFBFC ${parameters[param].weight * 100}%)` }}
                          />
                          <span className="slider-value">{parameters[param].weight}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <button className="submit-button" onClick={applyScores}>Submit</button>
              </div>
            </div>
          )}
          <div className="table-container" style={{ marginBottom: showSliders ? '500px' : 0 }}>
            <h2 style={{ textAlign: 'center' }}>Rankings</h2>
            <table>
              <thead>
                <tr>
                  <th onClick={() => requestSort('original_rank')}>NIRF RANK {sortConfig.key === 'original_rank' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}</th>
                  <th onClick={() => requestSort('college')}>College Name {sortConfig.key === 'college' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}</th>
                  <th onClick={() => requestSort('Total')}>Your Score {sortConfig.key === 'Total' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}</th>
                  <th onClick={() => requestSort('your_score')}>Nirf Score {sortConfig.key === 'your_score' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}</th>
                </tr>
              </thead>
              <tbody>
                {sortedRankings.map((ranking, index) => (
                  <tr key={index}>
                    <td>{parseInt(ranking.original_rank)}</td>
                    <td>{ranking.college}</td>
                    <td>{ranking.Total || "-"}</td>
                    <td>{parseFloat(ranking.your_score).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showSliders && (
            <div className="show-sliders-mobile">
              <button onClick={() => setShowSliders(true)}>Show Sliders</button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="sliders-container">
            {Object.entries(categoryMap).map(([category, params]) => (
              <div key={category}>
                <h2>{category}</h2>
                {params.map(param => (
                  <div className="slider-item" key={param}>
                    <div className="slider-wrapper">
                      <label className="slider-label" htmlFor={`${param}-weight`}>{param}</label>
                      <input
                        className="slider"
                        type="range"
                        id={`${param}-weight`}
                        name={`${param}-weight`}
                        min="0"
                        max="1"
                        step="0.01"
                        value={parameters[param].weight}
                        onChange={(e) => handleSliderChange(param, e.target.value)}
                        style={{ backgroundImage: `linear-gradient(to right, #576D46 ${parameters[param].weight * 100}%, #FBFBFC ${parameters[param].weight * 100}%)` }}
                      />
                      <span className="slider-value">{parameters[param].weight}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <button className="calculate-button" onClick={applyScores}>Calculate Scores</button>
          </div>

          <div className="table-container">
            <h2 style={{ textAlign: 'center' }}>Rankings</h2>
            <table>
              <thead>
                <tr>
                  <th onClick={() => requestSort('original_rank')}>NIRF RANK {sortConfig.key === 'original_rank' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}</th>
                  <th onClick={() => requestSort('college')}>College Name {sortConfig.key === 'college' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}</th>
                  <th onClick={() => requestSort('Total')}>Your Score {sortConfig.key === 'Total' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}</th>
                  <th onClick={() => requestSort('your_score')}>Nirf Score {sortConfig.key === 'your_score' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}</th>
                </tr>
              </thead>
              <tbody>
                {sortedRankings.map((ranking, index) => (
                  <tr key={index}>
                    <td>{parseInt(ranking.original_rank)}</td>
                    <td>{ranking.college}</td>
                    <td>{ranking.Total || "-"}</td>
                    <td>{parseFloat(ranking.your_score).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Rankings;