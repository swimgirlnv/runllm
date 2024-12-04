import React, { useState } from "react";

interface CaptchaModalProps {
  isOpen: boolean;
  captchaType: string;
  captchaData: any;
  onClose: () => void;
  onComplete: (isSuccess: boolean) => void; // Notify success or failure
}

const CaptchaModal: React.FC<CaptchaModalProps> = ({ isOpen, captchaType, captchaData, onClose, onComplete }) => {
  const [userInput, setUserInput] = useState(""); // User's input for the answer
  const [errorMessage, setErrorMessage] = useState(""); // Error message for incorrect attempts

  if (!isOpen || !captchaData) return null;

  const handleSubmit = () => {
    const correctAnswer = captchaData.correctAnswer?.toLowerCase();
    const userAnswer = userInput.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
      setErrorMessage("");
      onComplete(true); // Notify success
      onClose(); // Close modal
    } else {
      setErrorMessage("Incorrect answer. Please try again.");
      onComplete(false); // Notify failure
    }
  };

  console.log("Psst, Charlie! The correct answer is:", captchaData.correctAnswer);

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
        width: "300px",
      }}
    >
      {captchaType === "word" ? (
        <p>
          Unscramble the word: <strong>{captchaData.scrambledWord}</strong>
        </p>
      ) : (
        <p>{captchaData.question}</p>
      )}
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter your answer"
        style={{
          display: "block",
          width: "100%",
          margin: "10px 0",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          display: "block",
          margin: "10px auto",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
      {errorMessage && (
        <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>{errorMessage}</p>
      )}
    </div>
  );
};

export default CaptchaModal;