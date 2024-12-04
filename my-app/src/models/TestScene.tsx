import { Canvas } from '@react-three/fiber';

function TestScene() {
  return (
    <Canvas>
      <ambientLight />
      <directionalLight />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
}

export default TestScene;