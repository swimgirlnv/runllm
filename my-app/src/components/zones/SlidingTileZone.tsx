import React from "react";

interface SlidingTileZoneProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
  onClick: () => void;
}

const SlidingTileZone: React.FC<SlidingTileZoneProps> = ({
  position,
  rotation = [0, 0, 0],
  size,
  onClick,
}) => {
  return (
    <mesh
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
      position={position}
      rotation={rotation}
      onClick={onClick}
    >
      <planeGeometry args={size} />
      <meshBasicMaterial color="green" transparent opacity={0} />
    </mesh>
  );
};

export default SlidingTileZone;
