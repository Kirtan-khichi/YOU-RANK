import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Home from './components/Home';
import Rankings from './components/Rankings';
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './FrontPage';
import RankingsPage from './RankingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/rankings" element={<RankingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

>>>>>>> 372aa50575d2cdabe90d8bd7ef94cd3c5e1acc60
