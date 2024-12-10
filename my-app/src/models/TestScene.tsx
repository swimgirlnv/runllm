import { Canvas } from "@react-three/fiber";

function TestScene() {
  return (
    <Canvas>
      <ambientLight />
      <directionalLight />
      <mesh
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
}

export default TestScene;
