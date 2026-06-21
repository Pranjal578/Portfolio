import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ExternalLink, ArrowRight } from 'lucide-react';
import projectsData from '../data/projects.json';

function ProjectNode({ project, index, activeProject, onSelectProject, totalProjects, onViewMedia }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Position node in an orbital ring around the center
  const angle = (index / totalProjects) * Math.PI * 2;
  const radius = 8; // distance from central AI orb
  const posX = Math.cos(angle) * radius;
  const posZ = Math.sin(angle) * radius;
  const posY = (index % 2 === 0 ? 0.75 : -0.75); // stagger height for readability

  // Slow self-rotation and minor floating motion
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.3 + index;
    meshRef.current.rotation.x = time * 0.15 + index;
    meshRef.current.position.y = posY + Math.sin(time * 2 + index) * 0.15;
  });

  const isActive = activeProject && activeProject.id === project.id;
  const nodeScale = isActive ? 1.6 : hovered ? 1.3 : 1.0;

  // Render a distinct geometry based on project focus
  // e.g. AI gets TorusKnot, DevOps gets Octahedron, IoT gets Dodecahedron, others get boxes/spheres
  const renderGeometry = () => {
    if (project.title.toLowerCase().includes('engine') || project.title.toLowerCase().includes('jarvis')) {
      return <torusKnotGeometry args={[0.3, 0.1, 64, 8]} />;
    } else if (project.title.toLowerCase().includes('devops') || project.title.toLowerCase().includes('siem')) {
      return <octahedronGeometry args={[0.45]} />;
    } else if (project.title.toLowerCase().includes('pump') || project.title.toLowerCase().includes('hostel')) {
      return <dodecahedronGeometry args={[0.45]} />;
    } else {
      return <boxGeometry args={[0.7, 0.7, 0.7]} />;
    }
  };

  // Node theme color based on index
  const colors = [
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#3b82f6'  // Blue
  ];
  const nodeColor = colors[index % colors.length];

  return (
    <group position={[posX, posY, posZ]}>
      {/* Node Object */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectProject(project, [posX, posY, posZ]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        scale={[nodeScale, nodeScale, nodeScale]}
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={nodeColor}
          roughness={0.1}
          metalness={0.9}
          emissive={nodeColor}
          emissiveIntensity={hovered || isActive ? 1.0 : 0.25}
        />
      </mesh>

      {/* Outer halo ring for visual depth */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.4 * nodeScale, 1.4 * nodeScale, 1.4 * nodeScale]}>
        <ringGeometry args={[0.38, 0.42, 32]} />
        <meshBasicMaterial color={nodeColor} transparent opacity={0.3} side={2} />
      </mesh>

      {/* Floating Tooltip Label (hover state) */}
      {hovered && !isActive && (
        <Html distanceFactor={12} center style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: `1px solid ${nodeColor}`,
            padding: '6px 12px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            fontWeight: '600',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
          }}>
            {project.title}
          </div>
        </Html>
      )}

      {/* Selected Project Card Glassmorphism Overlay */}
      {isActive && (
        <Html
          distanceFactor={10}
          center
          position={[0, 1.5, 0]} // Position card slightly above the node
          style={{ pointerEvents: 'auto' }}
        >
          <div className="r3f-project-card" style={{ borderLeft: `4px solid ${nodeColor}` }}>
            <div className="r3f-project-header">
              <span className="r3f-project-title">{project.title}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className={`status-pulse ${project.isLive ? '' : 'offline'}`}></span>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>
                  {project.isLive ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
            </div>

            <p className="r3f-project-desc">{project.description}</p>

            <div className="r3f-tech-tags">
              {project.tech.map((tag, idx) => (
                <span key={idx} className="r3f-tag" style={{
                  color: nodeColor,
                  borderColor: `${nodeColor}40`,
                  background: `${nodeColor}10`
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="r3f-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href={project.repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="r3f-btn r3f-btn-secondary button-hover-lift"
                style={{ flex: 1.2, minWidth: '70px', padding: '6px 8px', fontSize: '0.75rem' }}
              >
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                <span>GitHub</span>
              </a>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMedia(project);
                }}
                className="r3f-btn r3f-btn-secondary button-hover-lift"
                style={{ flex: 1.0, minWidth: '70px', padding: '6px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <img src={project.image} style={{ width: '15px', height: '10px', objectFit: 'cover', borderRadius: '1.5px', border: '1px solid rgba(255,255,255,0.4)', transition: 'transform 0.2s' }} className="btn-thumb" alt="" />
                <span>Image</span>
              </button>

              {project.isLive ? (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="r3f-btn r3f-btn-primary button-hover-lift"
                  style={{ flex: 1.2, minWidth: '70px', padding: '6px 8px', fontSize: '0.75rem', background: `linear-gradient(135deg, ${nodeColor} 0%, #1e1b4b 100%)` }}
                >
                  <span>Launch</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div className="r3f-btn r3f-btn-disabled" style={{ flex: 1.2, minWidth: '70px', padding: '6px 8px', fontSize: '0.75rem' }}>
                  <span>No Demo</span>
                </div>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function ProjectCluster3D({ activeProject, onSelectProject, onViewMedia }) {
  const groupRef = useRef();

  // Gentle full cluster rotation over time
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    // Do not rotate cluster when a specific project is selected so cards are easier to interact with
    if (!activeProject) {
      groupRef.current.rotation.y = time * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbital Path Guides */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.95, 8.05, 128]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.06} side={2} />
      </mesh>
      
      {projectsData.map((project, idx) => (
        <ProjectNode
          key={project.id}
          project={project}
          index={idx}
          activeProject={activeProject}
          onSelectProject={onSelectProject}
          totalProjects={projectsData.length}
          onViewMedia={onViewMedia}
        />
      ))}
    </group>
  );
}
