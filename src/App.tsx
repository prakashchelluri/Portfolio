import { useEffect, useState, useRef } from 'react';
import GridBackground from '@/components/GridBackground';
import Hero from '@/sections/Hero';
import PipelineDemo from '@/sections/PipelineDemo';
import About from '@/sections/About';
import Skills from '@/sections/Skills';
import Experience from '@/sections/Experience';
import Projects from '@/sections/Projects';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';
import { Menu, X } from 'lucide-react';
import './App.css';

const navLinks = [
  { id: 'hero', label: '~' },
  { id: 'pipeline', label: 'pipeline' },
  { id: 'about', label: 'about' },
  { id: 'skills', label: 'skills' },
  { id: 'experience', label: 'experience' },
  { id: 'projects', label: 'projects' },
  { id: 'contact', label: 'contact' },
];

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navRef = useRef<HTMLElement>(null);

  // Handle scroll for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Setup intersection observer for active section
  useEffect(() => {
    const sections = navLinks.map((link) => document.getElementById(link.id));
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg text-terminal-text font-mono relative">
      {/* Grid Background */}
      <GridBackground />

      {/* Navigation */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || menuOpen
            ? 'bg-dashboard-bg/90 backdrop-blur-md border-b border-dashboard-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-2 text-neon-green hover:text-neon-cyan transition-colors"
            >
              <span className="font-mono text-sm">$</span>
              <span className="font-mono text-sm">PrakashChelluri</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`px-3 py-1.5 rounded font-mono text-xs transition-all duration-200 ${
                    activeSection === link.id
                      ? 'text-neon-cyan bg-neon-cyan/10'
                      : 'text-terminal-muted hover:text-terminal-text hover:bg-dashboard-panel'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
              <span className="text-xs text-terminal-muted hidden sm:inline">online</span>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden p-1 text-terminal-muted hover:text-neon-cyan"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {menuOpen && (
            <div id="mobile-nav" className="md:hidden pb-3 grid grid-cols-2 gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`px-3 py-2 rounded text-left font-mono text-sm ${
                    activeSection === link.id ? 'text-neon-cyan bg-neon-cyan/10' : 'text-terminal-muted'
                  }`}
                >
                  {link.id === 'hero' ? 'home' : link.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <PipelineDemo />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}

export default App;
