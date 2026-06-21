import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Award, ExternalLink } from 'lucide-react';
import certificatesData from '../data/certificates.json';

function CertificateNode({ cert, index, activeCert, onSelectCert, onViewCertificate }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Position in a vertical grid on the "left wall" (x = -8)
  const row = Math.floor(index / 3); // 2 rows
  const col = index % 3;             // 3 columns
  
  const posX = -8;
  const posY = 1.2 - row * 1.8;
  const posZ = -3 + col * 3;

  // Normal rotation: facing slightly towards the center (e.g. yaw angle)
  const normRotY = Math.PI / 2 - 0.2; 

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Smooth hover floating
    if (hovered && !isActive) {
      meshRef.current.position.x = posX + Math.sin(time * 3) * 0.08;
    } else {
      meshRef.current.position.x = posX;
    }
  });

  const isActive = activeCert && activeCert.id === cert.id;
  
  // Return different metallic colors/materials depending on theme for the 3D placeholder geometry
  const getThemeColor = () => {
    switch (cert.theme) {
      case 'theme-carbon': return '#475569';
      case 'theme-sapphire': return '#2563eb';
      case 'theme-emerald': return '#059669';
      case 'theme-platinum': return '#94a3b8';
      case 'theme-amethyst': return '#7c3aed';
      case 'theme-ruby': return '#db2777';
      default: return '#6366f1';
    }
  };

  return (
    <group 
      position={[posX, posY, posZ]} 
      rotation={[0, normRotY, 0]}
    >
      {/* 3D Card Frame Representation */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectCert(cert, [posX + 1.8, posY, posZ]);
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
        scale={isActive ? [1.2, 1.2, 1.2] : hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
      >
        <boxGeometry args={[0.08, 1.0, 1.6]} />
        <meshStandardMaterial
          color={getThemeColor()}
          roughness={0.15}
          metalness={0.9}
          emissive={getThemeColor()}
          emissiveIntensity={hovered || isActive ? 0.6 : 0.15}
        />
      </mesh>

      {/* Credit Card styled HUD Overlay */}
      <Html
        distanceFactor={8}
        center
        position={[0.1, 0, 0]} // Position card slightly offset from plane
        style={{ 
          pointerEvents: hovered || isActive ? 'auto' : 'none',
          opacity: hovered || isActive ? 1.0 : 0.55,
          transition: 'opacity 0.3s'
        }}
      >
        <div 
          className="r3f-cert-container"
          onClick={() => onSelectCert(cert, [posX + 1.8, posY, posZ])}
        >
          <div className={`cert-card-inner`} style={{ 
            transform: hovered && !isActive ? 'rotateY(10deg)' : isActive ? 'rotateY(180deg)' : 'none',
            height: '190px'
          }}>
            {/* FRONT FACE (Shown by default) */}
            <div className={`cert-card-front ${cert.theme}`} style={{ padding: '16px', height: '100%' }}>
              <div className="hologram-shine"></div>
              
              <div className="card-header-mc">
                <div className="issuer-logo-area">
                  <span className="issuer-name" style={{ fontSize: '0.75rem' }}>{cert.issuer}</span>
                  <span className="cert-card-type" style={{ fontSize: '0.45rem' }}>Premium Credential</span>
                </div>
                <Award className="w-6 h-6 text-white/90" />
              </div>
              
              <div className="gold-chip" style={{ width: '32px', height: '24px', marginTop: '6px' }}>
                <div className="chip-inner-lines"></div>
              </div>
              
              <div className="card-number-mc" style={{ fontSize: '0.75rem', margin: '8px 0 2px', fontFamily: 'monospace' }}>ID: {cert.credentialId}</div>
              
              <div className="card-footer-mc">
                <div className="card-holder-info">
                  <span className="card-holder-label" style={{ fontSize: '0.35rem' }}>ISSUED</span>
                  <span className="card-holder-name" style={{ fontSize: '0.65rem' }}>{cert.issueDate}</span>
                </div>
                
                <div className="mastercard-circles" style={{ height: '20px', width: '32px' }}>
                  <div className="mc-red" style={{ width: '18px', height: '18px' }}></div>
                  <div className="mc-orange" style={{ width: '18px', height: '18px' }}></div>
                </div>
              </div>
            </div>

            {/* BACK FACE (Flipped on click) */}
            <div className="cert-card-back" style={{ padding: '16px', height: '100%' }}>
              <div className="card-magnetic-stripe" style={{ height: '25px', marginTop: '-6px' }}></div>
              
              <div className="card-signature-area" style={{ height: '24px', marginTop: '4px' }}>
                <span className="card-signature-text" style={{ fontSize: '0.9rem' }}>Pranjal Shukla</span>
                <span className="card-cvv" style={{ fontSize: '0.7rem' }}>SECURE</span>
              </div>
              
              <div style={{ marginTop: '6px' }}>
                <h4 style={{ color: 'white', fontSize: '0.8rem', fontWeight: '700', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {cert.title}
                </h4>
                <p className="cert-desc-back" style={{ fontSize: '0.65rem', margin: '4px 0 10px', WebkitLineClamp: 2 }}>
                  {cert.description}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '6px', width: '100%', marginTop: 'auto' }}>
                <a 
                  href={cert.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="cert-btn-back button-hover-lift"
                  style={{ padding: '5px 10px', fontSize: '0.7rem', flex: 1.2 }}
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewCertificate(cert);
                  }}
                  className="cert-btn-back button-hover-lift"
                  style={{ 
                    padding: '5px 10px', 
                    fontSize: '0.7rem', 
                    flex: 1.0, 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    cursor: 'pointer'
                  }}
                >
                  <img src={cert.image} style={{ width: '15px', height: '10px', objectFit: 'cover', borderRadius: '1.5px', border: '1px solid rgba(255,255,255,0.4)', transition: 'transform 0.2s' }} className="btn-thumb" alt="" />
                  <span>Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function CertificateWall3D({ activeCert, onSelectCert, onViewCertificate }) {
  return (
    <group>
      {/* Visual background wireframe grid for Wall alignment */}
      <mesh position={[-8.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 6]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.03} />
      </mesh>
      
      {certificatesData.map((cert, idx) => (
        <CertificateNode
          key={cert.id}
          cert={cert}
          index={idx}
          activeCert={activeCert}
          onSelectCert={onSelectCert}
          onViewCertificate={onViewCertificate}
        />
      ))}
    </group>
  );
}
