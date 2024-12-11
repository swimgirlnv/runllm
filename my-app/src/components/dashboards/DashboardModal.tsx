import React from "react";

interface DashboardModalProps {
  isOpen: boolean;
  totalCorrect: number;
  totalIncorrect: number;
  puzzlesCompleted: number;
  turingTestResults: number; // Percentage or score from Turing Tests
  onOffStats: { trained: boolean; time: number; ruleMatch: boolean } | null;
  lightConnectionStats: { trained: boolean; time: number; ruleMatch: boolean } | null;
  arcStats: { success: boolean; attempts: number } | null;
  slidingTileStats: { completed: boolean; time: number } | null;
  onClose: () => void;
}

const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  totalCorrect,
  totalIncorrect,
  puzzlesCompleted,
  turingTestResults,
  onOffStats,
  lightConnectionStats,
  arcStats,
  slidingTileStats,
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

  // Add stats from specific games
  const onOffSummary = onOffStats
    ? `Trained: ${onOffStats.trained ? "Yes" : "No"}, Time: ${onOffStats.time}s, Rule Match: ${
        onOffStats.ruleMatch ? "Yes" : "No"
      }`
    : "Not attempted";

  const lightConnectionSummary = lightConnectionStats
    ? `Trained: ${lightConnectionStats.trained ? "Yes" : "No"}, Time: ${lightConnectionStats.time}s, Rule Match: ${
        lightConnectionStats.ruleMatch ? "Yes" : "No"
      }`
    : "Not attempted";

  const arcSummary = arcStats
    ? `Success: ${arcStats.success ? "Yes" : "No"}, Attempts: ${arcStats.attempts}`
    : "Not attempted";

  const slidingTileSummary = slidingTileStats
    ? `Completed: ${slidingTileStats.completed ? "Yes" : "No"}, Time: ${slidingTileStats.time}s`
    : "Not attempted";

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
      <h3>Game Results</h3>
      <p>
        <strong>On/Off Game:</strong> {onOffSummary}
      </p>
      <p>
        <strong>Light Connection Game:</strong> {lightConnectionSummary}
      </p>
      <p>
        <strong>ARC Game:</strong> {arcSummary}
      </p>
      <p>
        <strong>Sliding Tile Game:</strong> {slidingTileSummary}
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