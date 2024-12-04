import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PuzzleModal from '../components/PuzzleModal';
import Monitor from './MonitorScene';
import { generateCaptcha, generatePuzzle, generateTuringTest, sendMessageToAssistant } from '../GameManager/GameManager';
import RoomModel from '../models/RoomModel';
import { v4 as uuidv4 } from "uuid"; // Use UUID for thread IDs
import CaptchaModal from '../components/CaptchaModal';
import BlogModal from '../components/BlogModal';
import TuringTestModal from '../components/TuringModal';
import DashboardModal from '../components/DashboardModal';
import NotesDashboard from '../components/NotesDashboard';

interface Node {
    id: number;
    position: [number, number, number];
    size: [number, number];
    rotation: [number, number, number];
    color: string;
    unlocked: boolean;
    theme: string; // Contextual theme for AI puzzle generation
    puzzle: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: string;
    } | null;
  }

export type GameState = "Act1" | "Act2" | "Act3" | "Act4";

const MainScene: React.FC = () => {
    // State for tracking statistics
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalIncorrect, setTotalIncorrect] = useState(0);
  const [puzzlesCompleted, setPuzzlesCompleted] = useState(0);
  const [captchaCompleted, setCaptchaCompleted] = useState(0);
  const [turingTestsPassed, setTuringTestsPassed] = useState(0);
  const [turingTestResults, setTuringTestResults] = useState(0);

  // State for tracking Alice and Bob's notes
  const [showNotesDashboard, setShowNotesDashboard] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);

  // Existing game state and modal handling
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [threadId] = useState(uuidv4());
  const [gameState, setGameState] = useState<GameState>("Act1");
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [captchaType, setCaptchaType] = useState("");
  const [captchaData, setCaptchaData] = useState<any>(null);
  const [showTuringTestModal, setShowTuringTestModal] = useState(false);
  const [turingTestQuestion, setTuringTestQuestion] = useState<string>("");
  const [turingTestCorrectIndex, setTuringTestCorrectIndex] = useState<number | null>(null);
