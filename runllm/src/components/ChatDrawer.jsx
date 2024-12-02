import React, { useState } from "react";

function ChatDrawer({ messages }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        right: isOpen ? "0" : "-300px", // Slide in/out
        top: "0",
        width: "300px",
        height: "100%",
        backgroundColor: "#1e1e2e",
        color: "#ffffff",
        boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
        transition: "right 0.3s ease-in-out",
        overflow: "hidden",
      }}
    >
      {/* Toggle Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "absolute",
          left: "-30px",
          top: "50%",
          width: "30px",
          height: "30px",
          backgroundColor: "#00ffff",
          color: "#000",
          textAlign: "center",
          lineHeight: "30px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isOpen ? "⮜" : "⮞"}
      </div>

      {/* Chat Content */}
      <div style={{ padding: "10px", overflowY: "auto", height: "90%" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatDrawer;
