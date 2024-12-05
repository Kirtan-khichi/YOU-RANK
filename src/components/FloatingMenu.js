import React, { useState } from 'react';
import { FaHome, FaInfoCircle, FaMoon, FaSun, FaBars, FaBalanceScale } from 'react-icons/fa';
import './styles.css';

const FloatingMenu = ({ onHomeClick, onMethodologyClick, onAboutUsClick, onDarkModeToggle, isDarkMode, onCompareClick, showCompareButton }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="floating-menu">
      <button className="floating-button" onClick={toggleMenu}>
        <FaBars />
      </button>
      {isOpen && (
        <div className="menu-options">
          <button className="menu-option" onClick={onHomeClick}><FaHome /> Home</button>
          <button className="menu-option" onClick={onMethodologyClick}><FaInfoCircle /> Methodology</button>
          <button className="menu-option" onClick={onAboutUsClick}><FaInfoCircle /> About Us</button>
          {showCompareButton && <button className="menu-option" onClick={onCompareClick}><FaBalanceScale /> Compare</button>}
          <div className="menu-option">
            {isDarkMode ? <FaMoon style={{ marginRight: '10px' }} /> : <FaSun style={{ marginRight: '10px' }} />}
            <label className="switch">
              <input type="checkbox" checked={isDarkMode} onChange={onDarkModeToggle} />
              <span className="toggle-switch"></span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingMenu;
