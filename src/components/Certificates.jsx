import { Award, ExternalLink } from 'lucide-react';

function CertificateCard({ cert }) {
  return (
    <div className="cert-card-container">
      <div className="cert-card-inner">
        
        {/* FRONT FACE */}
        <div className={`cert-card-front ${cert.theme}`}>
          {/* Holographic Shine Overlay */}
          <div className="hologram-shine"></div>
          
          <div className="card-header-mc">
            <div className="issuer-logo-area">
              <span className="issuer-name">{cert.issuer}</span>
              <span className="cert-card-type">Premium Credential</span>
            </div>
            <Award className="w-8 h-8 text-white/90" />
          </div>
          
          {/* Gold Microchip */}
          <div className="gold-chip">
            <div className="chip-inner-lines"></div>
          </div>
          
          {/* Card Number representing certificate code */}
          <div className="card-number-mc">{cert.cardNumber}</div>
          
          <div className="card-footer-mc">
            <div className="card-holder-info">
              <span className="card-holder-label">Card Holder</span>
              <span className="card-holder-name">PRANJAL SHUKLA</span>
            </div>
            
            <div className="card-date-info">
              <span className="card-date-label">VALID THRU</span>
              <span className="card-date-val">{cert.validThru}</span>
            </div>
            
            {/* Mastercard overlapping circles */}
            <div className="mastercard-circles">
              <div className="mc-red"></div>
              <div className="mc-orange"></div>
            </div>
          </div>
        </div>
        
        {/* BACK FACE */}
        <div className="cert-card-back">
          {/* Magnetic Stripe */}
          <div className="card-magnetic-stripe"></div>
          
          {/* Signature Area */}
          <div className="card-signature-area">
            <span className="card-signature-text">Pranjal Shukla</span>
            <span className="card-cvv">SECURE</span>
          </div>
          
          {/* Description / Info */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: '700' }}>
              {cert.title}
            </h4>
            <p className="cert-desc-back">{cert.description}</p>
          </div>
          
          {/* Link to Credential Verification */}
          <a 
            href={cert.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="cert-btn-back"
          >
            <span>Verify Credential</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        
      </div>
    </div>
  );
}

export default function Certificates() {
  const certificateData = [
    {
      id: 1,
      title: "Full Stack Web Development",
      issuer: "Udemy",
      cardNumber: "5412 8820 9431 1001",
      theme: "theme-carbon",
      validThru: "12/28",
      description: "Comprehensive development credential covering HTML/CSS, React, Node.js, Express, MongoDB, and modern MVC/REST API designs.",
      link: "#"
    },
    {
      id: 2,
      title: "JavaScript Algorithms",
      issuer: "freeCodeCamp",
      cardNumber: "5412 7510 8821 2002",
      theme: "theme-sapphire",
      validThru: "08/28",
      description: "Advanced algorithms certification specializing in OOP concepts, data structures, recursion, dynamic programming, and automated testing.",
      link: "#"
    },
    {
      id: 3,
      title: "UI/UX Design Specialization",
      issuer: "Coursera",
      cardNumber: "5412 3640 1192 3003",
      theme: "theme-amethyst",
      validThru: "04/29",
      description: "Specialized design training focused on building low/high fidelity wireframes, user personas, interactive prototyping, and design systems.",
      link: "#"
    },
    {
      id: 4,
      title: "Python for Data Science",
      issuer: "IBM",
      cardNumber: "5412 5590 6210 4004",
      theme: "theme-emerald",
      validThru: "10/28",
      description: "Data analysis certification utilizing Python, Pandas, Numpy, Matplotlib, and key foundations of machine learning and predictive modelling.",
      link: "#"
    },
    {
      id: 5,
      title: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      cardNumber: "5412 9130 8470 5005",
      theme: "theme-platinum",
      validThru: "11/29",
      description: "Foundational cloud certification covering core AWS services (EC2, S3, RDS), identity access management, billing, and serverless architectures.",
      link: "#"
    },
    {
      id: 6,
      title: "Git & GitHub Mastery",
      issuer: "Udacity",
      cardNumber: "5412 4470 5510 6006",
      theme: "theme-ruby",
      validThru: "06/28",
      description: "Professional version control training focusing on git workflows, merge conflict resolution, branch management, rebasing, and open source collaboration.",
      link: "#"
    }
  ];

  return (
    <section id="certificates">
      <div className="container">
        <h2 className="section-title gradient-text">Certificates & Achievements</h2>
        <p className="section-subtitle">
          Hover over the cards to flip them and view credential verification details.
        </p>
        
        <div className="certificates-grid">
          {certificateData.map(cert => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </div>
      </div>
    </section>
  );
}
