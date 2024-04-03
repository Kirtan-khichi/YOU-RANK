import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import overallRankingIcon from '../assets/Overall_WL.png';
import Medical from '../assets/Medical.png';
import Law from '../assets/Law_WL.png';
import Engneering from '../assets/Eng_WL.png';
import './Home.css';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);

  

  return (
    <div className='home'>
      <h2 style={{ textAlign: 'center' }}>Welcome to U-rank</h2>
      <p style={{ textAlign: 'center' }}>
        U-rank is a platform where you can view NIRF rankings and compare them with your own rankings.
      </p>
      <p style={{ textAlign: 'center' }}>
        To see the Rankings click on the circle of the particular field.
      </p>
      <div className="button-container">
        <Link to="/overallRankings" className="button-link">
          <img src={overallRankingIcon} alt="Overall Rankings" />
          <div className="button-label">Overall Rankings</div>
        </Link>
        <Link to="/EngineeringRanking" className="button-link">
          <img src={Engneering} alt="Engineering Rankings" />
          <div className="button-label">Engineering Rankings</div>
        </Link>
        <Link to="/MedicalRankings" className="button-link">
          <img src={Medical} alt="Medical Rankings" />
          <div className="button-label">Medical Rankings</div>
        </Link>
        <Link to="/LawRanking" className="button-link">
          <img src={Law} alt="Law Rankings" />
          <div className="button-label">Law Rankings</div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
