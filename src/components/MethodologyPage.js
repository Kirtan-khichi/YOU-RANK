import React from 'react';
import './MethodologyPage.css'; // Import the CSS file for styling

const MethodologyPage = () => {
  return (
    <div className="methodology-container">
      <h2 className="methodology-heading">Methodology</h2>
      <div className="methodology-content">
        <p>
          All our parameters (except Research) are currently from NIRF 2023 rankings. You can read about how those parameters have been calculated directly on the NIRF website - <a href="https://www.nirfindia.org/Parameter" target="_blank" rel="noopener noreferrer" className="link">NIRF Parameters</a>.
        </p>
        <p>
          For research, we are using the NIRF parameter for Research Quality. We have also given a penalty for institutes which have retractions. The full dataset of all the retractions from the universities in our rankings can be found <a href="https://docs.google.com/spreadsheets/d/1H9BJwaU-OJDE_e-R-NMG16iRv8tNfP-Pp9jzVI3U3-M/edit#gid=0" target="_blank" rel="noopener noreferrer" className="link">here</a>.
        </p>
        <p>
          The penalty is calculated as follows:
        </p>
        <p>
          Penalty percentage = Number of Retractions / Number of Faculty * 100 * 3
        </p>
        <p>
          This means that if 10% of the faculty have retractions, then the college will be penalised 50% of their research points.
        </p>
        <p>
          We are the first rankings to propose this and we hope this becomes the norm for other rankings going ahead.
        </p>
      </div>
    </div>
  );
};

export default MethodologyPage;
