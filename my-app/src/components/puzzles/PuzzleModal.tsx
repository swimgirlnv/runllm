import React, { useState } from "react";

interface PuzzleModalProps {
  isOpen: boolean;
  puzzle: {
    id: string;
    question: string;
    options: string[];
  } | null;
  onClose: () => void;
  handleAnswer: (puzzleId: string, selectedOption: string) => void;
  reportObservation: (observation: string) => void; // Report to Observation Dashboard
  logToDevTools: (message: string) => void; // Log to DevToolDrawer
}

const PuzzleModal: React.FC<PuzzleModalProps> = ({
  isOpen,
  puzzle,
  onClose,
  handleAnswer,
  reportObservation,
  logToDevTools,
}) => {
  const [isReporting, setIsReporting] = useState(false); // Show report text field
  const [reportInput, setReportInput] = useState(""); // Report input field

  if (!isOpen || !puzzle) return null;

  const handleReportSubmit = () => {
    if (reportInput.trim()) {
      const observationMessage = `Glitch Report: "${reportInput}" reported for puzzle "${puzzle.question}".`;
      reportObservation(observationMessage); // Send to Observation Dashboard
      logToDevTools(observationMessage); // Log to DevToolDrawer
      setReportInput(""); // Clear input
      setIsReporting(false); // Close reporting field
      onClose(); // Close the modal
      alert("Thank you for reporting the glitch!");
    } else {
      alert("Please provide details for the report.");
    }
  };

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
        zIndex: 10,
        width: "400px",
      }}
    >
      {/* Report glitch button */}
      <button
        onClick={() => setIsReporting((prev) => !prev)} // Toggle reporting field
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "orange",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        !
      </button>

      {/* Puzzle content */}
      <h3>{puzzle.question}</h3>
      <div>
        {puzzle.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(puzzle.id, option)} // Pass both the puzzle ID and the selected option
            style={{
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

      {/* Reporting text field */}
      {isReporting && (
        <div style={{ marginTop: "20px" }}>
          <textarea
            value={reportInput}
            onChange={(e) => setReportInput(e.target.value)}
            placeholder="Describe the issue..."
            style={{
              width: "100%",
              height: "80px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleReportSubmit}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "orange",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Submit Report
          </button>
        </div>
      )}
    </div>
  );
};

export default PuzzleModal;