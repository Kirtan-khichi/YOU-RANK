import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import MedicalRankings from './components/MedicalRankings';
import LawRanking from './components/LawRanking';
import EngineeringRanking from './components/EngineeringRanking';
import './components/styles.css';
import logo from './assets/Urank-updated.png';
import './styles.css';




const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      const htmlElement = document.querySelector('html');
      htmlElement.classList.toggle('dark-mode', newMode); 
      return newMode; 
    });
  };

  return (
    <Router>
      <div className={darkMode ? 'app-container dark-mode' : 'app-container'}>
        <div className="app-header" style={ {maxHeight:"20vh"}}>
          <img src={logo} alt="Logo" className="app-logo" style={ {width: '100px'}} />
          {/* <h1 className="app-title">U-rank</h1> */}
          {/* <button onClick={toggleDarkMode}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button> */}

          <button onClick={toggleDarkMode} className='toggleButton' style={{ top: "18vh", right:"auto", position: 'absolute', zIndex: 999, borderRadius: "0%"}}>{darkMode ? (
          <i className="fas fa-sun" style={{ fontSize: '24px' }}> Light</i> // Light mode icon
        ) : (
          <i className="fas fa-moon" style={{ fontSize: '20px' }}> Dark</i> // Dark mode icon
        )}
        </button>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MedicalRankings" element={<MedicalRankings />} />
          <Route path="/LawRanking" element={<LawRanking />} />
          <Route path="/EngineeringRanking" element={<EngineeringRanking />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
