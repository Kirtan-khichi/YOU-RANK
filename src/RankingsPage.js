import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './styles.css'; 

const parameters = {
  Faculty: 'Faculty',
  Fees: 'Fees',
  SS: 'Student Strength',
  FSR: 'Faculty Student Ratio',
  FQE: 'Faculty Quality',
  FRU: 'Financial Resources and Utilisation',
  PU: 'Combined Metric for Publications',
  QP: 'Quality of Publications',
  IPR: 'IPR and Patents',
  FPPP: 'Footprints of Projects and Professional Practice',
  GPH: 'Placement and Higher Studies',
  GUE: 'University Examination',
  GMS: 'Median Salary',
  GPHD: 'Number of PhD students',
  RD: 'Region Diversity',
  WD: 'Women Diversity',
  ESCS: 'Economically and Socially challenged',
  PCS: 'Facilities for Physically challenged',
  PR: 'Peer Perception',
  Total: 'Total'
};

function RankingsPage() {
  const [data, setData] = useState([]);
  const [selectedParameter, setSelectedParameter] = useState('Original Total');
  const [sortOrder, setSortOrder] = useState('desc');
  const [rankings, setRankings] = useState([]);
  const [selectedFullParameter, setSelectedFullParameter] = useState(parameters[selectedParameter]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/test.csv');
        const result = await response.text();
        const parsedData = Papa.parse(result, { header: true }).data;
        setData(parsedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedParameter && data.length > 0) {
      const sortedData = [...data].sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[selectedParameter] - b[selectedParameter];
        } else {
          return b[selectedParameter] - a[selectedParameter];
        }
      });
      setRankings(sortedData);
    }
  }, [selectedParameter, sortOrder, data]);

  const handleParameterChange = (event) => {
    const selectedParam = event.target.value;
    setSelectedParameter(selectedParam);
    setSelectedFullParameter(parameters[selectedParam]);
  };
  console.log(selectedParameter);

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const excludedParameters = ["Original Rank", "New Rank", "Change", "Original Total", "College", 'Total'];
  const parameterOptions = data.length > 0 ? Object.keys(data[0]).filter(param => !excludedParameters.includes(param)) : [];

  return (
    <div className="container">
      <div className="form-group">
        <label htmlFor="parameter" className="label">Select Parameter:</label>
        <select id="parameter" value={selectedParameter} onChange={handleParameterChange} className="select">
          <option value="Original Total">Nirf Ranking</option>
          {parameterOptions.map(param => (
            <option key={param} value={param}>{parameters[param]}</option>
          ))}
        </select>
      </div>
      <div className="rankings">
        <h2>Ranking based on {selectedFullParameter}</h2>
        <table>
          <thead>
            <tr>
              <th>SR No.</th>
              <th>College</th>
              <th>{selectedParameter} 
                {selectedParameter && (
                  <div className="arrow-icons">
                    {sortOrder === 'asc' ? (
                      <FaArrowUp onClick={handleSortOrderChange} />
                    ) : (
                      <FaArrowDown onClick={handleSortOrderChange} />
                    )}
                  </div>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.College}</td>
                <td>{item[selectedParameter]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RankingsPage;