const [turingTestCorrectAnswer, setTuringTestCorrectAnswer] = useState<string>("");
const [turingTestIncorrectAnswers, setTuringTestIncorrectAnswers] = useState<string[]>([]);
  const [turingTestOptions, setTuringTestOptions] = useState<string[]>([]);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 0,
      position: [-21.3, 4.2, -15],
      size: [2.6, 3.3],
      rotation: [0, Math.PI / 5, 0],
      color: "blue",
      unlocked: true,
      theme: "familiar world logic puzzles",
      puzzle: null,
    },
    {
      id: 1,
      position: [-24.8, 4.7, -14],
      size: [1.4, 2.7],
      rotation: [0, Math.PI / 5, 0],
      color: "red",
      unlocked: false,
      theme: "philosophical AI musings",
      puzzle: null,
    },
    {
      id: 2,
      position: [-24.8, -1, -14],
      size: [1.5, 1.5],
      rotation: [0, Math.PI / 5, 0],
      color: "green",
      unlocked: false,
      theme: "cryptic code and surreal logic",
      puzzle: null,
    },
    {
      id: 3,
      position: [-19.8, -0.7, -15],
      size: [1.5, 1.9],
      rotation: [0, Math.PI / 5, 0],
      color: "darkorange",
      unlocked: false,
      theme: "abstract cloud-like puzzles",
      puzzle: null,
    },
    {
      id: 4,
      position: [-22.8, -2.5, -12],
      size: [2.5, 0.5],
      rotation: [0, Math.PI / 8, 0],
      color: "purple",
      unlocked: false,
      theme: "final cryptic AI revelation",
      puzzle: null,
    },
  ]);

  const CAPTCHA_ZONE = {
      id: 'captchaZone',
      position: [26.0, 2.5, -3] as [number, number, number],
      rotation: [0, 5, 0] as [number, number, number],
      size: [6, 5],
      color: 'yellow',
    };

    const BLOG_ZONE = {
        id: 'captchaZone',
        position: [21.1, -1, 11.4] as [number, number, number],
        rotation: [0, 4.23, 0] as [number, number, number],
        size: [5, 3.5],
        color: 'gray',
    }

    const TURING_ZONE = {
        id: 'turingZone',
        position: [21.1, -2, 2.1] as [number, number, number],
        rotation: [0, 4.5, 0] as [number, number, number],
        size: [4, 2],
        color: 'cyan',
    };

    const DASHBOARD_ZONE = {
        id: 'dashboardZone',
        position: [18.1, 1, -13] as [number, number, number],
        rotation: [0, 5.6, 0] as [number, number, number],
        size: [1.7, 3],
        color: 'limegreen',
    };
  // Add a chat message
  const addChatMessage = (sender: string, message: string) => {
    setChatMessages((prev) => [...prev, `[${sender}]: ${message}`]);
  };

  // Unlock a node
  const advanceGameState = () => {
    if (gameState === "Act1") setGameState("Act2");
    else if (gameState === "Act2") setGameState("Act3");
    else if (gameState === "Act3") setGameState("Act4");
  };

  // Unlock a node and advance game state as needed
  const unlockNode = (nodeId: number) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, unlocked: true } : node))
    );

    // Advance game state if all nodes in the current act are unlocked
    const allUnlocked = nodes.every((node) => node.unlocked);
    if (allUnlocked) advanceGameState();
  };

  // Trigger Assistant Dialogue (Example: on Puzzle Solve or Timeout)
  const handleNodeClick = async (node: Node) => {
    if (!node.unlocked) {
      addChatMessage("System", `You do not have access yet.`);
      return;
    }

    if (!node.puzzle) {
      const newPuzzleContent = await generatePuzzle(gameState); // Generate puzzle based on the theme

      if (!newPuzzleContent) {
        addChatMessage("System", "Error generating puzzle. Try again later!");
        return;
      }

      const lines = newPuzzleContent.split("\n").filter((line) => line.trim());
      const question = lines[0];
      const correctAnswerLine = lines.find((line) => line.startsWith("*"));
      if (!correctAnswerLine) {
        addChatMessage("System", "Error: No correct answer found in puzzle.");
        return;
      }
      const correctAnswer = correctAnswerLine.replace("*", "").trim();
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

      addChatMessage("System", `Double click to access this puzzle.`);
    }

    setActiveNode(node);
  };

  const addDynamicNote = async (assistant: "alice" | "bob", context: string) => {
    const generatedNote = await sendMessageToAssistant(
      assistant,
      `Reflect on the following event involving Charlie: ${context}`,
      threadId
    );
    setNotes((prev) => [...prev, `${assistant === "alice" ? "Alice" : "Bob"}: ${generatedNote}`]);
  };

  const handleAnswer = async (puzzleId: string, selectedOption: string) => {
    const node = nodes.find((n) => n.puzzle?.id === puzzleId);
  
    if (!node || !node.puzzle) {
      addChatMessage("System", "Puzzle not found!");
      return;
    }
  
    if (selectedOption === node.puzzle.correctAnswer) {
      addChatMessage("Alice", "Correct! Well done.");
      setTotalCorrect((prev) => prev + 1);
      setPuzzlesCompleted((prev) => prev + 1);
      unlockNode(node.id + 1);
      setActiveNode(null);
  
      // Add dynamic notes for puzzle completion
      await addDynamicNote(
        "alice",
        `Charlie successfully solved a puzzle in the "${node.theme}" theme.`
      );
      await addDynamicNote(
        "bob",
        `Charlie solved a puzzle. Do you think their logic was more human-like or algorithmic?`
      );
    } else {
      addChatMessage("Bob", "Incorrect answer. Try again!");
      setTotalIncorrect((prev) => prev + 1);
  
      // Add dynamic notes for puzzle failure
      await addDynamicNote(
        "alice",
        `Charlie struggled to solve a puzzle in the "${node.theme}" theme. What does that say about their reasoning ability?`
      );
      await addDynamicNote(
        "bob",
        `Charlie failed a puzzle. Even humans make mistakes, but is it a flaw of logic or creativity?`
      );
    }
  };
  
  // For Turing Test results:
  const handleTuringTestCompletion = async (isSuccess: boolean) => {
    if (isSuccess) {
      setTotalCorrect((prev) => prev + 1);
      setTuringTestsPassed((prev) => prev + 1);
      setTuringTestResults((prev) => Math.min(prev + 20, 100));
      addChatMessage("System", "You passed the Turing Test!");
  
      // Add dynamic notes for Turing Test success
      await addDynamicNote(
        "alice",
        `Charlie passed the Turing Test. Their responses were compellingly human-like. Are they blurring the line between human and AI?`
      );
      await addDynamicNote(
        "bob",
        `Charlie passed the Turing Test. Perhaps it's not just humans who can fool us...`
      );
    } else {
      setTotalIncorrect((prev) => prev + 1);
      addChatMessage("System", "You failed the Turing Test.");
  
      // Add dynamic notes for Turing Test failure
      await addDynamicNote(
        "alice",
        `Charlie failed the Turing Test. Was their reasoning too rigid, or did they lack the depth of human thought?`
      );
      await addDynamicNote(
        "bob",
        `Charlie couldn't pass the Turing Test. Even the best AI models have their limits, or is it something more?`
      );
    }
  
    setShowTuringTestModal(false);
  };

  const handleCaptchaCompletion = async (isSuccess: boolean) => {
    if (isSuccess) {
      setTotalCorrect((prev) => prev + 1);
      setCaptchaCompleted((prev) => prev + 1);
      addChatMessage("System", "CAPTCHA solved successfully!");
  
      // Add dynamic notes for CAPTCHA success
      await addDynamicNote(
        "alice",
        `Charlie successfully completed a CAPTCHA challenge. Their pattern recognition is impressive.`
      );
      await addDynamicNote(
        "bob",
        `Charlie solved a CAPTCHA. Do you think they rely on intuition, like humans, or trained algorithms?`
      );
    } else {
      setTotalIncorrect((prev) => prev + 1);
      addChatMessage("System", "Failed the CAPTCHA. Try again.");
  
      // Add dynamic notes for CAPTCHA failure
      await addDynamicNote(
        "alice",
        `Charlie failed a CAPTCHA challenge. Does this indicate a limitation in their ability to identify patterns?`
      );
      await addDynamicNote(
        "bob",
        `Charlie struggled with a CAPTCHA. Is it a lack of logic, or perhaps an inability to adapt?`
      );
    }
  
    setShowCaptchaModal(false);
  };

  const handleCaptchaZoneClick = async () => {
    const captcha = await generateCaptcha();
  
    if (!captcha) {
      addChatMessage("System", "Failed to generate CAPTCHA. Try again later!");
      return;
    }
  
    setCaptchaType(captcha.type);
    setCaptchaData(captcha.data);
    setShowCaptchaModal(true);
  };

  const handleTuringTestZoneClick = async () => {
    const challenge = await generateTuringTest();
    if (!challenge) {
      addChatMessage("System", "Failed to generate Turing Test. Try again later!");
      return;
    }
  console.log("I'll give you a hint Charlie, the correct answer is:", challenge.correctAnswer);
  const { question, correctAnswer, incorrectAnswers } = challenge;

  // Combine correct and incorrect answers, then shuffle
  const shuffledOptions = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);

  // Find the index of the correct answer after shuffling
  const correctIndex = shuffledOptions.indexOf(correctAnswer);

  // Set the state with the question, shuffled options, and correct index
  setTuringTestQuestion(question);
  setTuringTestCorrectAnswer(correctAnswer); // Optional: For debugging
  setTuringTestIncorrectAnswers(incorrectAnswers); // Optional: For debugging
  setTuringTestOptions(shuffledOptions);
  setTuringTestCorrectIndex(correctIndex); // Track the index of the correct answer
  setShowTuringTestModal(true);
  };

  return (
    <>
      <Canvas shadows camera={{ position: [0, 3, 6], fov: 60 }} style={{ height: '100vh', width: '100vw', backgroundImage: 'url("https://i.imgur.com/DbzqYAr.png")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <RoomModel position={[-3, -8, -3.5]} scale={[0.3, 0.3, 0.3]} rotation={[0, Math.PI / 2, 0]} />

        <Monitor
            chatMessages={chatMessages}
            onSendMessage={async (message) => {
                // Add Charlie's message to the chat log
                addChatMessage("Charlie", message);

                // Randomly select the first responder (Alice or Bob)
                const firstResponder = Math.random() > 0.5 ? "alice" : "bob";

                // Fetch response from the first responder
                const firstResponse = await sendMessageToAssistant(firstResponder, message, threadId);

                // Ensure valid response for the first responder
                const firstResponderName = firstResponder === "alice" ? "Alice" : "Bob";
                const firstResponderMessage = firstResponse || `${firstResponderName} seems to be pondering...`;
                addChatMessage(firstResponderName, firstResponderMessage);

                // Randomly decide the second response (either the other assistant or Charlie)
                const followUp = Math.random() > 0.5 ? "assistant" : "charlie";

                if (followUp === "assistant") {
                // The other assistant responds to the first assistant's response
                const secondResponder = firstResponder === "alice" ? "bob" : "alice";
                const secondResponse = await sendMessageToAssistant(secondResponder, firstResponderMessage, threadId);

                // Ensure valid response for the second responder
                const secondResponderName = secondResponder === "alice" ? "Alice" : "Bob";
                const secondResponderMessage = secondResponse || `${secondResponderName} has nothing to add right now.`;
                addChatMessage(secondResponderName, secondResponderMessage);
                } else {
                console.log("Charlie is thinking...");
                }
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
            <meshBasicMaterial color={node.color} transparent opacity={0} />
          </mesh>
        ))}

        <mesh
            position={CAPTCHA_ZONE.position}
            rotation={CAPTCHA_ZONE.rotation}
            onClick={handleCaptchaZoneClick}
            >
        <planeGeometry args={[CAPTCHA_ZONE.size[0], CAPTCHA_ZONE.size[1]]}/>
        <meshBasicMaterial color={CAPTCHA_ZONE.color} transparent opacity={0}/>
        </mesh>

        <mesh
            position={BLOG_ZONE.position}
            rotation={BLOG_ZONE.rotation}
            onClick={() => setShowBlogModal(true)}
            >
        <planeGeometry args={[BLOG_ZONE.size[0], BLOG_ZONE.size[1]]} />
        <meshBasicMaterial color={BLOG_ZONE.color} transparent opacity={0} />
        </mesh>

        <mesh
        position={TURING_ZONE.position}
        rotation={TURING_ZONE.rotation}
        onClick={handleTuringTestZoneClick}
        >
        <planeGeometry args={[TURING_ZONE.size[0], TURING_ZONE.size[1]]} />
        <meshBasicMaterial color="cyan" transparent opacity={0} />
        </mesh>

        <mesh
            position={DASHBOARD_ZONE.position} // Position of the dashboard zone in the scene
            rotation={DASHBOARD_ZONE.rotation} // Rotation of the dashboard zone in the scene
            onClick={() => setShowDashboardModal(true)}
            >
            <planeGeometry args={[DASHBOARD_ZONE.size[0], DASHBOARD_ZONE.size[1]]} />
            <meshBasicMaterial color="limegreen" transparent opacity={0} />
            </mesh>

        <mesh
        position={[22.5, 1, -13]} // Adjust position as needed
        rotation={[0, 5.5, 0]}
        onClick={() => setShowNotesDashboard(true)}
        >
        <planeGeometry args={[2.3, 3]} />
        <meshBasicMaterial color="orange" transparent opacity={0} />
        </mesh>

            

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={15}
          maxAzimuthAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 2}
          makeDefault
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
      {showCaptchaModal && (
        <CaptchaModal
          isOpen={showCaptchaModal}
          captchaType={captchaType}
          captchaData={captchaData}
          onClose={() => setShowCaptchaModal(false)}
          onComplete={handleCaptchaCompletion}
        />
      )}
      {showTuringTestModal && (
        <TuringTestModal
        isOpen={showTuringTestModal}
        question={turingTestQuestion}
        options={turingTestOptions}
        correctIndex={turingTestCorrectIndex}
        onClose={() => setShowTuringTestModal(false)}
        onComplete={handleTuringTestCompletion}
      />
      )}

        {showDashboardModal && (
        <DashboardModal
            isOpen={showDashboardModal}
            totalCorrect={totalCorrect}
            totalIncorrect={totalIncorrect}
            puzzlesCompleted={puzzlesCompleted}
            turingTestResults={turingTestResults}
            onClose={() => setShowDashboardModal(false)}
        />
        )}
        <BlogModal isOpen={showBlogModal} onClose={() => setShowBlogModal(false)} />
        <NotesDashboard
            isOpen={showNotesDashboard}
            notes={notes}
            onClose={() => setShowNotesDashboard(false)}
            />
    </>
  );
};

export default MainScene;