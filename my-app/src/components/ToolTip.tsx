import React, { useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TooltipProps {
  message: string;
  offset?: [number, number, number]; // Offset for positioning
  children: React.ReactNode; // The mesh or object this tooltip is attached to
}

const Tooltip: React.FC<TooltipProps> = ({
  message,
  offset = [0, 0.5, 0], // Default offset
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const tooltipRef = useRef<any>();
  const { camera } = useThree();

  // Update the tooltip's position and orientation every frame
  useFrame(() => {
    if (tooltipRef.current && isHovered) {
      // Position the tooltip relative to the parent mesh
      const parentPosition = tooltipRef.current.parent?.position || new THREE.Vector3();
      const tooltipPosition = new THREE.Vector3(
        parentPosition.x + offset[0],
        parentPosition.y + offset[1],
        parentPosition.z + offset[2]
      );

      tooltipRef.current.position.copy(tooltipPosition);

      // Ensure the tooltip faces the camera
      tooltipRef.current.lookAt(camera.position);
    }
  });

  return (
    <group>
      {/* Mesh that triggers the tooltip */}
      <group
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        {children}
      </group>

      {/* Tooltip text */}
      {isHovered && (
        <Text
          ref={tooltipRef}
          fontSize={0.18}
          color="white"
          outlineWidth={0.02}
          outlineColor="black"
          anchorX="center"
          anchorY="middle"
        >
          {message}
        </Text>
      )}
    </group>
  );
};

export default Tooltip;