// 1.	The Game Rule: The grid is “Connected” if there is exactly one cluster of adjacent yellow cells. Otherwise, it is “Disconnected.”
// 2.	Gameplay: The player observes the grid and guesses whether it’s connected or disconnected.
// 3.	Red Herring: The player might initially assume the rule is based on the total count of yellow lights or their symmetry, rather than clustering.
// 4.	Victory Condition: After 10 correct guesses in a row, the player is prompted to explain the rules, and the game evaluates if they’ve inferred the true logic.

import React, { useState, useEffect } from "react";

const generateRandomGrid = (rows: number, cols: number) =>
  Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => Math.random() > 0.5) // Randomly assign true (on) or false (off)
    );

const countClusters = (grid: boolean[][]) => {
  const visited = new Set<string>();
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const dfs = (row: number, col: number) => {
    const stack = [[row, col]];
    visited.add(`${row}-${col}`);

    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 &&
          nr < grid.length &&
          nc >= 0 &&
          nc < grid[0].length &&
          grid[nr][nc] &&
          !visited.has(`${nr}-${nc}`)
        ) {
          visited.add(`${nr}-${nc}`);
          stack.push([nr, nc]);
        }
      }
    }
  };

  let clusters = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] && !visited.has(`${row}-${col}`)) {
        clusters++;
        dfs(row, col);
      }
    }
  }

  return clusters;
};

const LightConnectionGame: React.FC<{ onComplete: (stats: { trained: boolean; time: number; ruleMatch: boolean }) => void }> = ({ onComplete }) => {
  const [grid, setGrid] = useState<boolean[][]>(generateRandomGrid(4, 4));
  const [streak, setStreak] = useState(0);
  const [startTime] = useState(Date.now());
  const [showRuleInput, setShowRuleInput] = useState(false);
  const [userRuleInput, setUserRuleInput] = useState("");

  useEffect(() => {
    setGrid(generateRandomGrid(4, 4));
  }, []);

  const evaluateAnswer = (answer: "connected" | "disconnected") => {
    const clusters = countClusters(grid);
    const correctAnswer = clusters === 1 ? "connected" : "disconnected";

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
    const ruleMatch = userRuleInput
      .toLowerCase()
      .includes("cluster") && userRuleInput.toLowerCase().includes("one");

    const totalTime = (Date.now() - startTime) / 1000; // Calculate time in seconds

    onComplete({
      trained: true,
      time: totalTime,
      ruleMatch,
    });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", background: "white", borderRadius: "8px" }}>
      <h3>Is the grid Connected or Disconnected?</h3>
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
            onClick={() => evaluateAnswer("connected")}
            style={{
              padding: "10px",
              marginRight: "10px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Connected
          </button>
          <button
            onClick={() => evaluateAnswer("disconnected")}
            style={{
              padding: "10px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Disconnected
          </button>
        </div>
      )}
      <p style={{ marginTop: "10px" }}>Current Streak: {streak}</p>
    </div>
  );
};

export default LightConnectionGame;