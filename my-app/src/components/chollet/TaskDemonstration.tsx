import React from "react";

interface TaskExample {
  input: { color: string }[][];
  output: { color: string }[][];
}

interface TaskDemonstrationProps {
  examples: TaskExample[];
}

const TaskDemonstration: React.FC<TaskDemonstrationProps> = ({ examples }) => {
  return (
    <div>
      <h3>Task Demonstration</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {examples.map((example, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "20px", alignItems: "center" }}
          >
            <div>
              <h4>Input</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${example.input[0].length}, 20px)`,
                  gridGap: "1px",
                }}
              >
                {example.input.flat().map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: cell.color,
                      border: "1px solid #ddd",
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <div>
              <h4>Output</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${example.output[0].length}, 20px)`,
                  gridGap: "1px",
                }}
              >
                {example.output.flat().map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: cell.color,
                      border: "1px solid #ddd",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskDemonstration;