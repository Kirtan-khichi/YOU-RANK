import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import './styles.css';
import ChartComponent from './ChartComponent';
import sliderArrow from '../assets/slider_arrow.png';



const initialParameters = {
  'Faculty Student Ratio': { weight: 0.3, max: 30 },
  'Faculty Quality': { weight: 0.30, max: 20 },
  'Region Diversity': { weight: 0.1, max: 30 },
  'Woman diversity': { weight: 0.1, max: 30 },
  'Peer reputation': { weight: 0.1, max: 100 },
};

const MedicalRankings = () => {
  const [rankings, setRankings] = useState([]);
  const [parameters, setParameters] = useState(initialParameters);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showSliders, setShowSliders] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sliderAnimation, setSliderAnimation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollegeData, setSelectedCollegeData] = useState(null);
  const [additionalData, setAdditionalData] = useState([]);
  const [tableScrollTop, setTableScrollTop] = useState(0);
  const [selectedSortParam, setSelectedSortParam] = useState('');
  const [selectedRankingParam, setSelectedRankingParam] = useState('');
  const [selectedCollegeChartData, setSelectedCollegeChartData] = useState(null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false); // New state to track additional info visibility

  const slidersRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchAdditionalData();
    checkIfMobile();

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (tableRef.current) {
        setTableScrollTop(tableRef.current.scrollTop);
      }
    };
    if (tableRef.current) {
      tableRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (tableRef.current) {
        tableRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("data/Medical2023Updated.csv");
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

  const fetchAdditionalData = async () => {
    try {
      const response = await fetch("data/MedicalStudentPdfData2023.csv");
      const text = await response.text();
      const { data, errors } = Papa.parse(text, { header: true });
      setAdditionalData(data);
    } catch (error) {
      console.error('Error fetching additional data:', error);
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

  const applyScores = async () => {
    const updatedRankings = rankings.map((ranking) => ({
      ...ranking,
      Total: calculateScore(ranking),
    }));
  
    const sortedRankings = [...updatedRankings].sort((a, b) => b.Total - a.Total);
  
    const rankedRankings = sortedRankings.map((ranking, index) => ({
      ...ranking,
      yourrank: index + 1,
    }));
  
    setRankings(rankedRankings);
    // console.log(rankedRankings);
  
    setShowSliders(false);
    setSliderAnimation(false);

    const selectedParameters = {};
    for (const [param, { weight }] of Object.entries(parameters)) {
      selectedParameters[param] = weight;
    }

    console.log(selectedParameters);

    try { 
      const response = await fetch('https://ach4l.pythonanywhere.com/urank_med', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedParameters), 
      });
  
      if (!response.ok) {
        throw new Error('Failed to save scores to the database');
      }

      const textData = await response.text();
      console.log(textData);

    } catch (error) {
      
      console.error('Error saving scores:', error);
    }
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
      /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
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

  const handleInfoButtonClick = async (collegeName) => {
    // Find additional data for the selected college
    const selectedData = additionalData.filter((item) => item.College === collegeName);
    setSelectedCollegeData(selectedData);
  
    // Initialize an array to store chart data for each program
    const chartDataArray = [];
  
    // Iterate over each row of additional data
    selectedData.forEach((dataItem) => {
      // Extract program name and data for the row
      const programName = dataItem.Program;
      const labels = Object.keys(dataItem).filter((key) => key.match(/^\d{4}-\d{2}$/));
      const data = labels.map((label) => parseInt(dataItem[label], 10) || 0);
  
      // Reverse the order of labels and data for display
      const reversedLabels = [...labels].reverse();
      const reversedData = [...data].reverse();
  
      // Create chart data for the program
      const chartData = {
        labels: reversedLabels,
        datasets: [
          {
            label: programName, // Program name as label
            data: reversedData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
          },
        ],
      };
  
      // Push chart data for the program into the array
      chartDataArray.push(chartData);
    });
  
    // Update the state with the array of chart data
    setSelectedCollegeChartData(chartDataArray);
    setShowAdditionalInfo(true);
  };
  
  
  

  const handleBackButtonClick = () => {
    setShowAdditionalInfo(false);
  };

  const handleSortParamChange = (event) => {
    const selectedParam = event.target.value;

    if (selectedParam !== "") {
      setSelectedSortParam(selectedParam);
      setSelectedRankingParam(selectedParam);

      const sortedRankings = [...rankings].sort((a, b) => b[selectedParam] - a[selectedParam]);

      const rankedRankings = sortedRankings.map((ranking, index) => {
        const value = ranking[selectedParam];
        const max = initialParameters[selectedParam]?.max;
        const total = (value / max) * 100;
        return {
          ...ranking,
          yourrank: index + 1,
          Total: total.toFixed(2),
        };
      });

      setRankings(rankedRankings);
    }
  };

  return (
    <div className={`overall-rankings`}>
      {isMobile && (
        <div className="show-sliders-mobile">
          <button onClick={toggleSliders} className='button-text increase-width'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Change Parameters </b> &nbsp;<img src={sliderArrow} alt="" className="sliderarrow" />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
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

      {!isMobile && (
        <div className="sliders-content">
          <h3 style={{ textAlign: 'center' }}>Choose your parameters</h3>
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
      )}
      <div className={`table-container${showSliders ? 'blur' : ''}`}>
        <h4 style={{ textAlign: 'center' }}>Choose what's important for you </h4>
        <input
          type="text"
          placeholder="Search college"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <div className='dropdownMenu'>
          <select value={selectedSortParam} onChange={handleSortParamChange}>
            <option value="">Select one parameter</option>
            {Object.keys(initialParameters).map(param => (
              <option key={param} value={param}>{param}</option>
            ))}
          </select>
        </div>
        <div className="table-wrapper">
          <table className="scroll-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('Rank')}>
                  NIRF RANK {sortConfig.key === 'Rank' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▲'}
                </th>
                <th onClick={() => requestSort('yourrank')}>
                  Your rank {sortConfig.key === 'yourrank' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : '▲'}
                </th>
                <th onClick={() => requestSort('college')}>
                  College Name {sortConfig.key === 'college' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
                </th>
                <th onClick={() => requestSort('Total')}>
                  Your Score {sortConfig.key === 'Total' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedFilteredRankings.map((ranking, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{parseInt(ranking.Rank)}</td>
                  <td style={{ textAlign: 'center' }}>{parseInt(ranking.yourrank) || "-"}</td>
                  <td style={{ position: 'relative', textAlign: 'center' }}>{ranking.college}
                    <button onClick={() => handleInfoButtonClick(ranking.college)} className="info-button">i</button>
                  </td>
                  <td style={{ textAlign: 'center' }}>{ranking.Total || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showAdditionalInfo && (
        <div className="additional-info-modal" style={{ top: `calc(200px + ${tableScrollTop}px)` }}>
          <button className="backButton" onClick={handleBackButtonClick}>
            <span style={{ fontSize: '24px' }}>&larr;</span> Back
          </button>
          <ChartComponent chartData={selectedCollegeChartData}/>
        </div>
      )}
    </div>
  );
};

export default MedicalRankings;
