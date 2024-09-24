import React, { useState, useEffect } from 'react';

// Sample games (pen game, open/close, etc.)
export const games = [
  { name: "The Pen Game", rule: "I can play the game if I say 'pen'" },
  { name: "Open/Close", rule: "You can say 'open' if the word has an 'o'" },
  { name: "Black Magic", rule: "The answer is the second object after the color black is mentioned" },
];

const AIAssistants = ({ assistantName, currentGame, onPlayerInput, onAssistantResponse }) => {
  const [response, setResponse] = useState('');

  // Simulates an AI assistant responding
  useEffect(() => {
    if (currentGame) {
      const randomResponse = `Playing ${currentGame.name}. The rule is: "${currentGame.rule}"`;
      setResponse(randomResponse);
      onAssistantResponse(randomResponse);
    }
  }, [currentGame, onAssistantResponse]);

  return (
    <div className="assistant-container">
      <h2>{assistantName}</h2>
      <p>{response}</p>
      <input
        type="text"
        placeholder="Your input..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onPlayerInput(e.target.value);
            e.target.value = ''; // Clear input
          }
        }}
      />
    </div>
  );
};

export default AIAssistants;