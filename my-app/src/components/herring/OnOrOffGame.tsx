import React, { useState, useEffect } from "react";

const generateRandomGrid = (rows: number, cols: number) =>
  Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => Math.random() > 0.5) // Randomly assign true (on) or false (off)
    );

const OnOrOffGame: React.FC<{ onComplete: (stats: { trained: boolean; time: number; ruleMatch: boolean }) => void }> = ({ onComplete }) => {
  const [grid, setGrid] = useState<boolean[][]>(generateRandomGrid(4, 4));
  const [streak, setStreak] = useState(0);
  const [startTime] = useState(Date.now());
  const [showRuleInput, setShowRuleInput] = useState(false);
  const [userRuleInput, setUserRuleInput] = useState("");

  useEffect(() => {
    // Initialize a new random grid every time the component mounts
    setGrid(generateRandomGrid(4, 4));
  }, []);

  const evaluateAnswer = (answer: "on" | "off") => {
    const leftSide = grid.flatMap((row) => row.slice(0, Math.floor(row.length / 2)));
    const rightSide = grid.flatMap((row) => row.slice(Math.ceil(row.length / 2)));

    const leftOnCount = leftSide.filter((cell) => cell).length;
    const rightOnCount = rightSide.filter((cell) => cell).length;

    const correctAnswer = leftOnCount > rightOnCount ? "on" : "off";

    if (answer === correctAnswer) {
      alert("Correct!");
      const newStreak = streak + 1;
      setStreak(newStreak);

      if (newStreak >= 10) {
        setShowRuleInput(true); // Prompt the user to explain the rules
      } else {
        setGrid(generateRandomGrid(4, 4)); // Load a new random grid
      }
    } else {
      alert("Incorrect. Try again!");
      setStreak(0); // Reset streak
      setGrid(generateRandomGrid(4, 4)); // Load a new random grid
    }
  };

  const handleRuleSubmission = () => {
    // const actualRule = "The side with more lights determines the answer: 'On' for left, 'Off' for right.";
    const ruleMatch = userRuleInput.toLowerCase().includes("left") && userRuleInput.toLowerCase().includes("right");
  
    const totalTime = (Date.now() - startTime) / 1000; // Calculate time in seconds
  
    onComplete({
      trained: true,
      time: totalTime,
      ruleMatch,
    });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", background: 'white', borderRadius: '8px'}}>
      <h3>Are the lights On or Off?</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${grid[0].length}, 50px)`,
          gap: "5px",
          justifyContent: "center",
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: cell ? "yellow" : "gray",
                border: "1px solid black",
              }}
            />
          ))
        )}
      </div>
      {showRuleInput ? (
        <div style={{ marginTop: "20px" }}>
          <h4>Congratulations! You seem to understand the game.</h4>
          <p>Please explain the rules in your own words:</p>
          <textarea
            value={userRuleInput}
            onChange={(e) => setUserRuleInput(e.target.value)}
            style={{ width: "100%", height: "100px", marginBottom: "10px" }}
          />
          <button
            onClick={handleRuleSubmission}
            style={{
              padding: "10px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Submit Rules
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => evaluateAnswer("on")}
            style={{
              padding: "10px",
              marginRight: "10px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            On
          </button>
          <button
            onClick={() => evaluateAnswer("off")}
            style={{
              padding: "10px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Off
          </button>
        </div>
      )}
      <p style={{ marginTop: "10px" }}>Current Streak: {streak}</p>
    </div>
  );
};

export default OnOrOffGame;