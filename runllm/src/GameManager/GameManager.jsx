import React from 'react';
import Scene from '../Scene/Scene';

const ALICE_API_URL = 'http://localhost:5001/api/alice';
const BOB_API_URL = 'http://localhost:5001/api/bob';

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
  const handleMessageSend = async (screen, message) => {
    if (screen === 'left') {
      return await sendMessageToAssistant('alice', message);
    } else if (screen === 'center') {
      const response = message.startsWith('Alice:')
        ? await sendMessageToAssistant('alice', message.replace('Alice:', ''))
        : await sendMessageToAssistant('bob', message.replace('Bob:', ''));
      return response;
    } else if (screen === 'right') {
      return await sendMessageToAssistant('bob', message);
    } else {
      return 'No specific assistant for this screen.';
    }
  };

  return (
    <div className="game-manager">
      <Scene onMessageSend={handleMessageSend} />
    </div>
  );
};

export default GameManager;
