import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const RotatingShape = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = time / 4;
      meshRef.current.rotation.y = time / 2;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.2}>
      <torusKnotGeometry args={[2.5, 0.8, 256, 32]} />
      <meshStandardMaterial color="#00ffff" wireframe />
    </mesh>
  );
};

const HeroCanvas = () => {
  return (
    <div className="h-80 lg:h-[500px] w-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 10], fov: 30 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <RotatingShape />
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
