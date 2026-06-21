import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Terminal as TerminalIcon, 
  Layers, 
  Award, 
  Cpu, 
  Home, 
  HelpCircle,
  Monitor
} from 'lucide-react';

import ProjectCluster3D from './ProjectCluster3D';
import CertificateWall3D from './CertificateWall3D';
import ContactTerminal3D from './ContactTerminal3D';

// Camera controller component inside Canvas to drive smooth lerping transitions
function CameraDirector({ targetPos, targetLook, controlsRef }) {
  const { camera } = useThree();
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // Lerp Camera position
    camera.position.lerp(targetPos, 0.05);

    // Lerp OrbitControls target
    if (controlsRef.current) {
      currentLook.current.lerp(targetLook, 0.05);
      controlsRef.current.target.copy(currentLook.current);
      controlsRef.current.update();
    }
  });

  return null;
}

// 3D Agentic Core (Gyroscopic glowing rings and core representing Agentic AI focus)
function AgenticCore3D({ isTransmitting, onSelectCore }) {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const coreRef = useRef();

  // Mouse tilt tracking variables
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speedMultiplier = isTransmitting ? 4 : 1;

    // Self rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.15 * speedMultiplier;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.4 * speedMultiplier;
      ring1Ref.current.rotation.y = time * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = time * 0.5 * speedMultiplier;
      ring2Ref.current.rotation.x = -time * 0.3;
    }

    // Floating animation
    if (coreRef.current) {
      coreRef.current.position.y = Math.sin(time * 1.8) * 0.2;
    }

    // Slight parallax react to mouse
    const pointer = state.pointer;
    targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, pointer.y * 0.3, 0.05);
    targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, pointer.x * 0.3, 0.05);

    if (groupRef.current) {
      groupRef.current.rotation.x = targetRotation.current.x;
      // Add standard rotation to pointer rotation
      groupRef.current.rotation.y += targetRotation.current.y * 0.1;
    }
  });

  // Glowing core color turns bright green on message transmit success
  const coreColor = isTransmitting ? '#10b981' : '#6366f1';
  const emissionIntensity = isTransmitting ? 3.0 : 1.2;

  return (
    <group 
      ref={groupRef} 
      onClick={(e) => {
        e.stopPropagation();
        onSelectCore();
      }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Inner Glowing Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={emissionIntensity}
          roughness={0.05}
          metalness={0.9}
        />
      </mesh>

      {/* Wireframe Outer Gyro Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.8, 0.06, 16, 64]} />
        <meshStandardMaterial 
          color="#a5b4fc" 
          emissive="#8b5cf6" 
          emissiveIntensity={0.6} 
          wireframe 
        />
      </mesh>

      {/* Wireframe Outer Gyro Ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.05, 16, 64]} />
        <meshStandardMaterial 
          color="#f472b6" 
          emissive="#db2777" 
          emissiveIntensity={0.6} 
          wireframe 
        />
      </mesh>

      {/* Outer Point Orbit Lights */}
      <group rotation={[0, 0, Math.PI / 4]}>
        <mesh position={[2.8, 0, 0]}>
          <octahedronGeometry args={[0.15]} />
          <meshBasicMaterial color="#34d399" />
        </mesh>
        <mesh position={[-2.8, 0, 0]}>
          <octahedronGeometry args={[0.15]} />
          <meshBasicMaterial color="#34d399" />
        </mesh>
      </group>
    </group>
  );
}

