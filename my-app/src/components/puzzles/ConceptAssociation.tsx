import React, { useState } from "react";

const ConceptAssociationGame: React.FC<{ onComplete: (isCorrect: boolean) => void }> = ({ onComplete }) => {
  const pairs = [
    { word1: "fire", word2: "water", connection: "opposites" },
    { word1: "tree", word2: "nest", connection: "habitat" },
    { word1: "light", word2: "shadow", connection: "contrast" },
    { word1: "key", word2: "lock", connection: "function" },
  ];

  const [currentPair] = useState(pairs[Math.floor(Math.random() * pairs.length)]);
  const [playerAnswer, setPlayerAnswer] = useState("");

  const handleSubmit = () => {
    const isCorrect = currentPair.connection.toLowerCase() === playerAnswer.trim().toLowerCase();

    if (isCorrect) {
      alert("Correct! Great association.");
      onComplete(true);
    } else {
      alert(`Incorrect. The correct connection was '${currentPair.connection}'.`);
      onComplete(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>What is the connection?</h3>
      <p>
        <strong>{currentPair.word1}</strong> and <strong>{currentPair.word2}</strong>
      </p>
      <input
        type="text"
        value={playerAnswer}
        onChange={(e) => setPlayerAnswer(e.target.value)}
        placeholder="Your answer"
        style={{ padding: "10px", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "4px" }}
      />
      <button
        onClick={handleSubmit}
        style={{ padding: "10px", backgroundColor: "purple", color: "white", border: "none", borderRadius: "4px" }}
      >
        Submit
      </button>
    </div>
  );
};

export default ConceptAssociationGame;