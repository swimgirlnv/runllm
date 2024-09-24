import React from 'react';
import './Scene.css'; // Ensure to create this CSS file for styles

const Scene = () => {
  return (
    <div className="room">
      <div className="poster">
        <img
          src="https://i.imgur.com/nB9jIUp.png"
          alt="Dolphin Poster"
          className="poster-image"
        />
      </div>
      <div className="monitor-container">
        <div className="small-monitor">
          {/* Content for the small monitor can go here */}
        </div>
        <div className="large-monitor">
          {/* Content for the large monitor can go here */}
          <div className="sticky left-sticky"></div>
          <div className="sticky left-sticky"></div>
          <div className="sticky right-sticky"></div>
          <div className="sticky right-sticky"></div>
          <div className="sticky right-sticky"></div>
        </div>
        <div className="side-device">
          {/* Content for the side device can go here */}
        </div>
      </div>
    </div>
  );
};

export default Scene;
