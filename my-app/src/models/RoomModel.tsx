import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type GLTFResult = GLTF & {
  nodes: any;
  materials: any;
};

useGLTF.preload('/room3.glb');

function RoomModel(props: any): JSX.Element {
  const { scene } = useGLTF('/room3.glb') as GLTFResult;
  return <primitive object={scene} {...props} />;
}

export default RoomModel;