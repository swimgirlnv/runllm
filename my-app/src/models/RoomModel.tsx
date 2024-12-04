import { useGLTF } from '@react-three/drei';

function RoomModel(props: any): JSX.Element | null {

  // Always call useGLTF with a placeholder or fallback URL
  const { scene } = useGLTF("https://firebasestorage.googleapis.com/v0/b/runllm.firebasestorage.app/o/room3.glb?alt=media");


  return <primitive object={scene} {...props} />;
}

export default RoomModel;