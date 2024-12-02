import React from "react";

function PuzzleModal({ isOpen, node, onClose, handleAnswer }) {
  if (!isOpen || !node || !node.puzzle) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translate(-50%, 0)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 10, // Ensure it is always above other elements
      }}
    >
      <h3>{node.puzzle.question}</h3>
      <div>
        {node.puzzle.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(node.puzzle.id, option)}
            style={{
              display: "block",
              margin: "10px 0",
              padding: "10px",
              width: "100%",
              backgroundColor: "#f0f0f0",
              border: "1px solid black",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#d9534f",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
}

export default PuzzleModal;
