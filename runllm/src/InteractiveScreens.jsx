import React, { useState } from 'react';
import './InteractiveScreens.css';

const InteractiveScreens = () => {
  const [leftText, setLeftText] = useState('');
  const [centerText, setCenterText] = useState('');
  const [rightText, setRightText] = useState('');
  const [output, setOutput] = useState(''); // State for output display

  // Handler to update output based on conditions
  const handleTextChange = (screen, value) => {
    if (screen === 'left') {
      setLeftText(value);
      // Conditional logic for left screen
      if (value.includes('hello')) {
        setOutput('Greeting detected on the left screen!');
      } else {
        setOutput('');
      }
    } else if (screen === 'center') {
      setCenterText(value);
      // Conditional logic for center screen
      if (value === '123') {
        setOutput('Secret code entered on the center screen!');
      } else {
        setOutput('');
      }
    } else if (screen === 'right') {
      setRightText(value);
      // Conditional logic for right screen
      if (value.toLowerCase() === 'magic') {
        setOutput('Magic word found on the right screen!');
      } else {
        setOutput('');
      }
    }
  };

  return (
    <div className="container">
      <div className="screen left-screen">
        <textarea
          value={leftText}
          onChange={(e) => handleTextChange('left', e.target.value)}
          className="interactive-area"
          placeholder="Type here..."
        />
      </div>
      <div className="screen center-screen">
        <textarea
          value={centerText}
          onChange={(e) => handleTextChange('center', e.target.value)}
          className="interactive-area"
          placeholder="Type here..."
        />
      </div>
      <div className="screen right-screen">
        <textarea
          value={rightText}
          onChange={(e) => handleTextChange('right', e.target.value)}
          className="interactive-area"
          placeholder="Type here..."
        />
      </div>
      <div className="output-display">
        <p>{output}</p>
      </div>
    </div>
  );
};

export default InteractiveScreens;