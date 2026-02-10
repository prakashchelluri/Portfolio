import { useState, useEffect } from 'react';
import Terminal from '@/components/Terminal';
import { Github, Linkedin, Mail, Terminal as TerminalIcon } from 'lucide-react';

const Hero = () => {
  const [lineIndex, setLineIndex] = useState(0);

  const terminalLines = [
    { text: 'whoami', delay: 800, highlight: true },
    { text: '', delay: 500, output: true },
    { text: 'NAME: Satya Prakash Chelluri', delay: 100, output: true, noPrompt: true },
    { text: 'ROLE: Site Reliability Engineer', delay: 100, output: true, noPrompt: true },
    { text: 'SPECIALIZATION: Kubernetes | DevOps | Observability | Automation', delay: 100, output: true, noPrompt: true, cyan: true },
    { text: 'EXPERIENCE: 10+ years', delay: 100, output: true, noPrompt: true },
    { text: 'LOCATION: Hyderabad, India', delay: 100, output: true, noPrompt: true },
    { text: 'STATUS: Available for opportunities', delay: 100, output: true, noPrompt: true, success: true },
  ];

  useEffect(() => {
    if (lineIndex < terminalLines.length) {
      const currentLine = terminalLines[lineIndex];
      const timeout = currentLine.delay + (currentLine.text.length * 30) + 200;
      
      const timer = setTimeout(() => {
        setLineIndex(prev => prev + 1);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [lineIndex]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="pt-20 pb-10 flex flex-col items-center justify-center px-4 relative">
      {/* Main Terminal */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-8">
        <Terminal title="PrakashChelluri@sre-dev:~" className="mb-8">
          <div className="space-y-1">
            {terminalLines.slice(0, lineIndex + 1).map((line, index) => (
              <div key={index} className="font-mono text-sm">
                {!line.noPrompt && !line.output && (
                  <span className="text-neon-green mr-2">$</span>
                )}
                <span className={`
                  ${line.highlight ? 'text-neon-cyan' : ''}
                  ${line.success ? 'text-neon-green' : ''}
                  ${line.cyan ? 'text-neon-cyan' : ''}
                  ${!line.highlight && !line.success && !line.cyan ? 'text-terminal-text' : ''}
                `}>
                  {line.text}
                </span>
                {index === lineIndex && lineIndex < terminalLines.length && (
                  <span className="text-neon-green animate-cursor-blink">▋</span>
                )}
              </div>
            ))}
            {lineIndex >= terminalLines.length && (
              <div className="font-mono text-sm">
                <span className="text-neon-green mr-2">$</span>
                <span className="animate-cursor-blink text-neon-green">▋</span>
              </div>
            )}
          </div>
        </Terminal>

        {/* CTA Buttons styled as terminal commands */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => scrollToSection('experience')}
            className="group flex items-center gap-2 px-4 py-2 rounded-md bg-dashboard-panel border border-dashboard-border hover:border-neon-green transition-all duration-300"
          >
            <TerminalIcon className="w-4 h-4 text-neon-green" />
            <span className="font-mono text-sm text-terminal-text group-hover:text-neon-green transition-colors">
              ./view-experience.sh
            </span>
          </button>
          
          <button
            onClick={() => scrollToSection('contact')}
            className="group flex items-center gap-2 px-4 py-2 rounded-md bg-dashboard-panel border border-dashboard-border hover:border-neon-cyan transition-all duration-300"
          >
            <Mail className="w-4 h-4 text-neon-cyan" />
            <span className="font-mono text-sm text-terminal-text group-hover:text-neon-cyan transition-colors">
              ssh contact@prakashchelluri.dev
            </span>
          </button>
          
          <a
            href="https://github.com/prakashchelluri"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 rounded-md bg-dashboard-panel border border-dashboard-border hover:border-neon-purple transition-all duration-300"
          >
            <Github className="w-4 h-4 text-neon-purple" />
            <span className="font-mono text-sm text-terminal-text group-hover:text-neon-purple transition-colors">
              git clone github.com/prakashchelluri
            </span>
          </a>
          
          <a
            href="http://www.linkedin.com/in/prakash-chelluri-7a462649"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 rounded-md bg-dashboard-panel border border-dashboard-border hover:border-[#0a66c2] transition-all duration-300"
          >
            <Linkedin className="w-4 h-4 text-[#0a66c2]" />
            <span className="font-mono text-sm text-terminal-text group-hover:text-[#0a66c2] transition-colors">
              curl linkedin.com/in/prakash-chelluri-7a462649
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
