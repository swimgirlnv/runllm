import React, { useState, useEffect } from "react";

interface CaptchaModalProps {
  isOpen: boolean;
  captchaType: string;
  captchaData: any;
  onClose: () => void;
  onComplete: (isSuccess: boolean) => void; // Notify success or failure
  logToDevTools: (message: string) => void; // Function to log to DevToolDrawer
  reportObservation: (observation: string) => void; // Function to report to Observation Dashboard
}

const CaptchaModal: React.FC<CaptchaModalProps> = ({
  isOpen,
  captchaType,
  captchaData,
  onClose,
  onComplete,
  logToDevTools,
  reportObservation,
}) => {
  const [userInput, setUserInput] = useState(""); // User's input for the answer
  const [errorMessage, setErrorMessage] = useState(""); // Error message for incorrect attempts
  const [hasLogged, setHasLogged] = useState(false); // Track if the log has already been made
  const [isReporting, setIsReporting] = useState(false); // Show report text field
  const [reportInput, setReportInput] = useState(""); // Report input field

  useEffect(() => {
    if (isOpen && captchaData && !hasLogged) {
      const logMessage = `Psst, Charlie! The correct answer is: ${captchaData.correctAnswer}`;
      console.log(logMessage); // Log to browser console
      logToDevTools(logMessage); // Log to DevToolDrawer
      setHasLogged(true); // Prevent future logs for this session
    }
  }, [isOpen, captchaData, hasLogged, logToDevTools]);

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

  const handleReportSubmit = () => {
    if (reportInput.trim()) {
      const observationMessage = `Glitch Report: "${reportInput}" reported for scrambled word "${captchaData.scrambledWord}" and correct answer "${captchaData.correctAnswer}".`;
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
        width: "300px",
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

      {/* Captcha content */}
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
        <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
          {errorMessage}
        </p>
      )}

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

export default CaptchaModal;