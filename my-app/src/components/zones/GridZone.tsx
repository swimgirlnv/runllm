import React from "react";
import Tooltip from "../ToolTip";

interface GridZoneProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  onClick: () => void;
}

const GridZone: React.FC<GridZoneProps> = ({
  position,
  rotation,
  size,
  onClick,
}) => {
  return (
    <Tooltip message="ARC Game" offset={[0, -4, 0]}>
      <mesh
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
        position={position}
        rotation={rotation}
        onClick={onClick}
      >
        <planeGeometry args={size} />
        <meshBasicMaterial color="purple" transparent opacity={0} />
      </mesh>
    </Tooltip>
  );
};

export default GridZone;
