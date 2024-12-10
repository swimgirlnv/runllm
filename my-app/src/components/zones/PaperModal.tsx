import React from "react";
import ReactMarkdown from "react-markdown";

interface PaperModalProps {
  isOpen: boolean;
  paperContent: string | null;
  onClose: () => void;
}

const PaperModal: React.FC<PaperModalProps> = ({ isOpen, paperContent, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.container}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          Close
        </button>
        <div style={styles.content}>
          {paperContent ? (
            <ReactMarkdown>{paperContent}</ReactMarkdown>
          ) : (
            <p>Loading content...</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "60%",
    height: "70%",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  },
  closeButton: {
    alignSelf: "flex-end" as const,
    padding: "10px",
    backgroundColor: "#ff5c5c",
    border: "none",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    overflowY: "auto" as const,
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
};

export default PaperModal;