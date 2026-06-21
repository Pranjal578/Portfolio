import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ExternalLink, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Terminal, 
  Sparkles,
  Code,
  Server
} from 'lucide-react';
import projectsData from '../data/projects.json';
import certificatesData from '../data/certificates.json';

export default function MobileFallback({ onViewMedia }) {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [terminalLogs, setTerminalLogs] = useState([
    'System initialization successful.',
    'Ready for diagnostic transmission...',
    'Enter contact parameters below:'
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTerminalLogs(prev => [
      ...prev,
      `> INITIATING CONNECT: ${formState.name.toUpperCase()}`,
      `> PACKAGING DATA STREAM...`,
      `> UPLOADING TO SECURE PROTOCOL...`
    ]);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitted(true);
      setTerminalLogs(prev => [
        ...prev,
        `> TRANSMISSION COMPLETE: PULSE RECEIVED!`,
        `> SECURE CONNECTION ACKNOWLEDGED.`
      ]);
    }, 1200);
  };

  const resetTerminal = () => {
    setFormState({ name: '', email: '', message: '' });
    setIsSubmitted(false);
    setTerminalLogs([
      'System reset complete.',
      'Ready for new diagnostic transmission...',
      'Enter contact parameters below:'
    ]);
  };

  return (
    <div className="fallback-viewport">
      {/* MOBILE HERO SECTION */}
      <section className="hero" style={{ minHeight: 'auto', padding: '100px 0 60px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="tag" style={{ marginBottom: '16px' }}>AI, IoT & DevOps Specialist</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px' }}>
              Hi, I'm <span className="gradient-text">Pranjal Shukla</span>
            </h1>
            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 30px' }}>
              A full-stack engineer merging creative 3D interfaces with high-end cloud architecture and autonomous AI agent systems.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#projects-list" className="btn btn-primary gradient-bg">
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#contact-terminal" className="btn btn-secondary">
                <span>Terminal Connect</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="about-card glass" style={{ padding: '24px' }}>
            <h3 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>
              Technical Depth Meets Vision
            </h3>
            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.95rem', marginBottom: '16px', lineHeight: 1.5 }}>
              I focus on the intersection of physical hardware endpoints (IoT), data models (Machine Learning), and scalable hosting infrastructure (DevOps). I bridge complex backend systems with lightweight, interactive frontend designs.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
              <div className="stack-item" style={{ fontSize: '0.85rem' }}><Sparkles className="w-4 h-4" /> <span>Agentic AI Loops</span></div>
              <div className="stack-item" style={{ fontSize: '0.85rem' }}><Code className="w-4 h-4" /> <span>Next.js / React</span></div>
              <div className="stack-item" style={{ fontSize: '0.85rem' }}><Server className="w-4 h-4" /> <span>Kubernetes / DevOps</span></div>
              <div className="stack-item" style={{ fontSize: '0.85rem' }}><Award className="w-4 h-4" /> <span>IoT Auto Systems</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects-list" style={{ padding: '40px 0' }}>
        <div className="container">
          <h2 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>
            Featured Engine Cluster
          </h2>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem', marginBottom: '32px', textAlign: 'center' }}>
            A config-driven index of my development projects.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {projectsData.map((project) => (
              <div key={project.id} className="project-card glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{project.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`status-pulse ${project.isLive ? '' : 'offline'}`}></span>
                    <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>
                      {project.isLive ? 'LIVE' : 'GITHUB ONLY'}
                    </span>
                  </div>
                </div>
                
                <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.4 }}>
                  {project.description}
                </p>

                <div className="project-tags" style={{ marginBottom: '20px' }}>
                  {project.tech.map((techItem, index) => (
                    <span key={index} className="tag" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                      {techItem}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', flexWrap: 'wrap' }}>
                  <a 
                    href={project.repoLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary button-hover-lift" 
                    style={{ flex: 1.2, minWidth: '75px', padding: '10px', fontSize: '0.8rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>Repo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button 
                    onClick={() => onViewMedia(project)} 
                    className="btn btn-secondary button-hover-lift" 
                    style={{ flex: 1.0, minWidth: '75px', padding: '10px', fontSize: '0.8rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <img src={project.image} style={{ width: '15px', height: '10px', objectFit: 'cover', borderRadius: '1.5px', border: '1px solid rgba(255,255,255,0.4)', transition: 'transform 0.2s' }} className="btn-thumb" alt="" />
                    <span>Image</span>
                  </button>
                  {project.isLive ? (
                    <a 
                      href={project.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary gradient-bg button-hover-lift" 
                      style={{ flex: 1.2, minWidth: '75px', padding: '10px', fontSize: '0.8rem', justifyContent: 'center' }}
                    >
                      <span>Demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="btn btn-secondary" style={{ flex: 1.2, minWidth: '75px', padding: '10px', fontSize: '0.8rem', justifyContent: 'center', opacity: 0.5, cursor: 'not-allowed' }}>
                      <span>No Demo</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATES SECTION */}
      <section id="certificates-list" style={{ padding: '40px 0' }}>
        <div className="container">
          <h2 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>
            Credential Registry
          </h2>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem', marginBottom: '32px', textAlign: 'center' }}>
            Verified certifications mapping professional expertise.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {certificatesData.map((cert) => (
              <div key={cert.id} className={`cert-card-front ${cert.theme}`} style={{ position: 'relative', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                <div className="card-header-mc">
                  <div className="issuer-logo-area">
                    <span className="issuer-name" style={{ fontSize: '0.8rem' }}>{cert.issuer}</span>
                    <span className="cert-card-type" style={{ fontSize: '0.5rem' }}>ID: {cert.credentialId}</span>
                  </div>
                  <Award className="w-6 h-6 text-white/95" />
                </div>

                <div style={{ margin: '10px 0' }}>
                  <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.2 }}>{cert.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', marginTop: '4px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {cert.description}
                  </p>
                </div>

                <div className="card-footer-mc" style={{ border: 'none', paddingTop: 0 }}>
                  <div className="card-holder-info">
                    <span className="card-holder-label" style={{ fontSize: '0.4rem' }}>ISSUED</span>
                    <span className="card-holder-name" style={{ fontSize: '0.75rem' }}>{cert.issueDate}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <a 
                      href={cert.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none', color: '#fff', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {cert.image && (
                      <button 
                        onClick={() => onViewMedia(cert)}
                        className="button-hover-lift"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '6px', color: '#fff', fontSize: '0.65rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <img src={cert.image} style={{ width: '15px', height: '10px', objectFit: 'cover', borderRadius: '1.5px', border: '1px solid rgba(255,255,255,0.4)', transition: 'transform 0.2s' }} className="btn-thumb" alt="" />
                        <span>Image</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT TERMINAL SECTION */}
      <section id="contact-terminal" style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <h2 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>
            Secure Core Terminal
          </h2>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem', marginBottom: '32px', textAlign: 'center' }}>
            Transmit a telemetry ping directly to my workspace database.
          </p>

          <div style={{ maxWidth: '450px', margin: '0 auto' }}>
            <div className="terminal-hud" style={{ width: '100%' }}>
              <div className="terminal-header">
                <span className="terminal-title">PRANJAL@WORKSPACE:~</span>
                <div className="terminal-buttons">
                  <div className="t-btn t-btn-red" onClick={resetTerminal}></div>
                  <div className="t-btn t-btn-yellow"></div>
                  <div className="t-btn t-btn-green" onClick={resetTerminal}></div>
                </div>
              </div>

              <div className="terminal-body">
                <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} style={{ marginBottom: '4px' }}>{log}</div>
                  ))}
                </div>

                {isSubmitted ? (
                  <div className="terminal-screen-success green-glow">
                    <h4 style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>TRANSMISSION RECEIVED</h4>
                    <p style={{ fontSize: '0.7rem' }}>Thank you, secure link established. Returning to base state...</p>
                    <button 
                      onClick={resetTerminal}
                      className="terminal-submit-btn" 
                      style={{ width: '100%', marginTop: '12px', padding: '6px', fontSize: '0.75rem' }}
                    >
                      Reset Core Terminal
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="terminal-input-group">
                      <label className="terminal-label">Ident_Name</label>
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
                      <label className="terminal-label">Comms_Email</label>
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
                      <label className="terminal-label">Packet_Message</label>
                      <textarea 
                        name="message" 
                        rows="3" 
                        className="terminal-text-input" 
                        placeholder="Type transmission payload..."
                        value={formState.message} 
                        onChange={handleInputChange} 
                        required 
                      ></textarea>
                    </div>

                    <button type="submit" className="terminal-submit-btn">
                      <span>Transmit Telemetry</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <div className="contact-info-item">
                <Mail className="w-5 h-5 text-indigo-500" style={{ color: 'hsl(var(--primary))' }} />
                <span style={{ fontSize: '0.9rem' }}>pranjalshukla2222@gmail.com</span>
              </div>
              <div className="contact-info-item">
                <Phone className="w-5 h-5 text-indigo-500" style={{ color: 'hsl(var(--primary))' }} />
                <span style={{ fontSize: '0.9rem' }}>+91 9306288370</span>
              </div>
              <div className="contact-info-item">
                <MapPin className="w-5 h-5 text-indigo-500" style={{ color: 'hsl(var(--primary))' }} />
                <span style={{ fontSize: '0.9rem' }}>Prayagraj, India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '30px 0', borderTop: '1px solid var(--glass-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
            &copy; {new Date().getFullYear()} Pranjal Shukla. Custom Mobile Engine.
          </p>
        </div>
      </footer>
    </div>
  );
}
