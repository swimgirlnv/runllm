import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { v4 as uuidv4 } from "uuid"; // Use UUID for thread IDs
import PuzzleModal from "../components/puzzles/PuzzleModal";
import CaptchaModal from "../components/puzzles/CaptchaModal";
import TuringTestModal from "../components/puzzles/TuringModal";
import DashboardModal from "../components/dashboards/DashboardModal";
import NotesDashboard from "../components/dashboards/NotesDashboard";
import BlogModal from "../components/zones/BlogModal";
import CaptchaZone from "../components/zones/CaptchaZone";
import DashboardZone from "../components/zones/DashboardZone";
import NotesZone from "../components/zones/NotesZone";
import TuringZone from "../components/zones/TuringZone";
import RoomModel from "../models/RoomModel";
import Monitor from "./MonitorScene";
import {
  generateCaptcha,
  generatePuzzle,
  generateTuringTest,
  sendMessageToAssistant,
} from "../GameManager/GameManager";
import GridGame from "../components/chollet/GridGame";
import GridZone from "../components/zones/GridZone";
import SlidingTileGame from "../components/puzzles/SlidingTilePuzzle";
import SlidingTileZone from "../components/zones/SlidingTileZone";
import OnOrOffGame from "../components/herring/OnOrOffGame";
import LoadingScreen from "../components/LoadingScene";
import PaperModal from "../components/zones/PaperModal";

export type GameState = "Act1" | "Act2" | "Act3" | "Act4";

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

