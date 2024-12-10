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
    <mesh position={position} rotation={rotation} onClick={onClick}>
      <planeGeometry args={size} />
      <meshBasicMaterial color="yellow" transparent opacity={0.5} />
    </mesh>
  );
};

export default CaptchaZone;