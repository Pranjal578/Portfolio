import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Suspense } from 'react';
import './HeroModel3D.css';

function TexturedBox() {
  const texture = useTexture('/profile.jpg');
  return (
    <mesh rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial map={texture} metalness={0.2} roughness={0.8} />
    </mesh>
  );
}

export default function HeroModel3D() {
  return (
    <div className="hero-model-wrapper">
      <Canvas camera={{ position: [0, 0, 3] }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <Suspense fallback={null}>
          <TexturedBox />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
