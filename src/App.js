import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Home from './components/Home';
import Rankings from './components/Rankings';
import OverallRankings from './components/OverallRankings';
import MedicalRankings from './components/MedicalRankings';
import LawRanking from './components/LawRanking';
import EngineeringRanking from './components/EngineeringRanking';
import FileUpload from './components/FileUpload'; 
import './components/styles.css'; 
import logo from './assets/youRankLogo.png'; 

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="app-header">
          <img src={logo} alt="Logo" className="app-logo" /> 
          <h1 className="app-title">U-rank</h1>
        </div>
        <Routes> 
          <Route path="/" element={<Home />} /> 
          <Route path="/rankings" element={<Rankings />} /> 
          <Route path="/upload" element={<FileUpload />} /> 
          <Route path="/overallRankings" element={<OverallRankings />} /> 
          <Route path="/MedicalRankings" element={<MedicalRankings />} /> 
          <Route path="/LawRanking" element={<LawRanking />} /> 
          <Route path="/EngineeringRanking" element={<EngineeringRanking />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;