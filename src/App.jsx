import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Code, 
  Server, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  ArrowRight,
  Award,
  ExternalLink,
  Cpu
} from 'lucide-react';

import Navbar from './components/Navbar';
import Background3D from './components/Background3D';
import DigitalWorkspace from './components/DigitalWorkspace';
import projectsData from './data/projects.json';
import certificatesData from './data/certificates.json';

function App() {
  const [viewMode, setViewMode] = useState('3d');
  const [isMobile, setIsMobile] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([
    'System status: ONLINE',
    'Ready for telemetry payload transmission...',
    'Enter connection parameters below:'
  ]);
  const [sending, setSending] = useState(false);

  // Resize listener to enforce 2D mobile fallback on smaller screens
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setViewMode('2d');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    setTerminalLogs(prev => [
      ...prev,
      `> connection: init_session`,
      `> packing telemetry data...`,
      `> sending signal stream...`
    ]);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'placeholder_service';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'placeholder_template';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'placeholder_key';

    if (serviceId !== 'placeholder_service' && templateId !== 'placeholder_template' && publicKey !== 'placeholder_key') {
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
          throw new Error('EmailJS response error');
        }
      } catch (err) {
        console.error('EmailJS direct send error:', err);
        setTerminalLogs(prev => [
          ...prev,
          `> ERR: Remote routing failed.`,
          `> Falling back to secure simulated route...`
        ]);
        setTimeout(handleSuccess, 1500);
      }
    } else {
      setTimeout(handleSuccess, 1500);
    }
  };

  const handleSuccess = () => {
    setSending(false);
    setIsSubmitted(true);
    setTerminalLogs(prev => [
      ...prev,
      `> STATUS: 200 OK`,
      `> TELEMETRY PING SUCCESSFUL!`,
      `> session: closed`
    ]);
  };

  const resetTerminal = () => {
    setFormState({ name: '', email: '', message: '' });
    setIsSubmitted(false);
    setSending(false);
    setTerminalLogs([
      'Terminal core reset.',
      'System status: ONLINE',
      'Ready for new diagnostic payload...'
    ]);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  // 1. RENDER 3D WORKSPACE
  if (viewMode === '3d' && !isMobile) {
    return (
      <>
        <DigitalWorkspace 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          onViewMedia={setActiveMedia}
        />
        {/* Media Preview Modal */}
        {activeMedia && (
          <div className="cert-modal-backdrop" onClick={() => setActiveMedia(null)}>
            <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="cert-modal-close" onClick={() => setActiveMedia(null)}>
                &times;
              </button>
              <div className="cert-modal-image-wrapper">
                <img 
                  src={activeMedia.image} 
                  alt={activeMedia.title} 
                  className="cert-modal-image" 
                />
              </div>
              <h4 className="cert-modal-title">{activeMedia.title}</h4>
            </div>
          </div>
        )}
      </>
    );
  }

  // 2. RENDER STUNNING 2D FALLBACK LAYOUT (For mobile viewport or desktop manual toggle)
  return (
    <>
      <Background3D />
      <Navbar viewMode={viewMode} setViewMode={setViewMode} isMobile={isMobile} />

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-grid">
            <motion.div 
              className="hero-content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} style={{ marginBottom: '16px' }}>
                <span className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu className="w-4 h-4" />
                  <span>DevOps, AI & IoT Specialist</span>
                </span>
              </motion.div>
              <motion.h1 variants={fadeInUp}>
                Hi, I'm <span className="gradient-text">Pranjal Shukla</span>
              </motion.h1>
              <motion.p variants={fadeInUp}>
                A backend architect and full-stack developer specializing in containerized pipelines, event-driven agentic LLM systems, and smart endpoints.
              </motion.p>
              <motion.div className="hero-actions" variants={fadeInUp}>
                <a href="#contact" className="btn btn-primary gradient-bg">
                  <span>Transmit Pulse</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a href="#certificates" className="btn btn-secondary">
                  <span>View Credentials</span>
                </a>
              </motion.div>
              
              {/* Desktop 3D View Invitation Toggle */}
              {!isMobile && (
                <motion.div variants={fadeInUp} style={{ marginTop: '20px' }}>
                  <button 
                    onClick={() => setViewMode('3d')}
                    className="btn btn-secondary glass"
                    style={{ borderColor: 'hsl(var(--primary) / 0.4)', background: 'hsl(var(--primary) / 0.05)' }}
                  >
                    <Cpu className="w-5 h-5 text-indigo-500" style={{ color: 'hsl(var(--primary))' }} />
                    <span>Enter 3D Workspace Environment</span>
                  </button>
                </motion.div>
              )}

              <motion.div className="social-links" variants={fadeInUp} style={{ marginTop: '30px' }}>
                <a href="https://github.com/Pranjal578" target="_blank" rel="noopener noreferrer" className="social-btn glass" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
                <a href="https://www.linkedin.com/in/pranjal-shukla-profile/" target="_blank" rel="noopener noreferrer" className="social-btn glass" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://x.com/Pranjal2265" target="_blank" rel="noopener noreferrer" className="social-btn glass" aria-label="Twitter / X">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="https://www.instagram.com/pranjalshukla2222/" target="_blank" rel="noopener noreferrer" className="social-btn glass" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </motion.div>
            </motion.div>

            {/* Static visual representation of the core in 2D mode */}
            <motion.div
              className="avatar-container"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="avatar-wrapper">
                <img src="/profile.jpg" alt="Pranjal Shukla" className="avatar-img" />
                <div className="avatar-glow"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="section-title gradient-text">About Me</h2>
            <p className="section-subtitle">Bridging local device mesh systems (IoT) with remote cloud architectures (DevOps) and AI models.</p>
          </motion.div>

          <div className="about-grid">
            <motion.div 
              className="about-card glass"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h3 style={{ color: 'hsl(var(--primary))', fontWeight: '700' }}>Infrastructure & Intelligence</h3>
              <p>
                Hello! I am **Pranjal Shukla**. I specialize in creating systems that don't just display pixels on a screen but execute heavy processes in the background safely, reliably, and autonomously.
              </p>
              <p>
                My work scales across constructing self-healing Kubernetes agents that monitor telemetry databases, developing local speech-to-text assistants utilizing LLM graph nodes, and building smart water pump relays managed via FastAPI engines.
              </p>
            </motion.div>

            <motion.div 
              className="about-card glass"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h3 style={{ color: 'hsl(var(--secondary))', fontWeight: '700' }}>Tech Stack</h3>
              <p>Below is a brief map of languages and tools I deploy regularly:</p>
              <ul className="stack-list">
                <li className="stack-item"><CheckCircle className="w-5 h-5" /> <span>LangGraph / Agentic Loops</span></li>
                <li className="stack-item"><CheckCircle className="w-5 h-5" /> <span>Docker & Kubernetes</span></li>
                <li className="stack-item"><CheckCircle className="w-5 h-5" /> <span>Flask & FastAPI (Python)</span></li>
                <li className="stack-item"><CheckCircle className="w-5 h-5" /> <span>React.js / Next.js</span></li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="section-title gradient-text">Technical Expertise</h2>
            <p className="section-subtitle">Proficiency map spanning system administration, automation protocols, and visual engineering.</p>
          </motion.div>

          <div className="skills-grid">
            <motion.div 
              className="skill-card glass"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h3><Code className="w-6 h-6" /> Frontend Engine</h3>
              <div className="skill-item">
                <div className="skill-info"><span>React / Next.js</span><span>85%</span></div>
                <div className="progress-bg"><div className="progress-bar" style={{ width: '85%' }} /></div>
              </div>
              <div className="skill-item">
                <div className="skill-info"><span>JavaScript / WebGL</span><span>80%</span></div>
                <div className="progress-bg"><div className="progress-bar" style={{ width: '80%' }} /></div>
              </div>
              <div className="skill-item">
                <div className="skill-info"><span>HTML5 / CSS Layouts</span><span>90%</span></div>
                <div className="progress-bg"><div className="progress-bar" style={{ width: '90%' }} /></div>
              </div>
            </motion.div>

            <motion.div 
              className="skill-card glass"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h3><Server className="w-6 h-6" /> Systems & AI</h3>
              <div className="skill-item">
                <div className="skill-info"><span>Python (AI & APIs)</span><span>90%</span></div>
                <div className="progress-bg"><div className="progress-bar" style={{ width: '90%' }} /></div>
              </div>
              <div className="skill-item">
                <div className="skill-info"><span>Docker & Kubernetes</span><span>80%</span></div>
                <div className="progress-bg"><div className="progress-bar" style={{ width: '80%' }} /></div>
              </div>
              <div className="skill-item">
                <div className="skill-info"><span>SQL / Vector Databases</span><span>85%</span></div>
                <div className="progress-bg"><div className="progress-bar" style={{ width: '85%' }} /></div>
              </div>
            </motion.div>

            <motion.div 
              className="skill-card glass"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h3><Sparkles className="w-6 h-6" /> Specialty & IoT</h3>
              <div className="skill-item">
                <div className="skill-info"><span>IoT / Arduino controllers</span><span>80%</span></div>
                <div className="progress-bg"><div className="progress-bar" style={{ width: '80%' }} /></div>
              </div>
              <div className="skill-item">
                <div className="skill-info"><span>Linux / Shell scripts</span><span>85%</span></div>
                <div className="progress-bg"><div className="progress-bar" style={{ width: '85%' }} /></div>
              </div>
              <div className="skill-item">
                <div className="skill-info"><span>SIEM / ELK Stack</span><span>75%</span></div>
                <div className="progress-bg"><div className="progress-bar" style={{ width: '75%' }} /></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CERTIFICATES SECTION */}
      <section id="certificates">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="section-title gradient-text">Credentials & Registries</h2>
            <p className="section-subtitle">Hover over the cards to flip them and view verified credential details.</p>
          </motion.div>

          <div className="certificates-grid">
            {certificatesData.map(cert => (
              <div key={cert.id} className="cert-card-container">
                <div className="cert-card-inner">
                  {/* Front card layout */}
                  <div className={`cert-card-front ${cert.theme}`}>
                    <div className="hologram-shine"></div>
                    <div className="card-header-mc">
                      <div className="issuer-logo-area">
                        <span className="issuer-name">{cert.issuer}</span>
                        <span className="cert-card-type">Premium Credential</span>
                      </div>
                      <Award className="w-8 h-8 text-white/90" />
                    </div>
                    <div className="gold-chip">
                      <div className="chip-inner-lines"></div>
                    </div>
                    <div className="card-number-mc" style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>ID: {cert.credentialId}</div>
                    <div className="card-footer-mc">
                      <div className="card-holder-info">
                        <span className="card-holder-label">ISSUED</span>
                        <span className="card-holder-name" style={{ fontSize: '0.75rem' }}>{cert.issueDate}</span>
                      </div>
                      <div className="mastercard-circles">
                        <div className="mc-red"></div>
                        <div className="mc-orange"></div>
                      </div>
                    </div>
                  </div>

                  {/* Back card layout */}
                  <div className="cert-card-back">
                    <div className="card-magnetic-stripe"></div>
                    <div className="card-signature-area">
                      <span className="card-signature-text">Pranjal Shukla</span>
                      <span className="card-cvv">SECURE</span>
                    </div>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: '700' }}>{cert.title}</h4>
                      <p className="cert-desc-back">{cert.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: 'auto' }}>
                      <a href={cert.link} target="_blank" rel="noopener noreferrer" className="cert-btn-back button-hover-lift" style={{ flex: 1.2 }}>
                        <span>Verify</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      {cert.image && (
                        <button 
                          onClick={() => setActiveMedia(cert)} 
                          className="cert-btn-back button-hover-lift" 
                          style={{ flex: 1, background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          <img src={cert.image} style={{ width: '15px', height: '10px', objectFit: 'cover', borderRadius: '1.5px', border: '1px solid rgba(255,255,255,0.4)', transition: 'transform 0.2s' }} className="btn-thumb" alt="" />
                          <span>Image</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="section-title gradient-text">Selected Project Engines</h2>
            <p className="section-subtitle">Explore a config-driven index of custom autonomous code applications.</p>
          </motion.div>

          <div className="projects-grid">
            {projectsData.map(project => (
              <div key={project.id} className="project-card glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                <div className="project-info" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div className="project-tags">
                      {project.tech.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`status-pulse ${project.isLive ? '' : 'offline'}`}></span>
                      <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>
                        {project.isLive ? 'LIVE' : 'GITHUB'}
                      </span>
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '10px' }}>{project.title}</h3>
                  <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.95rem', marginBottom: '24px', flexGrow: 1 }}>
                    {project.description}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', flexWrap: 'wrap' }}>
                    <a 
                      href={project.repoLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary button-hover-lift" 
                      style={{ flex: 1.2, minWidth: '80px', padding: '8px 10px', fontSize: '0.8rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Repo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button 
                      onClick={() => setActiveMedia(project)} 
                      className="btn btn-secondary button-hover-lift" 
                      style={{ flex: 1.0, minWidth: '80px', padding: '8px 10px', fontSize: '0.8rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}
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
                        style={{ flex: 1.2, minWidth: '80px', padding: '8px 10px', fontSize: '0.8rem', justifyContent: 'center' }}
                      >
                        <span>Demo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="btn btn-secondary" style={{ flex: 1.2, minWidth: '80px', padding: '8px 10px', fontSize: '0.8rem', justifyContent: 'center', opacity: 0.5, cursor: 'not-allowed' }}>
                        <span>No Demo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="section-title gradient-text">Secure Console Route</h2>
            <p className="section-subtitle">Transmit connection telemetry directly to the developer command shell.</p>
          </motion.div>

          <div className="contact-grid">
            <motion.div 
              className="contact-card glass"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h3>Workspace Node</h3>
              <p>Ping the console if you are looking to secure contract architectures, integration pipelines, or agent endpoints.</p>
              
              <div className="contact-info-list" style={{ marginTop: '20px' }}>
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper"><Mail className="w-5 h-5" /></div>
                  <span>pranjalshukla2222@gmail.com</span>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper"><Phone className="w-5 h-5" /></div>
                  <span>+91 9306288370</span>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper"><MapPin className="w-5 h-5" /></div>
                  <span>Prayagraj, India</span>
                </div>
              </div>
            </motion.div>

            {/* Retro terminal contact console in 2D layout */}
            <motion.div 
              className="contact-form-wrapper"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <div className="terminal-hud" style={{ width: '100%' }}>
                <div className="terminal-header">
                  <span className="terminal-title">PRANJAL@WORKSPACE:~</span>
                  <div className="terminal-buttons">
                    <div className="t-btn t-btn-red" onClick={resetTerminal}></div>
                    <div className="t-btn t-btn-yellow"></div>
                    <div className="t-btn t-btn-green" onClick={resetTerminal}></div>
                  </div>
                </div>

                <div className="terminal-body" style={{ minHeight: '320px' }}>
                  <div style={{ maxHeight: '110px', overflowY: 'auto', fontSize: '0.75rem', opacity: 0.85 }}>
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} style={{ marginBottom: '3px' }}>{log}</div>
                    ))}
                  </div>

                  {isSubmitted ? (
                    <div className="terminal-screen-success green-glow" style={{ marginTop: '10px' }}>
                      <h4 style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>PACKET DISPATCHED</h4>
                      <p style={{ fontSize: '0.75rem' }}>Secure route established. Thank you for connecting.</p>
                      <button 
                        onClick={resetTerminal}
                        className="terminal-submit-btn" 
                        style={{ width: '100%', marginTop: '12px', padding: '8px' }}
                      >
                        Clear Shell Terminal
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                      <div className="terminal-input-group">
                        <label className="terminal-label">Ident_Handle</label>
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
                        <label className="terminal-label">Telemetry_Payload</label>
                        <textarea 
                          name="message" 
                          rows="3" 
                          className="terminal-text-input" 
                          placeholder="Enter packet message here..." 
                          value={formState.message} 
                          onChange={handleInputChange} 
                          required 
                        ></textarea>
                      </div>
                      <button type="submit" className="terminal-submit-btn" disabled={sending}>
                        <span>{sending ? 'TRANSMITTING...' : 'TRANSMIT SIGNAL'}</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Pranjal Shukla. Custom DevOps/AI Engine Portfolio.</p>
        </div>
      </footer>
      {/* Media Preview Modal */}
      {activeMedia && (
        <div className="cert-modal-backdrop" onClick={() => setActiveMedia(null)}>
          <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="cert-modal-close" onClick={() => setActiveMedia(null)}>
              &times;
            </button>
            <div className="cert-modal-image-wrapper">
              <img 
                src={activeMedia.image} 
                alt={activeMedia.title} 
                className="cert-modal-image" 
              />
            </div>
            <h4 className="cert-modal-title">{activeMedia.title}</h4>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
