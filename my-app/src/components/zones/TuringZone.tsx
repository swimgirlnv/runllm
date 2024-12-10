import React from "react";

interface TuringZoneProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  onClick: () => void;
}

const TuringZone: React.FC<TuringZoneProps> = ({
  position,
  rotation,
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
      <meshBasicMaterial color="cyan" transparent opacity={0} />
    </mesh>
  );
};

export default TuringZone;
