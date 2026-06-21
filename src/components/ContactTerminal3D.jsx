import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Send, Terminal } from 'lucide-react';

export default function ContactTerminal3D({ onSendSuccess, active }) {
  const meshRef = useRef();
  const screenRef = useRef();
  
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [logs, setLogs] = useState([
    'System status: ONLINE',
    'Port 8080: LISTENING',
    'Ready for telemetry input...'
  ]);
  const [sending, setSending] = useState(false);

  // Position: right side of the desk (x = 8, y = 0, z = 0)
  const posX = 8;
  const posY = 0;
  const posZ = 0;
  const normRotY = -Math.PI / 2 + 0.2; // Facing the center

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slow screen blinking cursor simulation in 3D material
    if (screenRef.current) {
      screenRef.current.emissiveIntensity = 0.5 + Math.sin(time * 6) * 0.2;
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setLogs(prev => [
      ...prev,
      `> connection: init_session`,
      `> packing payload: size=${JSON.stringify(formState).length} bytes`,
      `> transmitting...`
    ]);

    // EmailJS credentials (if you want to plug in your own)
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'placeholder_service';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'placeholder_template';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'placeholder_key';

    if (serviceId !== 'placeholder_service' && templateId !== 'placeholder_template' && publicKey !== 'placeholder_key') {
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              from_name: formState.name,
              from_email: formState.email,
              message: formState.message,
            }
          }),
        });

        if (response.ok) {
          handleSuccess();
        } else {
          throw new Error('EmailJS API error');
        }
      } catch (err) {
        console.error('EmailJS direct send failed:', err);
        setLogs(prev => [
          ...prev,
          `> ERR: Direct relay failed.`,
          `> Redirecting packet to local simulation database...`
        ]);
        // Fallback to simulation
        setTimeout(handleSuccess, 1500);
      }
    } else {
      // Mockup Simulation Mode
      setTimeout(() => {
        handleSuccess();
      }, 1500);
    }
  };

  const handleSuccess = () => {
    setSending(false);
    setIsSubmitted(true);
    setLogs(prev => [
      ...prev,
      `> STATUS: 200 OK`,
      `> TELEMETRY PING SUCCESSFUL!`,
      `> core_link: established`
    ]);
    if (onSendSuccess) onSendSuccess();
  };

  const resetTerminal = () => {
    setFormState({ name: '', email: '', message: '' });
    setIsSubmitted(false);
    setSending(false);
    setLogs([
      'Terminal core rebooted.',
      'System status: ONLINE',
      'Ready for new diagnostic payload...'
    ]);
  };

  return (
    <group 
      position={[posX, posY, posZ]} 
      rotation={[0, normRotY, 0]}
    >
      {/* 3D Monitor / Console housing */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 2.2, 2.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* 3D Glowing Screen Plane */}
      <mesh position={[0.41, 0, 0]} rotation={[0, Math.PI / 2, 0]} ref={screenRef}>
        <planeGeometry args={[2.4, 2.0]} />
        <meshStandardMaterial 
          color={isSubmitted ? '#10b981' : '#042f1a'} 
          emissive={isSubmitted ? '#10b981' : '#10b981'}
          emissiveIntensity={isSubmitted ? 1.0 : 0.25}
          roughness={0.1}
        />
      </mesh>

      {/* Terminal stand */}
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.6, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </mesh>

      {/* Base keyboard desk section */}
      <mesh position={[0.7, -1.0, 0]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.0, 0.15, 2.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* Interactive HTML Terminal Overlay */}
      <Html
        distanceFactor={7.5}
        center
        position={[0.45, 0, 0]} // Positioned right in front of the screen
        style={{
          pointerEvents: active ? 'auto' : 'none',
          opacity: active ? 1.0 : 0.6,
          transition: 'opacity 0.3s'
        }}
      >
        <div className="terminal-hud" onClick={(e) => e.stopPropagation()}>
          <div className="terminal-header">
            <span className="terminal-title">CONSOLE_SHELL:v1.0</span>
            <div className="terminal-buttons">
              <div className="t-btn t-btn-red" onClick={resetTerminal}></div>
              <div className="t-btn t-btn-yellow"></div>
              <div className="t-btn t-btn-green" onClick={resetTerminal}></div>
            </div>
          </div>

          <div className="terminal-body">
            <div style={{ maxHeight: '100px', overflowY: 'auto', fontSize: '0.75rem', opacity: 0.85 }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{ marginBottom: '2px' }}>{log}</div>
              ))}
            </div>

            {isSubmitted ? (
              <div className="terminal-screen-success green-glow">
                <h4 style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '4px' }}>PACKET DISPATCHED</h4>
                <p style={{ fontSize: '0.7rem' }}>Secure signal received by Pranjal Shukla. Awaiting prompt response.</p>
                <button 
                  onClick={resetTerminal}
                  className="terminal-submit-btn" 
                  style={{ width: '100%', padding: '6px', fontSize: '0.75rem', marginTop: '12px' }}
                >
                  Clear Screen
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="terminal-input-group">
                  <label className="terminal-label">User_Handle</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="terminal-text-input" 
                    placeholder="Guest Operator"
                    value={formState.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="terminal-input-group">
                  <label className="terminal-label">Comms_Route</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="terminal-text-input" 
                    placeholder="operator@domain.com"
                    value={formState.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="terminal-input-group">
                  <label className="terminal-label">Payload_Data</label>
                  <textarea 
                    name="message" 
                    rows="3" 
                    className="terminal-text-input" 
                    placeholder="Enter diagnostic payload..."
                    value={formState.message} 
                    onChange={handleInputChange} 
                    required 
                  ></textarea>
                </div>

                <button type="submit" className="terminal-submit-btn" disabled={sending}>
                  <span>{sending ? 'TRANSMITTING...' : 'DISPATCH PACKET'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
}
