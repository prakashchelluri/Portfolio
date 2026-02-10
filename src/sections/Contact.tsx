import { useRef, useEffect, useState } from 'react';
import Terminal from '@/components/Terminal';
import { Mail, MapPin, Github, Linkedin } from 'lucide-react';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const contactInfo = [
    { label: 'EMAIL', value: 'prakashchelluri@gmail.com', icon: Mail },
    { label: 'LOCATION', value: 'Hyderabad, India', icon: MapPin },
    { label: 'LINKEDIN', value: 'linkedin.com/in/prakashchelluri', icon: Linkedin, href: 'http://www.linkedin.com/in/prakashchelluri' },
    { label: 'GITHUB', value: 'github.com/prakashchelluri', icon: Github, href: 'https://github.com/prakashchelluri' },
  ];

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="py-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-neon-cyan" />
          <span className="text-xs font-mono text-neon-cyan uppercase tracking-wider">
            Contact Terminal
          </span>
        </div>

        <h2 className="font-mono text-2xl md:text-3xl text-terminal-text mb-12">
          Let's <span className="text-neon-green">Connect</span>
        </h2>

        <div className="max-w-lg mx-auto">
          {/* Contact Info */}
          <Terminal title="echo $CONTACT_INFO">
            <div className={`space-y-3 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-terminal-muted w-20 text-xs">{item.label}</span>
                  <span className="text-terminal-text">=</span>
                  {item.href ? (
                    <a 
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neon-cyan hover:underline ml-2 text-sm flex items-center gap-1"
                    >
                      "{item.value}"
                      <item.icon className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-terminal-text ml-2 text-sm flex items-center gap-1">
                      "{item.value}"
                      <item.icon className="w-3 h-3 text-terminal-muted" />
                    </span>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-terminal-border">
                <span className="text-terminal-muted w-20 text-xs">STATUS</span>
                <span className="text-terminal-text">=</span>
                <span className="text-neon-green ml-2 text-sm flex items-center gap-2">
                  "Available for opportunities"
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
                </span>
              </div>
            </div>
          </Terminal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
