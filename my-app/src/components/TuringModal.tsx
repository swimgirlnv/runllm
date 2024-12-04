import React, { useState } from "react";

interface TuringTestModalProps {
  isOpen: boolean;
  question: string;
  options: string[];
  correctIndex: number; // Add correctIndex prop
  onClose: () => void;
  onComplete: (isSuccess: boolean) => void;
}

const TuringTestModal: React.FC<TuringTestModalProps> = ({
  isOpen,
  question,
  options,
  correctIndex, // Track the correct answer's index
  onClose,
  onComplete,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedOption) {
      alert("Please select an answer!");
      return;
    }

    // Validate selected option against correct index
    const isSuccess = options[correctIndex] === selectedOption;
    onComplete(isSuccess);
    onClose();
  };

  if (!isOpen) return null;

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
      }}
    >
      <h2>Turing Test Challenge</h2>
      <p>{question}</p>
      <div>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(option)}
            style={{
              display: "block",
              margin: "10px 0",
              padding: "10px",
              width: "100%",
              backgroundColor: selectedOption === option ? "#5cb85c" : "#f0f0f0",
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
        onClick={handleSubmit}
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: "#5cb85c",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
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
};

export default TuringTestModal;