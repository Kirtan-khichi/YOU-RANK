import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import './styles.css';

const initialParameters = {
  SS: { weight: 0.30, max: 20 },
  FSR: { weight: 0.3, max: 25 },
  FQE: { weight: 0.30, max: 20 },
  FRU: { weight: 0.30, max: 20 },
  OE: { weight: 0.3, max: 15 },
  PU: { weight: 0.3, max: 35 },
  QP: { weight: 0.3, max: 35 },
  IPR: { weight: 0.3, max: 15 },
  FPPP: { weight: 0.3, max: 15 },
  GUE: { weight: 0.2, max: 60 },
  GPHD: { weight: 0.2, max: 40 },
  RD: { weight: 0.1, max: 30 },
  WD: { weight: 0.1, max: 30 },
  ESCS: { weight: 0.1, max: 20 },
  PCS: { weight: 0.1, max: 20 },
  PR: { weight: 0.1, max: 100 },
};

const OverallRankings = () => {
  const [rankings, setRankings] = useState([]);
  const [parameters, setParameters] = useState(initialParameters);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showSliders, setShowSliders] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sliderAnimation, setSliderAnimation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const slidersRef = useRef(null);

  useEffect(() => {
    fetchData();
    checkIfMobile();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("data/OverallRanking-2023.csv");
      const text = await response.text();
      const { data, errors } = Papa.parse(text, { header: true });
      if (errors.length > 0) {
        console.error('Error parsing CSV:', errors);
      } else {
        setRankings(data);
      }
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  const calculateScore = (ranking) => {
    let totalScore = 0;
    let totalWeight = 0;

    for (const param in parameters) {
      const weight = parameters[param].weight;
      const max = parameters[param].max;
      const value = ranking[param];

      if (value !== undefined && weight !== undefined && max !== undefined) {
        totalScore += (value / max) * weight;
        totalWeight += weight;
      }
    }

    if (totalWeight === 0) {
      return 0;
    }

    return ((totalScore / totalWeight) * 100).toFixed(2);
  };

  const handleSliderChange = (param, value) => {
    setParameters((prev) => ({
      ...prev,
      [param]: { ...prev[param], weight: parseFloat(value) },
    }));
  };

  const applyScores = () => {
    setRankings(
      rankings.map((ranking) => ({
        ...ranking,
        Total: calculateScore(ranking),
      }))
    );
    setShowSliders(false);
    setSliderAnimation(false);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredRankings = rankings.filter((ranking) => {
    return ranking.college.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedFilteredRankings = [...filteredRankings].sort((a, b) => {
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
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  };

  const toggleSliders = () => {
    setShowSliders((prev) => !prev);
    setSliderAnimation(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClickOutside = (event) => {
    if (slidersRef.current && !slidersRef.current.contains(event.target)) {
      setShowSliders(false);
      setSliderAnimation(false);
    }
  };

  return (
    <div className="overall-rankings">
      {(
        <div className="show-sliders-mobile">
          <button onClick={toggleSliders} className='button-text'>Change Parameters</button>
        </div>
      )}
      {showSliders && (
        <div className={`sliders-container ${sliderAnimation ? 'show' : ''}`} ref={slidersRef}>
          <div className="sliders-overlay" onClick={toggleSliders}></div>
          <button className="backButton" onClick={toggleSliders}>
            <span style={{ fontSize: '24px' }}>&larr;</span> Back
          </button>
          <div className="sliders-content">
            {Object.entries(initialParameters).map(([param, { weight, max }]) => (
              <div className="slider-item" key={param}>
                <div className="slider-wrapper">
                  <label className="slider-label" htmlFor={`${param}-weight`}>
                    {param}
                  </label>
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
                    style={{
                      backgroundImage: `linear-gradient(to right, #576D46 ${parameters[
                        param
                      ].weight * 100}%, #FBFBFC ${parameters[param].weight * 100}%)`,
                    }}
                  />
                  <span className="slider-value">{parameters[param].weight}</span>
                </div>
              </div>
            ))}
            <button className="submit-button" onClick={applyScores}>
              Calculate Score
            </button>
          </div>
        </div>
      )}
      <div className={`table-container ${showSliders ? '-blur' : ''}`}>
        <h4 style={{ textAlign: 'center' }}>Choose what's important for you </h4>
        <input
          type="text"
          placeholder="Search college"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <div className="table-wrapper">
          <table className="scroll-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('Rank')}>
                  NIRF RANK {sortConfig.key === 'Rank' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
                </th>
                <th onClick={() => requestSort('college')}>
                  College Name {sortConfig.key === 'college' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
                </th>
                <th onClick={() => requestSort('Total')}>
                  Your Score {sortConfig.key === 'Total' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
                </th>
                <th onClick={() => requestSort('Score')}>
                  Nirf Score {sortConfig.key === 'Score' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedFilteredRankings.map((ranking, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{parseInt(ranking.Rank)}</td>
                  <td style={{ textAlign: 'center' }}>{ranking.college}</td>
                  <td style={{ textAlign: 'center' }}>{ranking.Total || "-"}</td>
                  <td style={{ textAlign: 'center' }}>{parseFloat(ranking.Score).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverallRankings;