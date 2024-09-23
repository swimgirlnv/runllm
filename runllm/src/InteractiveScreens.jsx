import React, { useState } from 'react';
import './InteractiveScreens.css'; // Create this file for styling

const InteractiveScreens = () => {
  const [leftText, setLeftText] = useState('');
  const [centerText, setCenterText] = useState('');
  const [rightText, setRightText] = useState('');

  return (
    <div className="container">
      <div className="screen left-screen">
        <textarea 
          value={leftText}
          onChange={(e) => setLeftText(e.target.value)}
          className="interactive-area"
          placeholder="Type here..."
        />
      </div>
      <div className="screen center-screen">
        <textarea 
          value={centerText}
          onChange={(e) => setCenterText(e.target.value)}
          className="interactive-area"
          placeholder="Type here..."
        />
      </div>
      <div className="screen right-screen">
        <textarea 
          value={rightText}
          onChange={(e) => setRightText(e.target.value)}
          className="interactive-area"
          placeholder="Type here..."
        />
      </div>
    </div>
  );
};

export default InteractiveScreens;