import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import AboutUsPage from './components/AboutUsPage';
import MethodologyPage from './components/MethodologyPage';
import MedicalRankings from './components/MedicalRankings';
import LawRanking from './components/LawRanking';
import EngineeringRanking from './components/EngineeringRanking';
import ManagementRanking from './components/ManagementRanking';
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
      <meta name="description" content="Welcome to U Rank, your premier destination for accessing the best university rankings tailored to your preferences. Here at U Rank, we empower users with personalized insights, ensuring you discover the top-ranked institutions that align with your specific criteria.
Diving into our methodology, we pride ourselves on leveraging the esteemed NIRF 2023 rankings for most parameters, including those defining the best university rankings. Trust in U Rank as we deliver rankings grounded in the comprehensive assessment criteria outlined by NIRF. For a deeper dive into our methodology, explore the NIRF Parameters section on our platform.
In our commitment to transparency and innovation, U Rank introduces a groundbreaking approach to evaluating research quality. Utilizing the NIRF parameter for Research Quality, we integrate a penalty system for institutions with retractions. Our meticulously calculated penalty formula ensures that any institution with retractions faces a proportional deduction in their research points. This reinforces accountability and integrity within the academic community, setting a new standard for best university rankings.
At U Rank, we're not just pioneering a new approach; we're setting the benchmark for excellence in rankings worldwide. Our data sources, including NIRF 2023 and the Retraction Watch Database, are carefully curated to ensure reliability and accuracy, making U Rank your trusted partner in informed decision-making.
Experience the difference with U Rank as we redefine what it means to discover the best university rankings. Join us on a journey to unlock the full potential of academic excellence and integrity. Start exploring today!" />
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
          <Route path="/ManagementRanking" element={<ManagementRanking />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
