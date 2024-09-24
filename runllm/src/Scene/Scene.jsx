import React from 'react';
import LeftScreen from '../InteractiveScreens/LeftScreen';
import CenterScreen from '../InteractiveScreens/CenterScreen';
import RightScreen from '../InteractiveScreens/RightScreen';
import './Scene.css';

const Scene = ({ onMessageSend }) => {
  return (
    <div className="room">
      {/* Left screen overlaying the background monitor */}
      <div className="overlay left-screen-overlay">
        <LeftScreen onMessageSend={onMessageSend} />
      </div>

      {/* Center screen overlaying the background monitor */}
      <div className="overlay center-screen-overlay">
        <CenterScreen onMessageSend={onMessageSend} />
      </div>

      {/* Right screen overlaying the background device */}
      <div className="overlay right-screen-overlay">
        <RightScreen onMessageSend={onMessageSend} />
      </div>
    </div>
  );
};

export default Scene;