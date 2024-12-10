import React from "react";

interface NotesDashboardProps {
  isOpen: boolean;
  notes: string[]; // Array of notes from Alice and Bob
  onClose: () => void;
}

const NotesDashboard: React.FC<NotesDashboardProps> = ({
  isOpen,
  notes,
  onClose,
}) => {
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
        width: "60%",
        maxHeight: "70%",
        overflowY: "auto",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Observations</h3>
      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        {notes.map((note, index) => (
          <li key={index} style={{ marginBottom: "10px", fontSize: "14px" }}>
            {note}
          </li>
        ))}
      </ul>
      <button
        onClick={onClose}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
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

export default NotesDashboard;
