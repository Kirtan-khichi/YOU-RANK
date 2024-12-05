import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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
import FloatingMenu from './components/FloatingMenu';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  const [compareMode, setCompareMode] = useState(false);
  const [showCompareButton, setShowCompareButton] = useState(false);

  const checkIfRankingPage = (pathname) => {
    const rankingRoutes = [
      '/MedicalRankings',
      '/LawRanking',
      '/EngineeringRanking',
      '/ManagementRanking'
    ];
    return rankingRoutes.includes(pathname);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const pathname = window.location.pathname;
      setShowCompareButton(checkIfRankingPage(pathname));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    const htmlElement = document.querySelector('html');
    htmlElement.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      const htmlElement = document.querySelector('html');
      htmlElement.classList.toggle('dark-mode', newMode);
      return newMode;
    });
  };

  const navigateToHome = () => {
    window.location.href = '/';
  };

  const navigateToMethodology = () => {
    window.location.href = '/methodology';
  };

  const navigateToAboutUs = () => {
    window.location.href = '/about';
  };

  const toggleCompareMode = () => {
    setCompareMode(prevCompareMode => !prevCompareMode);
  };

  return (
    <Router>
      <meta
        name="description"
        content="Welcome to U Rank, your premier destination for accessing the best university rankings tailored to your preferences..."
      />
      <div className={darkMode ? 'app-container dark-mode' : 'app-container'}>
        <div className="app-header" style={{ maxHeight: '20vh' }}>
          <img src={logo} alt="Logo" className="app-logo" style={{ width: '100px' }} />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/methodology" element={<MethodologyPage />} />
          <Route path="/MedicalRankings" element={<MedicalRankings compareMode={compareMode} />} />
          <Route path="/LawRanking" element={<LawRanking compareMode={compareMode} />} />
          <Route path="/EngineeringRanking" element={<EngineeringRanking compareMode={compareMode} />} />
          <Route path="/ManagementRanking" element={<ManagementRanking compareMode={compareMode} />} />
        </Routes>
        <FloatingMenu
          onHomeClick={navigateToHome}
          onMethodologyClick={navigateToMethodology}
          onAboutUsClick={navigateToAboutUs}
          onDarkModeToggle={toggleDarkMode}
          isDarkMode={darkMode}
          onCompareClick={toggleCompareMode}
          showCompareButton={showCompareButton}
        />
      </div>
    </Router>
  );
};

export default App;
