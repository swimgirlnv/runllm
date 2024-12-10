import React from "react";

interface NotesZoneProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  onClick: () => void;
}

const NotesZone: React.FC<NotesZoneProps> = ({
  position,
  rotation,
  size,
  onClick,
}) => {
  return (
    <mesh position={position} rotation={rotation} onClick={onClick}>
      <planeGeometry args={size} />
      <meshBasicMaterial color="orange" transparent opacity={0.5} />
    </mesh>
  );
};

export default NotesZone;