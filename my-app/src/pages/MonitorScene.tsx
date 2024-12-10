import React, { useState } from "react";
import { Html } from "@react-three/drei";

interface MonitorProps {
  chatMessages: string[];
  onSendMessage: (message: string) => void;
}

const Monitor: React.FC<MonitorProps> = ({ chatMessages, onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState<string>("");

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <mesh position={[0, 0.8, -2]} castShadow>
      <mesh 
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
      position={[-22, -1.5, 10.5]} 
      rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[15, 14]} />
        <meshStandardMaterial color="#333" />
        <Html position={[0, 0, 0.1]} transform occlude pointerEvents="auto">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "35rem",
              height: "30rem",
              backgroundColor: "black",
              color: "green",
              fontFamily: "monospace",
              borderRadius: "5px",
              boxShadow: "0px 0px 10px rgba(0, 255, 0, 0.7)",
            }}
          >
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "10px",
                fontSize: "14px",
              }}
            >
              {chatMessages.map((message, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <strong>{message.split(":")[0]}:</strong>{" "}
                  {message.split(":")[1]}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderTop: "1px solid green",
              }}
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  color: "green",
                  backgroundColor: "black",
                  border: "1px solid green",
                  borderRadius: "4px",
                  marginRight: "10px",
                }}
                placeholder="Type your message here..."
              />
              <button
                onClick={handleSend}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  color: "black",
                  backgroundColor: "green",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </Html>
      </mesh>
    </mesh>
  );
};

export default Monitor;
