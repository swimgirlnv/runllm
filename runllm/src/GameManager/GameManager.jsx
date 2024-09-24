import React, { useState } from 'react';
import InteractiveScreens from '../InteractiveScreens/InteractiveScreens';

// URLs for backend endpoints
const ALICE_API_URL = 'http://localhost:5001/api/alice';
const BOB_API_URL = 'http://localhost:5001/api/bob';

// Function to call the backend and get responses from Alice or Bob
const sendMessageToAssistant = async (assistant, message) => {
  const url = assistant === 'alice' ? ALICE_API_URL : BOB_API_URL;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error(`Error communicating with ${assistant}:`, error);
    return 'Sorry, there was an error processing your message.';
  }
};

const GameManager = () => {
  // Handle message sending logic to either Alice or Bob
  const handleMessageSend = async (screen, message) => {
    let assistant;
    // Assign assistants based on which screen is used
    if (screen === 'left') {
      assistant = 'alice';
    } else if (screen === 'center') {
      assistant = 'bob';
    } else {
      return 'No specific assistant for this screen.';
    }

    // Get the response from the backend
    return await sendMessageToAssistant(assistant, message);
  };

  return (
    <div className="game-manager">
      <InteractiveScreens onMessageSend={handleMessageSend} />
    </div>
  );
};

export default GameManager;
