import { useRef, useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card (0 to 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Convert to degrees of tilt (-12 to 12)
    const rotateX = (0.5 - y) * 24;
    const rotateY = (x - 0.5) * 24;
    
    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
      transition: 'transform 0.1s ease-out',
      boxShadow: `${(0.5 - x) * 20}px ${(0.5 - y) * 20}px 30px rgba(0, 0, 0, 0.25)`
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      boxShadow: 'var(--glass-shadow)'
    });
  };

  return (
    <div 
      className="project-card-container"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      <div 
        className="project-card glass" 
        style={{ 
          ...tiltStyle, 
          transformStyle: 'preserve-3d', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        <div className="project-img-wrapper" style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
          <img src={project.image} alt={project.title} className="project-img" />
        </div>
        
        <div className="project-info" style={{ transform: 'translateZ(40px)', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="project-tags">
            {project.tags.map((tag, idx) => (
              <span key={idx} className="tag">{tag}</span>
            ))}
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '10px' }}>{project.title}</h3>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.95rem', marginBottom: '20px', flexGrow: 1 }}>
            {project.description}
          </p>
          <a href={project.link} className="project-btn" style={{ marginTop: 'auto' }}>
            <span>Explore Code</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const projectsData = [
    {
      id: 1,
      title: "IoT based Auto Water Pump",
      tags: ["IoT", "Arduino / ESP32", "C++", "Firebase"],
      description: "An automated irrigation and water delivery system integrating moisture/level sensors with ESP32 controllers. Offers a real-time web dashboard featuring automatic pumping overrides and predictive usage analytics.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
      link: "#"
    },
    {
      id: 2,
      title: "AI based Loan Approval Prediction System",
      tags: ["Python", "Machine Learning", "Scikit-Learn", "React"],
      description: "A secure AI banking pipeline that processes candidate records (income, credit score, historical status) to predict loan eligibility. Utilizes XGBoost models and displays risk score breakdowns on a clean analytics dashboard.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80",
      link: "#"
    },
    {
      id: 3,
      title: "Hostel Management System",
      tags: ["React.js", "Node.js", "Express", "MongoDB"],
      description: "A robust SaaS campus portal for student allocations, room listings, fee tracking, and digital complaint management. Includes role-based portals for students and wardens with automated notification updates.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
      link: "#"
    }
  ];

  return (
    <section id="projects">
      <div className="container">
        <h2 className="section-title gradient-text">Selected Works</h2>
        <p className="section-subtitle">
          Move your cursor over the project cards to experience physical 3D tilt depth and volumetric layering.
        </p>
        
        <div className="projects-grid">
          {projectsData.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
