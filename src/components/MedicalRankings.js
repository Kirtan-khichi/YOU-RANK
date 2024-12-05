import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import './styles.css';
import sliderArrow from '../assets/slider_arrow.png';
import ReactMarkdown from 'react-markdown';
import SharePopover from './SharePopover';

const initialParameters = {
  'Faculty Student Ratio': { weight: 0.3, max: 30 },
  'Faculty Quality': { weight: 0.30, max: 20 },
  'Region Diversity': { weight: 0.1, max: 30 },
  'Woman diversity': { weight: 0.1, max: 30 },
  'Peer reputation': { weight: 0.1, max: 100 },
};

const maxValues = {
  'Faculty Student Ratio': 30,
  'Faculty Quality': 20,
  'Region Diversity': 30,
  'Woman diversity': 30,
  'Peer reputation': 100,
};

const MedicalRankings = ({ compareMode }) => {
  const [rankings, setRankings] = useState([]);
  const [parameters, setParameters] = useState(initialParameters);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showSliders, setShowSliders] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sliderAnimation, setSliderAnimation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedSortParam, setSelectedSortParam] = useState('');
  const [shareableURL, setShareableURL] = useState('');

  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotContent, setChatbotContent] = useState('');

  const slidersRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("data/Medical2023Updated.csv");
        const text = await response.text();
        const { data, errors } = Papa.parse(text, { header: true });
        if (errors.length > 0) {
          console.error('Error parsing CSV:', errors);
        } else {
          setRankings(data);

          // Check if URL contains parameters
          const urlParams = new URLSearchParams(window.location.search);
          const id = urlParams.get('id');
          if (id) {
            const dehashedParams = dehashParams(id, maxValues);
            setParameters(dehashedParams);
            applyScores(dehashedParams, data);
          } else {
            applyScores(initialParameters, data);
          }
        }
      } catch (error) {
        console.error('Error fetching rankings:', error);
      }
    };
    fetchData();
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
      const weight = params[param]?.weight || 0;
      const max = initialParameters[param] ? initialParameters[param].max : undefined;
      const value = parseFloat(ranking[param]);

      if (!isNaN(value) && weight !== undefined && max !== undefined) {
        totalScore += (value / max) * weight;
        totalWeight += weight;
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
      applyScores();
    }
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

  const applyScores = async (params = parameters, data = rankings) => {
    const updatedRankings = data.map((ranking) => ({
      ...ranking,
      Total: calculateScoreWithParams(ranking, params),
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
    for (const [param, { weight }] of Object.entries(params)) {
      selectedParameters[param] = weight;
    }

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
    } catch (error) {
      console.error('Error saving scores:', error);
    }

    const shareableURL = generateShareableURL();
    console.log('Shareable URL:', shareableURL);
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

  const handleCheckboxChange = (collegeName) => {
    setSelectedColleges((prevSelectedColleges) => {
      if (prevSelectedColleges.includes(collegeName)) {
        return prevSelectedColleges.filter(name => name !== collegeName);
      } else {
        return [...prevSelectedColleges, collegeName];
      }
    });
  };

  const handleCompareButtonClick = async () => {
    if (selectedColleges.length < 2) {
      alert('Please select at least two colleges to compare.');
      return;
    }

    const apiKey = 'AIzaSyCGNPSILWN2lWLZ_lr-ZTua4V4kRIUDgo4'; // Replace with your actual API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const selectedCollegesData = selectedColleges.map(college => {
      const collegeData = rankings.find(c => c.college === college);
      return {
        name: college,
        Faculty_Student_Ratio: collegeData['Faculty Student Ratio'],
        Faculty_Quality: collegeData['Faculty Quality'],
        Region_Diversity: collegeData['Region Diversity'],
        Woman_diversity: collegeData['Woman diversity'],
        Peer_reputation: collegeData['Peer reputation'],
        Rank: collegeData.Rank,
        Score: collegeData.Score,
        City: collegeData.City,
        State: collegeData.State
      };
    });

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `Compare the following colleges based on Faculty Student Ratio, Faculty Quality, Region Diversity, Woman diversity, Peer reputation, Rank, Score, City, State:\n${selectedCollegesData.map(college => `${college.name}, Faculty Student Ratio: ${college.Faculty_Student_Ratio}, Faculty Quality: ${college.Faculty_Quality}, Region Diversity: ${college.Region_Diversity}, Woman diversity: ${college.Woman_diversity}, Peer reputation: ${college.Peer_reputation}, Rank: ${college.Rank}, Score: ${college.Score}, City: ${college.City}, State: ${college.State}`).join('\n')}`
            }
          ]
        }
      ]
    };

    console.log('API Key:', apiKey);
    console.log('API URL:', apiUrl);
    console.log('Request Data:', JSON.stringify(requestData));

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText}, ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));

      if (
        data &&
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0
      ) {
        const responseText = data.candidates[0].content.parts[0].text || 'No response text available';
        setChatbotContent(responseText);
        setChatbotOpen(true); // Open the chatbot with the comparison result
      } else {
        throw new Error('Response format is incorrect');
      }
    } catch (error) {
      console.error('Error querying API:', error);
      alert(`Sorry, something went wrong: ${error.message}`);
    }
  };

  const copyToClipboard = () => {
    const shareableURL = generateShareableURL();
    setShareableURL(shareableURL);
    console.log(shareableURL, 'hiii');
    navigator.clipboard.writeText(shareableURL)
      .catch(error => console.error("Error copying link: ", error));
  };

  const generateShareableURL = () => {
    const id = hashParams(parameters);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?id=${id}&category=Medical`;
  };

  const formatWeight = (weight) => {
    if (weight === 1) {
      return "100"; // Special case for weight equal to 1
    }
    return Math.round(weight * 100).toString().padStart(2, '0').slice(0, 2);
  };

  const hashParams = (params) => {
    let id = '';
    for (const key of Object.keys(params)) {
      id += formatWeight(params[key].weight) + ".";  // Convert weight to two digits and append comma
    }
    return id.slice(0, -1).padEnd(10, '0');  // Remove last comma and pad with zeros
  };

  const dehashParams = (id, maxValues) => {
    const keys = Object.keys(maxValues);
    const params = {};
    const weights = id.split(".");
    for (let i = 0; i < weights.length; i++) {
      const weight = parseFloat((parseInt(weights[i], 10) / 100).toFixed(2));
      const key = keys[i];
      params[key] = { weight, max: maxValues[key] };
    }
    return params;
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
          <button className="submit-button" onClick={() => applyScores(parameters)}>
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
          <button className="submit-button" onClick={() => applyScores(parameters)}>
            Calculate Score
          </button>
        </div>
      )}

      <div className={`table-container${showSliders ? 'blur' : ''}`}>
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
                <tr key={ranking.college}>
                  <td style={{ textAlign: 'center' }}>{parseInt(ranking.Rank)}</td>
                  <td style={{ textAlign: 'center' }}>{parseInt(ranking.yourrank) || "-"}</td>
                  <td style={{ position: 'relative', textAlign: 'left' }}>
                    {compareMode && (
                      <label className="custom-checkbox" style={{ marginRight: '10px' }}>
                        <input
                          type="checkbox"
                          checked={selectedColleges.includes(ranking.college)}
                          onChange={() => handleCheckboxChange(ranking.college)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    )}
                    {ranking.college}
                  </td>
                  <td style={{ textAlign: 'center' }}>{ranking.Total || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {compareMode && (
          <div className="floating-compare-button">
          <button className="compare-button" onClick={handleCompareButtonClick}>
            Compare Selected Colleges
          </button>
          </div>
        )}

        {chatbotOpen && (
          <div className="chatbot-container">
            <div className="chatbot-header">
              <span>Comparison Result</span>
              <button onClick={() => setChatbotOpen(false)} className="close-chatbot">X</button>
            </div>
            <div className="chatbot-content">
              <div className="message">
                <ReactMarkdown>{chatbotContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
        <div className="floating-share-button" onClick={copyToClipboard}>
          <SharePopover shareableURL={shareableURL} message={'Check out this medical ranking:'} />
        </div>
      </div>
    </div>
  );
};

export default MedicalRankings;
