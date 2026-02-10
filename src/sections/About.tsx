import { useEffect, useRef, useState } from 'react';
import Terminal from '@/components/Terminal';
import { 
  Server, 
  Cloud, 
  Container, 
  GitBranch, 
  Settings, 
  LineChart
} from 'lucide-react';

const About = () => {
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

  const specializations = [
    { icon: Cloud, label: 'Kubernetes', color: 'text-neon-cyan' },
    { icon: Container, label: 'OpenShift', color: 'text-neon-green' },
    { icon: Server, label: 'Linux', color: 'text-neon-amber' },
    { icon: LineChart, label: 'Observability', color: 'text-neon-purple' },
    { icon: Settings, label: 'Automation', color: 'text-neon-cyan' },
    { icon: GitBranch, label: 'CI/CD', color: 'text-neon-green' },
  ];

  const expertise = [
    { name: 'kubernetes', level: 99, years: '10yrs', desc: 'production-grade cluster mgmt' },
    { name: 'automation', level: 95, years: '10yrs', desc: '70% reduction in manual work' },
    { name: 'monitoring', level: 90, years: '8yrs', desc: 'prometheus, grafana, elk' },
    { name: 'reliability', level: 98, years: '10yrs', desc: '99.9% uptime delivery' },
  ];

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-20 px-4"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-neon-cyan" />
          <span className="text-xs font-mono text-neon-cyan uppercase tracking-wider">
            System Information
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Profile Info */}
          <Terminal title="cat /etc/profile.d/sre.conf" className="h-full">
            <div className={`space-y-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="space-y-2">
                <div className="flex">
                  <span className="text-terminal-muted w-24">NAME</span>
                  <span className="text-terminal-text">=</span>
                  <span className="text-neon-cyan ml-2">"Satya Prakash Chelluri"</span>
                </div>
                <div className="flex">
                  <span className="text-terminal-muted w-24">ROLE</span>
                  <span className="text-terminal-text">=</span>
                  <span className="text-terminal-text ml-2">"Senior Site Reliability Engineer"</span>
                </div>
                <div className="flex">
                  <span className="text-terminal-muted w-24">LOCATION</span>
                  <span className="text-terminal-text">=</span>
                  <span className="text-terminal-text ml-2">"Hyderabad, India"</span>
                </div>
                <div className="flex">
                  <span className="text-terminal-muted w-24">UPTIME</span>
                  <span className="text-terminal-text">=</span>
                  <span className="text-neon-green ml-2">"10+ years in infrastructure"</span>
                </div>
                <div className="flex">
                  <span className="text-terminal-muted w-24">STATUS</span>
                  <span className="text-terminal-text">=</span>
                  <span className="text-neon-green ml-2">"Available for opportunities"</span>
                </div>
              </div>

              <div className="border-t border-terminal-border pt-4 mt-4">
                <div className="text-terminal-muted mb-2">$ echo $SPECIALIZATIONS</div>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-dashboard-panel border border-dashboard-border"
                    >
                      <spec.icon className={`w-3 h-3 ${spec.color}`} />
                      <span className="text-xs text-terminal-text">{spec.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Terminal>

          {/* Right Panel - Expertise */}
          <Terminal title="ps aux | grep expertise" className="h-full">
            <div className={`space-y-3 transition-opacity duration-500 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="grid grid-cols-12 gap-2 text-xs text-terminal-muted mb-2">
                <span className="col-span-3">PROCESS</span>
                <span className="col-span-2">CPU%</span>
                <span className="col-span-2">TIME</span>
                <span className="col-span-5">COMMAND</span>
              </div>
              
              {expertise.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="grid grid-cols-12 gap-2 text-sm font-mono">
                    <span className="col-span-3 text-neon-cyan">{item.name}</span>
                    <span className="col-span-2 text-neon-green">{item.level}%</span>
                    <span className="col-span-2 text-terminal-muted">{item.years}</span>
                    <span className="col-span-5 text-terminal-muted truncate">{item.desc}</span>
                  </div>
                  <div className="h-1 bg-dashboard-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neon-green rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: isVisible ? `${item.level}%` : '0%',
                        transitionDelay: `${index * 200 + 500}ms`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Terminal>
        </div>

        {/* Summary Panel */}
        <div className="mt-6">
          <Terminal title="cat ~/README.md">
            <div className={`space-y-3 transition-opacity duration-500 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-terminal-text text-sm leading-relaxed">
                <span className="text-neon-cyan">#</span> About Me
              </p>
              <p className="text-terminal-muted text-sm leading-relaxed">
                Site Reliability Engineer with <span className="text-neon-green">10+ years</span> of experience building,
                maintaining, and optimizing large-scale <span className="text-neon-cyan">Linux</span> and{' '}
                <span className="text-neon-cyan">Kubernetes</span> environments.
              </p>
              <p className="text-terminal-muted text-sm leading-relaxed">
                Proven success in <span className="text-neon-green">automating infrastructure</span>, improving system{' '}
                <span className="text-neon-amber">observability</span>, and maintaining production-grade{' '}
                <span className="text-neon-green">reliability at scale</span>.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
                  <span className="text-xs text-terminal-muted">99.9% uptime delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-cyan" />
                  <span className="text-xs text-terminal-muted">70% automation improvement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-amber" />
                  <span className="text-xs text-terminal-muted">35% MTTR reduction</span>
                </div>
              </div>
            </div>
          </Terminal>
        </div>
      </div>
    </section>
  );
};

export default About;
