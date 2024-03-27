import React from 'react';
import { Link } from 'react-router-dom';
import overallRankingIcon from '../assets/Overall_WL.png'; 
import Medical from '../assets/Medical.png'; 
import Law from '../assets/Law_WL.png'; 
import Engneering from '../assets/Eng_WL.png'; 

const Home = () => {
  return (
    <div>
      <h2>Welcome to Yourank</h2>
      <p>
        Yourank is a platform where you can view NIRF rankings and compare them
        with your own rankings.
      </p>
      <p>
        To see the Rankings click on the circle of the particular field.
      </p>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/overallRankings">
          <img src={overallRankingIcon} alt="Overall Rankings" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #000', padding: '5px', marginBottom: '10px' }} />
        </Link>
        <br />
        <div style={{ color: '#605746' }}>Overall Rankings</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/EngineeringRanking">
          <img src={Engneering} alt="Engineering Rankings" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #000', padding: '5px', marginBottom: '10px' }} />
        </Link>
        <br />
        <div style={{ color: '#605746' }}>Engineering Rankings</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/MedicalRankings">
          <img src={Medical} alt="Medical Rankings" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #000', padding: '5px', marginBottom: '10px' }} />
        </Link>
        <br />
        <div style={{ color: '#605746' }}>Medical Rankings</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/LawRanking">
          <img src={Law} alt="Law Rankings" style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #000', padding: '5px', marginBottom: '10px' }} />
        </Link>
        <br />
        <div style={{ color: '#605746' }}>Law Rankings</div>
      </div>
    </div>
  );
};

export default Home;
