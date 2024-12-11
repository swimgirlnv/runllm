import React, { useEffect, useState } from "react";
import Grid from "./Grid";

const trainingTasks = [
  {
    input: [
      ["black", "blue", "black"],
      ["blue", "black", "blue"],
      ["black", "blue", "black"],
    ],
    expectedOutput: [
      ["black", "blue", "black"],
      ["blue", "black", "blue"],
      ["black", "blue", "black"],
    ],
  },
  {
    input: [
      ["red", "black", "red"],
      ["black", "red", "black"],
      ["red", "black", "red"],
    ],
    expectedOutput: [
      ["red", "black", "red"],
      ["black", "red", "black"],
      ["red", "black", "red"],
    ],
  },
  {
    input: [
      ["green", "black", "green", "black"],
      ["black", "green", "black", "green"],
      ["green", "black", "green", "black"],
      ["black", "green", "black", "green"],
    ],
    expectedOutput: [
      ["black", "green", "black", "green"],
      ["green", "black", "green", "black"],
      ["black", "green", "black", "green"],
      ["green", "black", "green", "black"],
    ],
  },
  {
    input: [
      ["yellow", "yellow", "yellow"],
      ["black", "black", "black"],
      ["yellow", "yellow", "yellow"],
    ],
    expectedOutput: [
      ["yellow", "yellow", "yellow"],
      ["black", "black", "black"],
      ["yellow", "yellow", "yellow"],
    ],
  },
  {
    input: [
      ["blue", "blue", "blue", "blue"],
      ["blue", "black", "black", "blue"],
      ["blue", "black", "black", "blue"],
      ["blue", "blue", "blue", "blue"],
    ],
    expectedOutput: [
      ["blue", "blue", "blue", "blue"],
      ["blue", "red", "red", "blue"],
      ["blue", "red", "red", "blue"],
      ["blue", "blue", "blue", "blue"],
    ],
  },
];

const colors = ["black", "blue", "red", "green", "yellow"];

const GridGame: React.FC<{
  onComplete: (isCorrect: boolean, time: number, attempts: number) => void;
}> = ({ onComplete }) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(
    Math.floor(Math.random() * trainingTasks.length)
  );
  const [outputGrid, setOutputGrid] = useState(
    trainingTasks[currentTaskIndex].input.map((row) => row.map(() => "black"))
  );
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const currentTask = trainingTasks[currentTaskIndex];

  useEffect(() => {
    // Reset start time whenever a new task starts
    setStartTime(Date.now());
  }, [currentTaskIndex]);

  const handleSubmit = () => {
    setAttempts((prev) => prev + 1);

    const isCorrect =
      JSON.stringify(outputGrid) === JSON.stringify(currentTask.expectedOutput);

    if (isCorrect) {
      const timeSpent = (Date.now() - startTime) / 1000; // Calculate time in seconds
      alert("Correct!");
      onComplete(true, timeSpent, attempts + 1);

      if (trainingTasks.length > 1) {
        const nextTaskIndex = Math.floor(Math.random() * trainingTasks.length);
        setCurrentTaskIndex(nextTaskIndex);
        setOutputGrid(
          trainingTasks[nextTaskIndex].input.map((row) => row.map(() => "black"))
        );
      } else {
        alert("All tasks completed!");
      }
    } else {
      alert("Incorrect. Try again.");
      onComplete(false, 0, attempts + 1); // Only count time for correct answers
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Input Grid</h3>
      <Grid grid={currentTask.input} />
      <h3>Output Grid</h3>
      <Grid
        grid={outputGrid}
        editable
        onCellClick={(row, col) => {
          setOutputGrid((prev) => {
            const newGrid = prev.map((r) => [...r]);
            newGrid[row][col] = selectedColor; // Apply the selected color
            return newGrid;
          });
        }}
      />

      <h3>Pick a Color:</h3>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: color,
              border:
                selectedColor === color ? "2px solid black" : "1px solid gray",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default GridGame;
