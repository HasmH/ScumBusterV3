import React from 'react';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <h1 className="logo">ScumBuster</h1>
      <input type="text" className="search-bar" placeholder="Enter URL of suspicious gamer" />
    </div>
  );
}

export default LandingPage;