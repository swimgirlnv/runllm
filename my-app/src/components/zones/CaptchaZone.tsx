import React from "react";

interface CaptchaZoneProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  onClick: () => void;
}

const CaptchaZone: React.FC<CaptchaZoneProps> = ({
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
      <meshBasicMaterial color="yellow" transparent opacity={0} />
    </mesh>
  );
};

export default CaptchaZone;
