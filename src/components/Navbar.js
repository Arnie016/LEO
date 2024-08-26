import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/help">Help</Link></li>
        <li><Link to="/options">Options</Link></li>
        <li><Link to="/graph">View Graph</Link></li>
        <li><a href="https://www.theventilator.org/leo-the-global-crisis-ventilator" target="_blank" rel="noopener noreferrer">Leo</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
