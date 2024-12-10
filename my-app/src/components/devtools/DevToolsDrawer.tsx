import React from "react";

interface DevToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: string[];
}

const DevToolsDrawer: React.FC<DevToolsDrawerProps> = ({ isOpen, onClose, logs }) => {

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: isOpen ? 0 : "-100%",
        width: "400px",
        height: "100%",
        backgroundColor: "#282c34",
        color: "#61dafb",
        transition: "right 0.3s ease-in-out",
        zIndex: 1000,
        padding: isOpen ? "10px" : "0",
        overflowY: "auto",
        fontFamily: "monospace",
        display: isOpen ? "block" : "none", // Completely hide when closed
      }}
    >
      <div style={{ borderBottom: "1px solid #444", marginBottom: "10px" }}>
        <h4 style={{ margin: 0, color: "white" }}>Developer Tools</h4>
        <button
          onClick={onClose}
          style={{
            margin: "10px 0",
            padding: "5px 10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
      <div>
        {logs.map((log, index) => (
          <p
            key={index}
            style={{ color: log.includes("error") ? "red" : "lightgray" }}
          >
            {">"} {log}
          </p>
        ))}
      </div>
    </div>
  );
};


export default DevToolsDrawer;