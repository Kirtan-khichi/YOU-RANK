/* global dataLayer */

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Add Google Analytics script dynamically
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-J3754YT1LQ';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-J3754YT1LQ');

    return () => {
      // Cleanup function to remove the script when the component unmounts
      document.head.removeChild(script);
    };
  }, []);

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
          <button onClick={toggleDarkMode} className='toggleButton' style={{ top: "18vh", right:"auto", position: 'absolute', zIndex: 999, borderRadius: "0%"}}>
            {darkMode ? (
              <i className="fas fa-sun" style={{ fontSize: '24px' }}> Light</i>
            ) : (
              <i className="fas fa-moon" style={{ fontSize: '20px' }}> Dark</i>
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
