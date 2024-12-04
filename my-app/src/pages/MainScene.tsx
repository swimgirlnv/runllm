import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PuzzleModal from '../components/PuzzleModal';
import Monitor from './MonitorScene';
import { generatePuzzle, sendMessageToAssistant } from '../GameManager/GameManager';
import RoomModel from '../models/RoomModel';

interface Node {
  id: string;
  position: [number, number, number];
  size: [number, number];
  rotation: [number, number, number];
  color: string;
  unlocked: boolean;
  puzzle: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  } | null;
}

const MainScene: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'blueNode',
      position: [-19.3, 4, -13],
      size: [3, 3.5],
      rotation: [0, Math.PI / 5, 0],
      color: 'blue',
      unlocked: true,
      puzzle: null,
    },
    {
      id: 'redNode',
      position: [-23.5, 4.3, -13],
      size: [1.5, 2.9],
      rotation: [0, Math.PI / 5, 0],
      color: 'red',
      unlocked: false,
      puzzle: null,
    },
  ]);

  const addChatMessage = (sender: string, message: string) => {
    setChatMessages((prev) => [...prev, `[${sender}]: ${message}`]);
  };

  const unlockNode = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, unlocked: true } : node))
    );
    addChatMessage('Alice', `Great job! The next node (${nodeId}) is now unlocked.`);
  };

  const handleNodeClick = async (node: Node) => {
    if (!node.unlocked) {
      addChatMessage('System', `Node ${node.id} is locked.`);
      return;
    }

    if (!node.puzzle) {
      addChatMessage('System', `Fetching a new puzzle for ${node.id}...`);
      const newPuzzleContent = await generatePuzzle('Fetch puzzle for node');

      if (!newPuzzleContent) {
        addChatMessage('System', 'Error generating puzzle. Try again later!');
        return;
      }

      const lines = newPuzzleContent.split('\n').filter((line) => line.trim());
      const question = lines[0];
      const correctAnswerLine = lines.find((line) => line.startsWith('*'));
      if (!correctAnswerLine) {
        addChatMessage('System', 'Error: No correct answer found in puzzle.');
        return;
      }
      const correctAnswer = correctAnswerLine.replace('*', '').trim();
      const incorrectAnswers = lines
        .filter((line) => !line.startsWith('*') && line.trim() !== question)
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

      await Promise.all([
        sendMessageToAssistant('alice', `New puzzle context: ${newPuzzle.question}`),
        sendMessageToAssistant('bob', `New puzzle context: ${newPuzzle.question}`),
      ]);

      addChatMessage('System', 'Puzzle added to Alice and Bob\'s memory.');
    }

    setActiveNode(node);
  };

  const handleAnswer = (puzzleId: string, selectedOption: string) => {
    const node = nodes.find((n) => n.puzzle?.id === puzzleId);

    if (!node || !node.puzzle) {
      addChatMessage('System', 'Puzzle not found!');
      return;
    }

    if (selectedOption === node.puzzle.correctAnswer) {
      addChatMessage('Alice', 'Correct! Well done.');
      unlockNode(node.id);
      setActiveNode(null);
    } else {
      addChatMessage('Bob', 'Incorrect answer. Try again!');
    }
  };

  return (
    <>
      <Canvas shadows camera={{ position: [0, 3, 6], fov: 60 }} style={{ height: '100vh', width: '100vw' }}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

        <RoomModel position={[-3, -8, -3.5]} scale={[0.3, 0.3, 0.3]} rotation={[0, Math.PI / 2, 0]} />

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
        {nodes.map((node) => (
          <mesh
            key={node.id}
            position={node.position}
            rotation={node.rotation}
            onClick={() => handleNodeClick(node)}
          >
            <planeGeometry args={node.size} />
            <meshBasicMaterial color={node.color} transparent opacity={0.5} />
          </mesh>
        ))}

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
};

export default MainScene;