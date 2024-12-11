import React, { useState } from "react";

interface DevToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: string[];
  setMode: (mode: "charliemode" | "rqwmode") => void;
}

const DevToolsDrawer: React.FC<DevToolsDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  setMode,
}) => {
  const [command, setCommand] = useState("");

  const handleCommandInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
  };

  const handleCommandSubmit = () => {
    if (command === "/charliemode") {
      setMode("charliemode");
      logs.push("Switched to Charlie mode");
    } else if (command === "/rqwmode") {
      setMode("rqwmode");
      logs.push("Switched to RQW mode");
      logs.push(
        `For more information click <a href="https://docs.google.com/document/d/e/2PACX-1vTWNRJIL8Ljp4xVLofsMqDXhDXwIvpHCcCaviZXBIVGJIdBqMKd8iYlDqxtSHeO29eF43jQ9EKTquHx/pub" target="_blank" style="color: #61dafb; text-decoration: underline;">here</a>.`
      );
    } else {
      logs.push(`${command}`);
    }
    setCommand(""); // Clear input after submission
  };

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
        {logs.map((log, index) =>
          log.includes("<a") ? (
            <p
              key={index}
              style={{ color: "lightgray" }}
              dangerouslySetInnerHTML={{ __html: log }}
            />
          ) : (
            <p
              key={index}
              style={{ color: log.includes("error") ? "red" : "lightgray" }}
            >
              {">"} {log}
            </p>
          )
        )}
      </div>
      <div
        style={{
          marginTop: "20px",
          borderTop: "1px solid #444",
          paddingTop: "10px",
        }}
      >
        <input
          type="text"
          value={command}
          onChange={handleCommandInput}
          placeholder=">"
          style={{
            width: "calc(100% - 10px)",
            padding: "5px",
            backgroundColor: "#333",
            color: "#61dafb",
            border: "1px solid #555",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleCommandSubmit}
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Submit Command
        </button>
      </div>
    </div>
  );
};

export default DevToolsDrawer;