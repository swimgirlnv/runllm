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

  // Derived metrics
  const totalAttempts = totalCorrect + totalIncorrect;
  const successRate =
    totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
  const memoryRecallConsistency = Math.min(totalCorrect * 10, 100); // Simplified calculation
  const logicBias = Math.min(puzzlesCompleted * 15, 100); // Simplified calculation
  const creativityIndex = Math.max(100 - logicBias, 20); // Inverse relationship
  const emotionalDivergence = 1 + turingTestResults / 100; // Range from 1.0–2.0

  // HQ Formula
  const HQ =
    ((creativityIndex ** 2 + successRate) * emotionalDivergence) /
    Math.sqrt(memoryRecallConsistency + logicBias);

  // Determine if the user is likely an LLM
  const isLLM = HQ > 75; // Arbitrary threshold for classification

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
      <h2>Dashboard</h2>
      <p>
        <strong>Total Correct Answers:</strong> {totalCorrect}
      </p>
      <p>
        <strong>Total Incorrect Answers:</strong> {totalIncorrect}
      </p>
      <p>
        <strong>Puzzles Completed:</strong> {puzzlesCompleted}
      </p>
      <p>
        <strong>Turing Test Results:</strong> {turingTestResults}%
      </p>
      <p>
        <strong>Success Rate:</strong> {successRate.toFixed(2)}%
      </p>
      <hr />
      <h3>Humanity Quotient (HQ): {HQ.toFixed(2)}</h3>
      <p>
        Based on the HQ score, you are likely a:{" "}
        <strong>{isLLM ? "Large Language Model (LLM)" : "Human"}</strong>
      </p>
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
