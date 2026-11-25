import { Heart, Terminal } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-8 px-4 border-t border-dashboard-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left - Copyright */}
          <div className="flex items-center gap-2 text-terminal-muted text-sm font-mono">
            <Terminal className="w-4 h-4" />
            <span>© {currentYear} Satya Prakash Chelluri</span>
          </div>

          {/* Center - Tagline */}
          <div className="flex items-center gap-2 text-terminal-muted text-xs font-mono">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-neon-red fill-neon-red/20" />
            <span>for reliable infrastructure</span>
          </div>

          {/* Right - Quick Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
            {['pipeline', 'about', 'skills', 'experience', 'projects', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-xs text-terminal-muted hover:text-neon-cyan transition-colors font-mono capitalize"
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom - Status Bar */}
        <div className="mt-6 pt-4 border-t border-dashboard-border flex flex-wrap items-center justify-center gap-4 text-xs text-terminal-muted font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
            <span>System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
