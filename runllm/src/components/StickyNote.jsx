import React, { useState } from "react";
import { Text, Html } from "@react-three/drei";
import PuzzleModal from "./PuzzleModal";

function StickyNote({ position, text, puzzle, handleAnswer, onClick, onAnswer }) {
  const [isHovered, setHovered] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* 3D Sticky Note */}
      <mesh
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick} // Handle click to open modal
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color={isHovered ? "#f4f4a3" : "#ffff99"} />
        <Text
          position={[0, 0, 0.1]} // Slightly in front of the sticky note
          fontSize={0.2}
          color="black"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.9} // Fit text within the note
        >
          {text}
        </Text>
      </mesh>

      {/* Modal */}
      {isModalOpen && (
        <Html position={[0, 0, 0]} center>
          <PuzzleModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            puzzle={puzzle}
            onAnswer={handleAnswer}
          />
        </Html>
      )}
    </>
  );
}

export default StickyNote;
