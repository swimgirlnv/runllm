import React, { useEffect, useState } from "react";

interface PuzzleModalProps {
  isOpen: boolean;
  puzzle: {
    id: string;
    question: string;
    correctAnswer: string;
    options: string[];
  } | null;
  onClose: () => void;
  handleAnswer: (puzzleId: string, isCorrect: boolean) => void;
  reportObservation: (observation: string) => void;
  logToDevTools: (message: string) => void;
}

const PuzzleModal: React.FC<PuzzleModalProps> = ({
  isOpen,
  puzzle,
  onClose,
  handleAnswer,
  reportObservation,
  logToDevTools,
}) => {
  
  const [isReporting, setIsReporting] = useState(false); // Toggle report input
  const [reportInput, setReportInput] = useState(""); // User input for reporting

  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened");
    }
  }, [isOpen, puzzle]);

  if (!isOpen || !puzzle) return null;

  if (!isOpen || !puzzle) return null;

  const handleOptionClick = (selectedOption: string) => {
    const isCorrect =
      selectedOption.trim().toLowerCase() ===
      puzzle.correctAnswer.trim().toLowerCase();
    handleAnswer(puzzle.id, isCorrect);
    onClose(); // Close modal after answering
  };

  const handleReportSubmit = () => {
    if (reportInput.trim()) {
      const observationMessage = `Glitch Report: "${reportInput}" reported for puzzle "${puzzle.question}".`;
      reportObservation(observationMessage);
      logToDevTools(observationMessage);
      setReportInput("");
      setIsReporting(false);
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
        maxWidth: "500px",
        width: "90%",
      }}
    >
      {/* Report glitch button */}
      <button
        onClick={() => setIsReporting((prev) => !prev)}
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
      <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Question</h3>
      <p style={{ marginBottom: "20px", lineHeight: "1.5" }}>{puzzle.question}</p>

      <div>
        {puzzle.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            style={{
              width: "100%",
              margin: "10px 0",
              padding: "10px",
              backgroundColor: "#f9f9f9",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Close modal button */}
      <button
        onClick={onClose}
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#d9534f",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Close
      </button>

      {/* Reporting input */}
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
              resize: "none",
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