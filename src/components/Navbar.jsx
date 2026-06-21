import { useState, useEffect } from 'react';
import { Moon, Sun, Code, Cpu } from 'lucide-react';

export default function Navbar({ viewMode, setViewMode, isMobile }) {
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const darkInitial = savedTheme === 'dark';
    setIsDark(darkInitial);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header className={`glass ${scrolled ? 'scrolled' : 'floating'}`} style={{ zIndex: 99 }}>
      <div className="container">
        <nav style={{ padding: '0.8rem 2rem' }}>
          <a href="#home" className="nav-brand gradient-text">
            <Code className="w-8 h-8" style={{ color: 'hsl(var(--primary))' }} />
            <span>PRANJAL.DEV</span>
          </a>
          
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#certificates">Certificates</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="nav-actions">
            {/* 3D Mode Toggle for Desktop users in 2D mode */}
            {!isMobile && viewMode === '2d' && (
              <button 
                onClick={() => setViewMode('3d')}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Enter 3D Workspace"
              >
                <Cpu className="w-4 h-4 text-indigo-500" style={{ color: 'hsl(var(--primary))' }} />
                <span>3D Mode</span>
              </button>
            )}

            <button 
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
              style={{ width: '36px', height: '36px', borderRadius: '10px' }}
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