export default function DigitalWorkspace({ viewMode, setViewMode, onViewMedia }) {
  const controlsRef = useRef();

  // Define target states for flying camera
  const [targetPos, setTargetPos] = useState(new THREE.Vector3(0, 3, 12));
  const [targetLook, setTargetLook] = useState(new THREE.Vector3(0, 0, 0));
  
  // Track selected elements
  const [activeProject, setActiveProject] = useState(null);
  const [activeCert, setActiveCert] = useState(null);
  
  // Track system status
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [activeArea, setActiveArea] = useState('home'); // home, projects, certificates, contact

  const handleSelectProject = (project, position) => {
    setActiveCert(null);
    if (activeProject && activeProject.id === project.id) {
      // De-select, return to general projects view
      setActiveProject(null);
      setTargetPos(new THREE.Vector3(0, 2, 9));
      setTargetLook(new THREE.Vector3(0, 0, 0));
    } else {
      setActiveProject(project);
      // Zoom into project node: offset x by 0.5, y by 0.5, z by 2.6
      setTargetPos(new THREE.Vector3(position[0], position[1] + 0.5, position[2] + 2.6));
      setTargetLook(new THREE.Vector3(position[0], position[1], position[2]));
    }
  };

  const handleSelectCert = (cert, position) => {
    setActiveProject(null);
    if (activeCert && activeCert.id === cert.id) {
      // Return to general certificates wall view
      setActiveCert(null);
      setTargetPos(new THREE.Vector3(-5.5, 0.5, 0));
      setTargetLook(new THREE.Vector3(-8, 0.0, 0));
    } else {
      setActiveCert(cert);
      // Move camera close to certificate coordinates
      setTargetPos(new THREE.Vector3(position[0], position[1], position[2]));
      setTargetLook(new THREE.Vector3(-8, position[1], position[2]));
    }
  };

  const triggerTransmittingAnimation = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
    }, 4000);
  };

  // Flying navigation routes
  const navigateTo = (area) => {
    setActiveArea(area);
    setActiveProject(null);
    setActiveCert(null);

    switch(area) {
      case 'home':
        setTargetPos(new THREE.Vector3(0, 3, 12));
        setTargetLook(new THREE.Vector3(0, 0, 0));
        break;
      case 'projects':
        setTargetPos(new THREE.Vector3(0, 2, 9));
        setTargetLook(new THREE.Vector3(0, 0, 0));
        break;
      case 'certificates':
        setTargetPos(new THREE.Vector3(-5.5, 0.5, 0));
        setTargetLook(new THREE.Vector3(-8, 0, 0));
        break;
      case 'contact':
        setTargetPos(new THREE.Vector3(5.5, 0.1, 0.2));
        setTargetLook(new THREE.Vector3(8, 0, 0));
        break;
      default:
        break;
    }
  };

  return (
    <div className="workspace-viewport">
      {/* 3D Canvas Context */}
      <Canvas camera={{ position: [0, 3, 12], fov: 60 }}>
        {/* Lights configuration */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
        <pointLight position={[-10, 5, -10]} intensity={0.8} color="#f472b6" />
        <directionalLight position={[0, 10, 0]} intensity={0.4} />

        {/* Ambient star backgrounds */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1.2} />

        <Suspense fallback={null}>
          {/* Central Gyroscopic Agentic AI Orb */}
          <group position={[0, 0, 0]}>
            <AgenticCore3D 
              isTransmitting={isTransmitting} 
              onSelectCore={() => navigateTo('home')} 
            />
          </group>

          {/* Project Orbital Node Cluster */}
          <ProjectCluster3D 
            activeProject={activeProject} 
            onSelectProject={handleSelectProject} 
            onViewMedia={onViewMedia}
          />

          {/* Certificates Wall Grid */}
          <CertificateWall3D 
            activeCert={activeCert} 
            onSelectCert={handleSelectCert} 
            onViewCertificate={onViewMedia}
          />

          {/* Retro Command Console Terminal */}
          <ContactTerminal3D 
            onSendSuccess={triggerTransmittingAnimation}
            active={activeArea === 'contact'}
          />
        </Suspense>

        {/* Orbit Controls (enable zoom and moderate orbit bounds to prevent wall clipping) */}
        <OrbitControls 
          ref={controlsRef} 
          enablePan={activeArea !== 'contact'}
          enableZoom={true} 
          minDistance={2.5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2 + 0.15} // lock horizontal limit so they can't flip underground
        />

        {/* Smooth camera animation director */}
        <CameraDirector 
          targetPos={targetPos} 
          targetLook={targetLook} 
          controlsRef={controlsRef} 
        />
      </Canvas>

      {/* Floating 3D Controls Dashboard (Top-Right) */}
      <div className="workspace-controls">
        <button 
          className={`control-btn ${activeArea === 'home' ? 'active' : ''}`}
          onClick={() => navigateTo('home')}
          title="System Core"
        >
          <Home className="w-5 h-5" />
        </button>
        <button 
          className={`control-btn ${activeArea === 'projects' ? 'active' : ''}`}
          onClick={() => navigateTo('projects')}
          title="Project Cluster"
        >
          <Layers className="w-5 h-5" />
        </button>
        <button 
          className={`control-btn ${activeArea === 'certificates' ? 'active' : ''}`}
          onClick={() => navigateTo('certificates')}
          title="Certificate Wall"
        >
          <Award className="w-5 h-5" />
        </button>
        <button 
          className={`control-btn ${activeArea === 'contact' ? 'active' : ''}`}
          onClick={() => navigateTo('contact')}
          title="Contact Terminal"
        >
          <TerminalIcon className="w-5 h-5" />
        </button>
        <button 
          className="control-btn"
          onClick={() => setViewMode('2d')}
          title="Switch to 2D UI"
        >
          <Monitor className="w-5 h-5" />
        </button>
      </div>

      {/* HUD Navigation Helpers (Bottom Center) */}
      <div className="hud-helper">
        <div className="hud-item">
          <span className="hud-key">L-Click + Drag</span>
          <span>Rotate Orbit</span>
        </div>
        <div className="hud-item">
          <span className="hud-key">R-Click + Drag</span>
          <span>Pan Position</span>
        </div>
        <div className="hud-item">
          <span className="hud-key">Scroll</span>
          <span>Zoom</span>
        </div>
        <div className="hud-item" style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '16px' }}>
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span style={{ color: '#34d399' }}>AI_Engine: Active</span>
        </div>
      </div>
    </div>
  );
}