const MainScene: React.FC = () => {
  // General state management
  const [gameState] = useState<GameState>("Act1");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [nodes, setNodes] = useState<Node[]>(initializeNodes());
  const [threadId] = useState(uuidv4());

  // Modals and tracking state
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [showNotesDashboard, setShowNotesDashboard] = useState(false);
  const [showCaptchaModal, setShowCaptchaModal] = useState(false);
  const [showTuringTestModal, setShowTuringTestModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showGridGameModal, setShowGridGameModal] = useState(false);
  const [showSlidingTileModal, setShowSlidingTileModal] = useState(false);

  // Statistics tracking
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalIncorrect, setTotalIncorrect] = useState(0);
  const [puzzlesCompleted, setPuzzlesCompleted] = useState(0);
  const [_captchaCompleted, setCaptchaCompleted] = useState(0);
  const [_turingTestsPassed, setTuringTestsPassed] = useState(0);
  const [turingTestResults, setTuringTestResults] = useState(0);

  // Turing Test tracking
  const [turingTestQuestion, setTuringTestQuestion] = useState<string>("");
  const [turingTestOptions, setTuringTestOptions] = useState<string[]>([]);
  const [turingTestCorrectIndex, setTuringTestCorrectIndex] = useState<
    number | null
  >(null);

  // Captcha and Turing Test modal states
  const [captchaType, setCaptchaType] = useState<string | null>(null);
  const [captchaData, setCaptchaData] = useState<any | null>(null);

  const [showOnOrOffModal, setShowOnOrOffModal] = useState(false);
  const [_trainingStats, setTrainingStats] = useState<{
    time: number;
    ruleMatch: boolean;
    trained: boolean;
  } | null>(null);

  const handleOnOrOffCompletion = async (stats: {
    trained: boolean;
    time: number;
    ruleMatch: boolean;
  }) => {
    setShowOnOrOffModal(false);
    setTrainingStats(stats);
    await addDynamicNote(
      "alice",
      `Charlie was successfully trained to recognize the On and Off patterns in a simple game. Time taken: ${
        stats.time
      }s. Rule Match: ${
        stats.ruleMatch ? "Yes" : "No"
      }. Does this mean he is thinking like a human or a machine?`
    );
    await addDynamicNote(
      "bob",
      `Charlie was successfully trained to recognize the On and Off patterns in a simple game. Time taken: ${
        stats.time
      }s. Rule Match: ${
        stats.ruleMatch ? "Yes" : "No"
      }.Does this mean he is thinking like a human or a machine?`
    );
  };

  const BLOG_ZONE = {
    id: "captchaZone",
    position: [21.1, -1, 11.4] as [number, number, number],
    rotation: [0, 4.23, 0] as [number, number, number],
    size: [5, 3.5],
    color: "gray",
  };

  // Handlers for Zones
  const handleCaptchaZoneClick = async () => {
    const captcha = await generateCaptcha();
    if (!captcha)
      return addChatMessage("System", "Failed to generate CAPTCHA.");
    setCaptchaType(captcha.type);
    setCaptchaData(captcha.data);
    setShowCaptchaModal(true);
  };

  const handleDashboardZoneClick = () => setShowDashboardModal(true);
  const handleNotesZoneClick = () => setShowNotesDashboard(true);
  const handleTuringZoneClick = async () => {
    const challenge = await generateTuringTest();
    if (!challenge)
      return addChatMessage("System", "Failed to generate Turing Test.");

    const { question, correctAnswer, incorrectAnswers } = challenge;
    const shuffledOptions = shuffleArray([correctAnswer, ...incorrectAnswers]);
    const correctIndex = shuffledOptions.indexOf(correctAnswer);

    setTuringTestQuestion(question);
    setTuringTestOptions(shuffledOptions);
    setTuringTestCorrectIndex(correctIndex);
    setShowTuringTestModal(true);
  };

  const handleCaptchaCompletion = (isSuccess: boolean) => {
    if (isSuccess) {
      setTotalCorrect((prev) => prev + 1);
      setCaptchaCompleted((prev) => prev + 1);
      addChatMessage("System", "CAPTCHA solved successfully!");
    } else {
      setTotalIncorrect((prev) => prev + 1);
      addChatMessage("System", "Failed the CAPTCHA.");
    }
    setShowCaptchaModal(false);
  };

  const handleTuringTestCompletion = (isSuccess: boolean) => {
    if (isSuccess) {
      setTotalCorrect((prev) => prev + 1);
      setTuringTestsPassed((prev) => prev + 1);
      setTuringTestResults((prev) => Math.min(prev + 20, 100));
      addChatMessage("System", "Turing Test passed!");
    } else {
      setTotalIncorrect((prev) => prev + 1);
      addChatMessage("System", "Turing Test failed.");
    }
    setShowTuringTestModal(false);
  };

  // Puzzle Interaction
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

      const question = newPuzzleContent.question;
      const correctAnswerLine = newPuzzleContent.correctAnswer;
      if (!correctAnswerLine) {
        addChatMessage("System", "Error: No correct answer found in puzzle.");
        return;
      }
      const correctAnswer = correctAnswerLine.replace("*", "").trim();
      const incorrectAnswers = newPuzzleContent.incorrectAnswers;

      const newPuzzle = {
        id: `puzzle-${Date.now()}`,
        question,
        options: [correctAnswer, ...incorrectAnswers].sort(
          () => Math.random() - 0.5
        ),
        correctAnswer,
      };

      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, puzzle: newPuzzle } : n))
      );

      addChatMessage("System", `Double click to access this puzzle.`);
    }

    setActiveNode(node);
  };

  const handlePuzzleAnswer = async (
    puzzleId: string,
    selectedOption: string
  ) => {
    const node = nodes.find((n) => n.puzzle?.id === puzzleId);
    if (!node || !node.puzzle)
      return addChatMessage("System", "Puzzle not found!");

    const isCorrect = selectedOption === node.puzzle.correctAnswer;
    if (isCorrect) {
      setTotalCorrect((prev) => prev + 1);
      setPuzzlesCompleted((prev) => prev + 1);
      unlockNode(node.id + 1);
      addChatMessage("Alice", "Correct! Well done.");
      await addDynamicNote(
        "alice",
        `Charlie successfully solved a puzzle in the "${node.theme}" theme.`
      );
      await addDynamicNote(
        "bob",
        `Charlie solved a puzzle. Do you think their logic was more human-like or algorithmic?`
      );
    } else {
      setTotalIncorrect((prev) => prev + 1);
      addChatMessage("Bob", "Incorrect. Try again.");

      await addDynamicNote(
        "alice",
        `Charlie struggled to solve a puzzle in the "${node.theme}" theme. What does that say about their reasoning ability?`
      );
      await addDynamicNote(
        "bob",
        `Charlie failed a puzzle. Even humans make mistakes, but is it a flaw of logic or creativity?`
      );
    }
    setActiveNode(null);
  };

  // Helper Functions
  const addChatMessage = (sender: string, message: string) => {
    setChatMessages((prev) => [...prev, `[${sender}]: ${message}`]);
  };

  const unlockNode = (nodeId: number) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, unlocked: true } : node
      )
    );
  };

  // const generateNodePuzzle = async (node: Node) => {
  //   const puzzle = await generatePuzzle(gameState);
  //   if (!puzzle) return addChatMessage("System", "Puzzle generation failed.");
  //   const shuffledOptions = shuffleArray([
  //     puzzle.correctAnswer,
  //     ...puzzle.incorrectAnswers,
  //   ]);
  //   const updatedNode = {
  //     ...node,
  //     puzzle: {
  //       id: `puzzle-${Date.now()}`,
  //       question: puzzle.question,
  //       options: shuffledOptions,
  //       correctAnswer: puzzle.correctAnswer,
  //     },
  //   };
  //   setNodes((prev) => prev.map((n) => (n.id === node.id ? updatedNode : n)));
  //   addChatMessage("System", `Puzzle ready for ${node.theme}.`);
  // };

  const addDynamicNote = async (
    assistant: "alice" | "bob",
    context: string
  ) => {
    const note = await sendMessageToAssistant(
      assistant,
      `You are acting as a scientist observing Charlie to see if he is a Human or a Large Language Model. Write an analysis/observation on Charlie given the following context: ${context}. You should format your response as an analysis or observation with reasoning on if you believe Charlie is a Human or a Large Language Model.`,
      threadId
    );
    setNotes((prev) => [
      ...prev,
      `${assistant === "alice" ? "Alice" : "Bob"}: ${note}`,
    ]);
  };

  const shuffleArray = (array: string[]) =>
    [...array].sort(() => Math.random() - 0.5);

  // Initialize Nodes
  function initializeNodes(): Node[] {
    return [
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
    ];
  }

  const handleGridGameCompletion = async (isCorrect: boolean) => {
    setShowGridGameModal(false);

    if (isCorrect) {
      setTotalCorrect((prev) => prev + 1);
      setPuzzlesCompleted((prev) => prev + 1);
      addChatMessage("System", "Grid task completed successfully!");
      await addDynamicNote(
        "alice",
        `Charlie successfully solved a François Chollet measure of intelligence test from the Abstraction and Reasoning Corpus (ARC). ARC can be used to measure a human-like form of general fluid intelligence and that it enables fair general intelligence comparisons between AI systems and humans.`
      );
      await addDynamicNote(
        "bob",
        `Charlie successfully solved a François Chollet measure of intelligence test from the Abstraction and Reasoning Corpus (ARC).ARC can be used to measure a human-like form of general fluid intelligence and that it enables fair general intelligence comparisons between AI systems and humans.`
      );
    } else {
      setTotalIncorrect((prev) => prev + 1);
      addChatMessage("System", "Grid task failed. Try again!");

      await addDynamicNote(
        "alice",
        `Charlie struggled to solve a François Chollet measure of intelligence test from the Abstraction and Reasoning Corpus (ARC). ARC can be used to measure a human-like form of general fluid intelligence and that it enables fair general intelligence comparisons between AI systems and humans.`
      );
      await addDynamicNote(
        "bob",
        `Charlie failed to solve a François Chollet measure of intelligence test from the Abstraction and Reasoning Corpus (ARC). ARC can be used to measure a human-like form of general fluid intelligence and that it enables fair general intelligence comparisons between AI systems and humans.`
      );
    }
  };

  // LOAD SCREEN
  const [isLoaded, setIsLoaded] = useState(false);

  // Handler for when the scene finishes loading
  const handleLoadComplete = () => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 500); // Delay for a smooth transition
  };

  // PAPER MODALS
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [currentPaper, setCurrentPaper] = useState<string | null>(null);

  const handlePaperClick = async (paperName: string) => {
    const response = await fetch(`/papers/${paperName}.md`);
    const text = await response.text();
    setCurrentPaper(text);
    setShowPaperModal(true);
  };

  return (
    <>
      {!isLoaded && <LoadingScreen />}
      <Canvas
        shadows
        camera={{ position: [0, 3, 6], fov: 60 }}
        style={{
          height: "100vh",
          width: "100vw",
          backgroundImage: 'url("https://i.imgur.com/DbzqYAr.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onCreated={() => handleLoadComplete()}
      >
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <RoomModel
          position={[-3, -8, -3.5]}
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, Math.PI / 2, 0]}
        />

        <RoomModel
          position={[-3, -8, -3.5]}
          scale={[0.3, 0.3, 0.3]}
          rotation={[0, Math.PI / 2, 0]}
        />

        <Monitor
          chatMessages={chatMessages}
          onSendMessage={async (message) => {
            // Add Charlie's message to the chat log
            addChatMessage("Charlie", message);

            // Randomly select the first responder (Alice or Bob)
            const firstResponder = Math.random() > 0.5 ? "alice" : "bob";

            // Fetch response from the first responder
            const firstResponse = await sendMessageToAssistant(
              firstResponder,
              message,
              threadId
            );

            // Ensure valid response for the first responder
            const firstResponderName =
              firstResponder === "alice" ? "Alice" : "Bob";
            const firstResponderMessage =
              firstResponse || `${firstResponderName} seems to be pondering...`;
            addChatMessage(firstResponderName, firstResponderMessage);

            // Randomly decide the second response (either the other assistant or Charlie)
            const followUp = Math.random() > 0.5 ? "assistant" : "charlie";

            if (followUp === "assistant") {
              // The other assistant responds to the first assistant's response
              const secondResponder =
                firstResponder === "alice" ? "bob" : "alice";
              const secondResponse = await sendMessageToAssistant(
                secondResponder,
                firstResponderMessage,
                threadId
              );

              // Ensure valid response for the second responder
              const secondResponderName =
                secondResponder === "alice" ? "Alice" : "Bob";
              const secondResponderMessage =
                secondResponse ||
                `${secondResponderName} has nothing to add right now.`;
              addChatMessage(secondResponderName, secondResponderMessage);
            } else {
              console.log("Charlie is thinking...");
            }
          }}
        />

        <GridZone
          position={[-3.8, 0, -13]}
          rotation={[5.5, 0, 0]}
          size={[2, 1.5]}
          onClick={() => setShowGridGameModal(true)}
        />

        {nodes.map((node) => (
          <mesh
            key={node.id}
            position={node.position}
            rotation={node.rotation}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "default")}
            onClick={() => handleNodeClick(node)}
          >
            <planeGeometry args={node.size} />
            <meshBasicMaterial color={node.color} transparent opacity={0} />
          </mesh>
        ))}

        <CaptchaZone
          position={[26.0, 2.5, -3]}
          rotation={[0, 5, 0]}
          size={[6, 5]}
          onClick={handleCaptchaZoneClick}
        />
        <DashboardZone
          position={[18.1, 1, -13]}
          rotation={[0, 5.6, 0]}
          size={[1.7, 3]}
          onClick={handleDashboardZoneClick}
        />
        <NotesZone
          position={[22.5, 1, -13]}
          rotation={[0, 5.5, 0]}
          size={[2.3, 3]}
          onClick={handleNotesZoneClick}
        />
        <TuringZone
          position={[21.1, -2, 2.1]}
          rotation={[0, 4.5, 0]}
          size={[4, 2]}
          onClick={handleTuringZoneClick}
        />
        <SlidingTileZone
          position={[0.3, -2, -11]}
          rotation={[5.5, 0, 0]}
          size={[1.5, 1]}
          onClick={() => setShowSlidingTileModal(true)}
        />

        {/* Blog Zone */}
        <mesh
          position={BLOG_ZONE.position}
          rotation={BLOG_ZONE.rotation}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "default")}
          onClick={() => setShowBlogModal(true)}
        >
          <planeGeometry args={[BLOG_ZONE.size[0], BLOG_ZONE.size[1]]} />
          <meshBasicMaterial color={BLOG_ZONE.color} transparent opacity={0} />
        </mesh>

        {/* Sliding Tile Paper Mesh */}
        <mesh
          position={[-2.4, -1.7, -11]}
          rotation={[5.5, 0, 0]}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "default")}
          onClick={() => setShowOnOrOffModal(true)}
        >
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="purple" transparent opacity={0} />
        </mesh>

        {/* Sliding Tile Paper Mesh */}
        <mesh
          position={[19.4, -2.2, -13]}
          rotation={[0, 5.65, 0]}
          onClick={() => handlePaperClick("SlidingTile")}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "default")}
        >
          <planeGeometry args={[2, .2]} />
          <meshStandardMaterial  color="purple" transparent opacity={0}/>
        </mesh>

        {/* On/Off Paper Mesh */}
        <mesh
          position={[19.4, -2.5, -13]}
          rotation={[0, 5.65, 0]}
          onClick={() => handlePaperClick("OnOff")}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "default")}
        >
          <planeGeometry args={[2, .2]} />
          <meshStandardMaterial  color="purple" transparent opacity={0}/>
        </mesh>

        {/* ARC Paper Mesh */}
        <mesh
          position={[19.6, -2.8, -13]}
          rotation={[0, 5.65, 0]}
          onClick={() => handlePaperClick("ARC")}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "default")}
        >
          <planeGeometry args={[2, .2]} />
          <meshStandardMaterial  color="purple" transparent opacity={0}/>
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
          puzzle={activeNode.puzzle}
          onClose={() => setActiveNode(null)}
          handleAnswer={handlePuzzleAnswer}
        />
      )}
      {showCaptchaModal && (
        <CaptchaModal
          isOpen={showCaptchaModal}
          captchaType={captchaType!}
          captchaData={captchaData!}
          onComplete={handleCaptchaCompletion}
          onClose={() => setShowCaptchaModal(false)}
        />
      )}
      {showTuringTestModal && (
        <TuringTestModal
          isOpen={showTuringTestModal}
          question={turingTestQuestion}
          options={turingTestOptions}
          correctIndex={turingTestCorrectIndex ?? 0}
          onComplete={handleTuringTestCompletion}
          onClose={() => setShowTuringTestModal(false)}
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
      {showNotesDashboard && (
        <NotesDashboard
          isOpen={showNotesDashboard}
          notes={notes}
          onClose={() => setShowNotesDashboard(false)}
        />
      )}
      {showBlogModal && (
        <BlogModal
          isOpen={showBlogModal}
          onClose={() => setShowBlogModal(false)}
        />
      )}
      {showGridGameModal && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          <GridGame onComplete={handleGridGameCompletion} />
        </div>
      )}

      {showSlidingTileModal && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "2px solid black",
            borderRadius: "10px",
          }}
        >
          <SlidingTileGame
            imageUrl="https://i.imgur.com/BRp9QVl.png"
            onComplete={() => {
              setShowSlidingTileModal(false);
              alert("You solved the sliding puzzle!");
            }}
          />
          <button
            onClick={() => setShowSlidingTileModal(false)}
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Close
          </button>
        </div>
      )}

      {showOnOrOffModal && (
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
            zIndex: 1000,
          }}
        >
          <OnOrOffGame onComplete={handleOnOrOffCompletion} />
        </div>
      )}

      {showPaperModal && (
        <PaperModal
          isOpen={showPaperModal}
          paperContent={currentPaper}
          onClose={() => setShowPaperModal(false)}
        />
      )}
    </>
  );
};

export default MainScene;
