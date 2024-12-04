import React from "react";
import { useGLTF } from "@react-three/drei";


const RoomModel = (props) => {
  const { scene } = useGLTF("./room3.glb");
  return (
    <primitive object={scene} {...props} />
  );
}

export default RoomModel;
