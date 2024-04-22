import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Medical from '../assets/Medical.png';
import Law from '../assets/Law_WL.png';
import Engneering from '../assets/Eng_WL.png';
import './Home.css';

const Home = () => {
  
  

  return (
    <div className='home'>
      <h2 style={{ textAlign: 'center' }}>Welcome to URank</h2>
      <p style={{ textAlign: 'center' }}>
        Univeristy rankings cannot be one-size-fits-all.
      </p>
      <p style={{ textAlign: 'center' }}>
        Introducing URank where <b>YOU</b> choose the parameters and generate rankings.
      </p>
      <div className="button-container">
        {/* <Link to="/overallRankings" className="button-link">
          <img src={overallRankingIcon} alt="Overall Rankings" />
          <div className="button-label">Overall Rankings</div>
        </Link> */}
        <Link to="/EngineeringRanking" className="button-link">
          <img src={Engneering} alt="Engineering Rankings" />
          <div className="button-label">Engineering</div>
        </Link>
        <Link to="/MedicalRankings" className="button-link">
          <img src={Medical} alt="Medical Rankings" />
          <div className="button-label">Medical</div>
        </Link>
        <Link to="/LawRanking" className="button-link">
          <img src={Law} alt="Law Rankings" />
          <div className="button-label">Law</div>
        </Link>
      </div>
      <footer>
        We store the IP address of the user for curating statistics of choice of parameters. Data Source: NIRF 2023, Retraction Watch Database
      </footer>
    </div>
  );
};

export default Home;
