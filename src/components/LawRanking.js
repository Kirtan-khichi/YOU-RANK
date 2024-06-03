import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import './styles.css';
import sliderArrow from '../assets/slider_arrow.png';
import SharePopover from './SharePopover';


const initialParameters = {
  'Faculty Student Ratio': { weight: 0.3, max: 30 },
  'Faculty Quality': { weight: 0.30, max: 20 },
  'Median Salary': { weight: 0.2, max: 25 },
  'Region Diversity': { weight: 0.1, max: 30 },
  'Woman diversity': { weight: 0.1, max: 30 },
  'Peer reputation': { weight: 0.1, max: 100 },
};

const LawRanking = () => {
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
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  

  const slidersRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("data/updatedLawRanking2023.csv");
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

    
    fetchData();
  //   fetchAdditionalData();
  }, []);

  const hasCheckedURLParameters = useRef(false);

  useEffect(() => {
    const checkURLParameters = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedParams = urlParams.get('params');
      if (sharedParams) {
        const parsedParams = JSON.parse(decodeURIComponent(sharedParams));
        setParameters(parsedParams);
  
        const updatedRankings = rankings.map((ranking) => {
          const totalScore = calculateScoreWithParams(ranking, parsedParams);
          // console.log('Ranking:', ranking);
          // console.log('Total Score:', totalScore);
          
          return {
            ...ranking,
            Total: totalScore,
          };
        });
        
  
        const sortedRankings = [...updatedRankings].sort((a, b) => b.Total - a.Total);
  
        const rankedRankings = sortedRankings.map((ranking, index) => ({
          ...ranking,
          yourrank: index + 1,
        }));
  
        setRankings(rankedRankings);
      }
    };
  
    if (rankings.length > 0 && !hasCheckedURLParameters.current) {
      checkURLParameters();
      hasCheckedURLParameters.current = true;
    }
  }, [rankings]);
  


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

  const calculateScoreWithParams = (ranking, params) => {
    let totalScore = 0;
    let totalWeight = 0;
  
    for (const param in params) {
      const weight = params[param].weight;
      const max = initialParameters[param].max;
      const value = parseFloat(ranking[param]); // Convert to float
  
      if (!isNaN(value) && weight !== undefined && max !== undefined) {
        totalScore += (value / max) * weight;
        totalWeight += weight;
      } else {
        // Handle cases where value is not a valid number
        console.warn(`Invalid value for parameter "${param}": ${ranking[param]}`);
      }
    }
  
    if (totalWeight === 0) {
      return 0;
    }
  
    return ((totalScore / totalWeight) * 100).toFixed(2);
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
    } else {
      setSelectedSortParam("");
      setSelectedRankingParam("");
      applyScores();
    }
  };

  const handleBackButtonClick = () => {
    setShowAdditionalInfo(false);
  };

  const handleSliderChange = (param, value) => {
    setParameters((prevParameters) => ({
      ...prevParameters,
      [param]: {
        ...prevParameters[param],
        weight: parseFloat(value)
      }
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

    setShowSliders(false);
    setSliderAnimation(false);

    const selectedParameters = {};
    for (const [param, { weight }] of Object.entries(parameters)) {
      selectedParameters[param] = weight;
    }

    try {
      const response = await fetch('https://ach4l.pythonanywhere.com/urank_eng', {
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

  useEffect(() => {
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

const handleInfoButtonClick = (collegeName) => {
  // Define the logic for handling info button click
  const selectedData = additionalData.filter((item) => item.College === collegeName);
  setSelectedCollegeData(selectedData);

  const chartDataArray = [];
  const labels = Object.keys(selectedData[0]).filter((key) => key !== 'College');
  const data = labels.map((label) => parseInt(selectedData[0][label], 10) || 0);
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  chartDataArray.push(chartData);

  setSelectedCollegeChartData(chartDataArray);
  setShowAdditionalInfo(true);
};

const copyToClipboard = () => {
  const shareableURL = generateShareableURL();
  navigator.clipboard.writeText(shareableURL)
    .catch(error => console.error("Error copying link: ", error));
};
// Function to generate URL with selected parameters
const generateShareableURL = () => {
  const urlParams = new URLSearchParams();
  urlParams.append('params', JSON.stringify(parameters));
  const baseUrl = window.location.origin + window.location.pathname;
  const shareableURL = baseUrl + '?' + urlParams.toString();
  return shareableURL;
};


  return (
    <div className={`overall-rankings`}>
  {isMobile && (
    <div className="show-sliders-mobile">
      <button onClick={toggleSliders} className='button-text increase-width'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Change Parameters </b> &nbsp;<img src={sliderArrow} alt="" className="sliderarrow" />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
    </div>
  )}
  {showSliders && (
    <div className={`sliders-container ${sliderAnimation ? 'show' : ''}`} ref={slidersRef}>
      <div className="sliders-overlay" onClick={toggleSliders}></div>
      <button className="submit-button" onClick={applyScores}>
        Calculate Score
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
    {isMobile ? (
      <a href="#sliders-content" onClick={toggleSliders}>
        <h4 style={{ textAlign: 'center' }} className='disclaimer'>
          <img src={sliderArrow} alt="" className="sliderarrow" style={{ transform: 'rotate(90deg)' }} />
          Choose what's important for you
          <h6>*Data Source: NIRF 2023, Retraction Watch Database</h6>
        </h4>        
      </a>
    ) : (
      <h4 style={{ textAlign: 'center' }}>Choose what's important for you 
        <h6>*Data Source: NIRF 2023, Retraction Watch Database</h6>
      </h4>
    )}

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
  <div className="table-wrapper" ref={tableRef}>
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
          <tr key={index} onClick={() => handleInfoButtonClick(ranking.college)}>
            <td style={{ textAlign: 'center' }}>{parseInt(ranking.Rank)}</td>
            <td style={{ textAlign: 'center' }}>{parseInt(ranking.yourrank) || "-"}</td>
            <td style={{ position: 'relative', textAlign: 'center' }}>{ranking.college}
            </td>            
            <td style={{ textAlign: 'center' }}>{ranking.Total || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

<div className="floating-share-button" onClick={copyToClipboard}>
  <button>
    {/* <i  className="fa fa-share-alt" /> Close the <i> tag properly */}
    <SharePopover generateShareableURL={generateShareableURL} />
  </button>
</div>

   </div>
  );
};

export default LawRanking;