import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Home from './components/Home';
import Rankings from './components/Rankings';
import OverallRankings from './components/OverallRankings';
import FileUpload from './components/FileUpload'; 
import './components/styles.css'; // Import the CSS file
import logo from './assets/youRankLogo.png'; // Import the image file

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="app-header">
          <img src={logo} alt="Logo" className="app-logo" /> {/* Insert the image */}
          <h1 className="app-title">Yourank</h1>
        </div>
        <Routes> 
          <Route path="/" element={<Home />} /> 
          <Route path="/rankings" element={<Rankings />} /> 
          <Route path="/upload" element={<FileUpload />} /> 
          <Route path="/overallRankings" element={<OverallRankings />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;