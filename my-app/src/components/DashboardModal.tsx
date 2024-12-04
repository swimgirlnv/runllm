import React from "react";

interface DashboardModalProps {
  isOpen: boolean;
  totalCorrect: number;
  totalIncorrect: number;
  puzzlesCompleted: number;
  turingTestResults: number; // Percentage or score from Turing Tests
  onClose: () => void;
}

const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  totalCorrect,
  totalIncorrect,
  puzzlesCompleted,
  turingTestResults,
  onClose,
}) => {
  if (!isOpen) return null;

  const totalAttempts = totalCorrect + totalIncorrect;
  const successRate = totalAttempts > 0 ? ((totalCorrect / totalAttempts) * 100).toFixed(2) : "0.00";
  const llmProbability = Math.min((totalCorrect / (totalAttempts || 1)) * 100 + turingTestResults, 100);

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
      <p><strong>Total Correct Answers:</strong> {totalCorrect}</p>
      <p><strong>Total Incorrect Answers:</strong> {totalIncorrect}</p>
      <p><strong>Puzzles Completed:</strong> {puzzlesCompleted}</p>
      <p><strong>Turing Test Results:</strong> {turingTestResults}%</p>
      <p><strong>Success Rate:</strong> {successRate}%</p>
      <hr />
      <p><strong>LLM Probability:</strong> {llmProbability.toFixed(2)}%</p>
      <button
        onClick={onClose}
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Close
      </button>
    </div>
  );
};

export default DashboardModal;