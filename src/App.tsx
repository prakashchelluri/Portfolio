import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Hero from '@/sections/Hero';
import IncidentDemo from '@/sections/IncidentDemo';
import About from '@/sections/About';
import Skills from '@/sections/Skills';
import Experience from '@/sections/Experience';
import Projects from '@/sections/Projects';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';

const navLinks = [
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'journey' },
  { id: 'projects', label: 'work' },
  { id: 'demo', label: 'demo' },
  { id: 'skills', label: 'stack' },
  { id: 'contact', label: 'contact' },
];

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 40);
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ['hero', ...navLinks.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const pct = Math.round(progress * 100);

  return (
    <div className="min-h-screen relative">
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-3 focus:py-2 focus:bg-neon-green focus:text-dashboard-bg focus:rounded">
        Skip to content
      </a>

      <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
        scrolled || menuOpen ? 'bg-dashboard-bg/80 backdrop-blur-xl border-b border-dashboard-border' : ''
      }`}>
        <div className="absolute bottom-0 left-0 h-px bg-neon-green shadow-[0_0_12px_#b4f04a]" style={{ width: `${pct}%` }} aria-hidden />

        <nav className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between font-mono text-xs" aria-label="Main">
          <button onClick={() => go('hero')} className="flex items-center gap-2 text-terminal-text group">
            <span className="grid place-items-center w-7 h-7 rounded-md border border-dashboard-border group-hover:border-neon-green transition-colors">
              <span className="text-neon-green">&gt;_</span>
            </span>
            <span className="hidden sm:inline tracking-wide">prakash.chelluri</span>
          </button>

          <div className="hidden md:flex items-center gap-1 p-1 rounded-full border border-dashboard-border bg-dashboard-panel/60">
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} aria-current={active === l.id ? 'true' : undefined}
                className={`relative px-3.5 py-1.5 rounded-full transition-colors ${
                  active === l.id ? 'bg-neon-green text-dashboard-bg' : 'text-terminal-muted hover:text-terminal-text'
                }`}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'} className="md:hidden p-1.5 text-terminal-text">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div id="mobile-nav" className="md:hidden px-5 pb-5 grid grid-cols-2 gap-2 font-mono text-sm">
            {navLinks.map((l, i) => (
              <button key={l.id} onClick={() => go(l.id)}
                className={`text-left px-3 py-3 rounded-lg border ${active === l.id ? 'border-neon-green text-neon-green' : 'border-dashboard-border text-terminal-muted'}`}
                style={{ animation: `fade-up .4s ${i * 40}ms both` }}>
                <span className="text-terminal-muted/60 mr-2">0{i + 1}</span>{l.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <IncidentDemo />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
