import React from "react";

interface GridZoneProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  onClick: () => void;
}

const GridZone: React.FC<GridZoneProps> = ({ position, rotation, size, onClick }) => {
  return (
    <mesh position={position} rotation={rotation} onClick={onClick}>
      <planeGeometry args={size} />
      <meshBasicMaterial color="purple" transparent opacity={0} />
    </mesh>
  );
};

export default GridZone;