import React, { useState } from "react";

const PatternRecognitionGame: React.FC<{ onComplete: (isCorrect: boolean) => void }> = ({ onComplete }) => {
  const patterns = [
    { sequence: [1, 2, 4, 8], correctAnswer: "16" }, // Doubling
    { sequence: [3, 6, 9, 12], correctAnswer: "15" }, // Add 3
    { sequence: [2, 4, 8, 16], correctAnswer: "32" }, // Powers of 2
    { sequence: [1, 1, 2, 3, 5], correctAnswer: "8" }, // Fibonacci
  ];

  const [currentPattern] = useState(patterns[Math.floor(Math.random() * patterns.length)]);
  const [playerAnswer, setPlayerAnswer] = useState("");

  const handleSubmit = () => {
    const isCorrect = playerAnswer.trim() === currentPattern.correctAnswer;

    if (isCorrect) {
      alert("Correct! You've recognized the pattern.");
      onComplete(true);
    } else {
      alert("Incorrect. Look closer at the sequence.");
      onComplete(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>What comes next in the sequence?</h3>
      <p>{currentPattern.sequence.join(", ")}, ...?</p>
      <input
        type="text"
        value={playerAnswer}
        onChange={(e) => setPlayerAnswer(e.target.value)}
        placeholder="Your answer"
        style={{ padding: "10px", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "4px" }}
      />
      <button
        onClick={handleSubmit}
        style={{ padding: "10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "4px" }}
      >
        Submit
      </button>
    </div>
  );
};

export default PatternRecognitionGame;