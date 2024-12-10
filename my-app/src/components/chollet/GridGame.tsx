import React, { useState } from "react";
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


  const GridGame: React.FC<{ onComplete: (isCorrect: boolean) => void }> = ({
    onComplete,
  }) => {
    const [currentTaskIndex, setCurrentTaskIndex] = useState(
        Math.floor(Math.random() * trainingTasks.length)
      );
      const [outputGrid, setOutputGrid] = useState(
        trainingTasks[currentTaskIndex].input.map((row) =>
          row.map(() => "black")
        )
      );
      const [selectedColor, setSelectedColor] = useState<string>("black");
    
      const currentTask = trainingTasks[currentTaskIndex];
    
      const handleSubmit = () => {
        const isCorrect =
          JSON.stringify(outputGrid) === JSON.stringify(currentTask.expectedOutput);
    
        if (isCorrect) {
          alert("Correct!");
          onComplete(true);
    
          if (trainingTasks.length > 1) {
            const nextTaskIndex = Math.floor(Math.random() * trainingTasks.length);
            setCurrentTaskIndex(nextTaskIndex);
            setOutputGrid(
              trainingTasks[nextTaskIndex].input.map((row) =>
                row.map(() => "black")
              )
            );
          } else {
            alert("All tasks completed!");
          }
        } else {
          alert("Incorrect. Try again.");
          onComplete(false);
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
                  border: selectedColor === color ? "2px solid black" : "1px solid gray",
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