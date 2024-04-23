import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import AboutUsPage from './components/AboutUsPage';
import MethodologyPage from './components/MethodologyPage';
import MedicalRankings from './components/MedicalRankings';
import LawRanking from './components/LawRanking';
import EngineeringRanking from './components/EngineeringRanking';
import './components/styles.css';
import logo from './assets/Urank-updated.png';
import './styles.css';
import './App.css';
import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = useState('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      const htmlElement = document.querySelector('html');
      htmlElement.classList.toggle('dark-mode', newMode); 
      return newMode; 
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  return (
    <Router>
      <div className={darkMode ? 'app-container dark-mode' : 'app-container'}>
        <div className="app-header" style={{ maxHeight: "20vh" }}>
          <img src={logo} alt="Logo" className="app-logo" style={{ width: '100px' }} />
          <div className="toggleButton" onClick={toggleDarkMode}>
            <DarkModeToggle
              mode={mode}
              onClick={toggleDarkMode}
              onChange={(mode) => setMode(mode)}
              inactiveTrackColor="#fff"
            />
          </div>
          <nav className="navbar">
            <ul className="desktop-menu">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/methodology">Methodology</Link>
              </li>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </nav>
          <div className="mobile-menu">
            <FontAwesomeIcon icon={faBars} onClick={toggleMenu} style={{ color: 'black' }} />
          </div>
        </div>
        {isMenuOpen && (
          <div className="menu">
            <ul>
              <li>
                <Link to="/" onClick={toggleMenu}>Home</Link>
              </li>
              <li>
                <Link to="/about" onClick={toggleMenu}>About Us</Link>
              </li>
              <li>
                <Link to="/methodology" onClick={toggleMenu}>Methodology</Link>
              </li>
            </ul>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/MedicalRankings" element={<MedicalRankings />} />
          <Route path="/LawRanking" element={<LawRanking />} />
          <Route path="/EngineeringRanking" element={<EngineeringRanking />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
