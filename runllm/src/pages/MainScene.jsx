import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import PuzzleModal from "../components/PuzzleModal"; // Modal Component
import Monitor from "./MonitorScene";
import { generatePuzzle } from "../GameManager/GameManager"; // Import generatePuzzle
import RoomModel from "../components/RoomModel";
import { sendMessageToAssistant } from "../GameManager/GameManager";

function MainScene() {
  const [chatMessages, setChatMessages] = useState([]); // Chat messages
  const [activeNode, setActiveNode] = useState(null); // Currently selected node
  const [nodes, setNodes] = useState([
    {
      id: "blueNode",
      position: [-19.3, 4, -13],
      size: [3, 3.5],
      rotation: [0, Math.PI / 5, 0],
      color: "blue",
      unlocked: true,
      puzzle: null,
    },
    {
      id: "redNode",
      position: [-23.5, 4.3, -13],
      size: [1.5, 2.9],
      rotation: [0, Math.PI / 5, 0],
      color: "red",
      unlocked: false,
      puzzle: null,
    },
  ]);

  // Add a message to the monitor chat
  const addChatMessage = (sender, message) => {
    setChatMessages((prev) => [...prev, `[${sender}]: ${message}`]);
  };

  // Unlock a new node
  const unlockNode = (nodeId) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, unlocked: true } : node
      )
    );
    addChatMessage("Alice", `Great job! The next node (${nodeId}) is now unlocked.`);
  };

  // Handle node click
  const handleNodeClick = async (node) => {
    if (!node.unlocked) {
      addChatMessage("System", `Node ${node.id} is locked.`);
      return;
    }
  
    if (!node.puzzle) {
      addChatMessage("System", `Fetching a new puzzle for ${node.id}...`);
      const newPuzzleContent = await generatePuzzle();
  
      if (!newPuzzleContent) {
        addChatMessage("System", "Error generating puzzle. Try again later!");
        return;
      }
  
      const lines = newPuzzleContent.split("\n").filter((line) => line.trim());
      const question = lines[0];
      const correctAnswer = lines.find((line) => line.startsWith("*")).replace("*", "").trim();
      const incorrectAnswers = lines
        .filter((line) => !line.startsWith("*") && line.trim() !== question)
        .map((line) => line.trim());
  
      const newPuzzle = {
        id: `puzzle-${Date.now()}`,
        question,
        options: [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5),
        correctAnswer,
      };
  
      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, puzzle: newPuzzle } : n))
      );
  
      // Add the puzzle to Alice and Bob's context
      addChatMessage("System", "Sending the puzzle to Alice and Bob...");
      await Promise.all([
        sendMessageToAssistant("alice", `New puzzle context: ${newPuzzle.question}`),
        sendMessageToAssistant("bob", `New puzzle context: ${newPuzzle.question}`),
      ]);
  
      addChatMessage("System", "Puzzle added to Alice and Bob's memory.");
    }
  
    setActiveNode(node);
  };
  

  // Handle puzzle answer
  const handleAnswer = (puzzleId, selectedOption) => {
    const node = nodes.find((n) => n.puzzle?.id === puzzleId);
  
    if (!node || !node.puzzle) {
      addChatMessage("System", "Puzzle not found!");
      return;
    }
  
    if (selectedOption === node.puzzle.correctAnswer) {
      addChatMessage("Alice", "Correct! Well done.");
      unlockNode(node.id);
      setActiveNode(null);
    } else {
      addChatMessage("Bob", "Incorrect answer. Try again!");
    }
  };
  

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 3, 6], fov: 60 }}
        style={{ height: "100vh", width: "100vw" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

        {/* Room */}
        <RoomModel position={[-3, -8, -3.5]} scale={[.3, .3, .3]} rotation={[0, Math.PI / 2, 0]} />

        {/* Monitor */}
        <Monitor
        chatMessages={chatMessages}
        onSendMessage={async (message) => {
            // Add Charlie's message to the chat log
            addChatMessage("Charlie", message);

            // Fetch responses from Alice and Bob
            const [responseAlice, responseBob] = await Promise.all([
            sendMessageToAssistant("alice", message),
            sendMessageToAssistant("bob", message),
            ]);

            // Add responses to the chat log
            addChatMessage("Alice", responseAlice);
            addChatMessage("Bob", responseBob);
        }}
        />


        {/* Clickable Nodes */}
        {nodes.map((node) => (
          <mesh
            key={node.id}
            position={node.position}
            rotation={node.rotation}
            onClick={() => handleNodeClick(node)}
            onPointerOver={(e) => (e.object.material.opacity = 0.3)} // Highlight on hover
            onPointerOut={(e) => (e.object.material.opacity = 0)} // Reset highlight
          >
            <planeGeometry args={node.size} />
            <meshBasicMaterial color={node.color} transparent opacity={0} />
          </mesh>
        ))}

        {/* Camera Controls */}
        <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 4} // Prevent looking too far up
            maxPolarAngle={Math.PI / 2} // Prevent looking too far down
            minDistance={5} // Minimum zoom distance
            maxDistance={15} // Maximum zoom distance
            maxAzimuthAngle={Math.PI / 2} // Restrict horizontal rotation to the right
            minAzimuthAngle={-Math.PI / 2} // Restrict horizontal rotation to the left
            makeDefault // Ensures it only applies to the 3D canvas and doesn't interfere with HTML scrolling
            />

      </Canvas>

      {/* Puzzle Modal */}
      {activeNode && (
        <PuzzleModal
          isOpen={!!activeNode}
          node={activeNode}
          onClose={() => setActiveNode(null)}
          handleAnswer={handleAnswer}
        />
      )}
    </>
  );
}

export default MainScene;
