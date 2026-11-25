import { useEffect, useRef, useState } from 'react';
import Terminal from '@/components/Terminal';
import { Server, Cloud, Container, GitBranch, LineChart, Bot } from 'lucide-react';

const specializations = [
  { icon: Cloud, label: 'Kubernetes', color: 'text-neon-cyan' },
  { icon: Container, label: 'OpenShift', color: 'text-neon-green' },
  { icon: Server, label: 'Linux', color: 'text-neon-amber' },
  { icon: LineChart, label: 'Observability', color: 'text-neon-purple' },
  { icon: GitBranch, label: 'CI/CD', color: 'text-neon-cyan' },
  { icon: Bot, label: 'AIOps', color: 'text-neon-green' },
];

const processes = [
  { pid: 101, name: 'reliability', cmd: 'SLO / SLI design, service health management' },
  { pid: 202, name: 'incident-resp', cmd: 'troubleshooting, escalations, RCA' },
  { pid: 303, name: 'observability', cmd: 'Prometheus, Grafana, ELK, VictoriaMetrics' },
  { pid: 404, name: 'automation', cmd: 'Jenkins, GitLab CI, Ansible, Terraform' },
  { pid: 505, name: 'aiops', cmd: 'GenAI-assisted K8s / OpenShift troubleshooting' },
];

const profile = [
  ['NAME', 'Satya Prakash Chelluri', 'text-neon-cyan'],
  ['ROLE', 'Site Reliability Engineer', 'text-terminal-text'],
  ['LOCATION', 'Hyderabad, India', 'text-terminal-text'],
  ['UPTIME', '10+ years in infrastructure', 'text-neon-green'],
  ['STATUS', 'Available for opportunities', 'text-neon-green'],
];

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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const fade = `transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`;

  return (
    <section ref={sectionRef} id="about" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-neon-cyan" />
          <span className="text-xs font-mono text-neon-cyan uppercase tracking-wider">System Information</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Terminal title="cat /etc/profile.d/sre.conf" className="h-full">
            <div className={`space-y-4 ${fade}`}>
              <div className="space-y-2">
                {profile.map(([key, value, color]) => (
                  <div key={key} className="flex">
                    <span className="text-terminal-muted w-24 shrink-0">{key}</span>
                    <span className="text-terminal-text">=</span>
                    <span className={`${color} ml-2`}>"{value}"</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-terminal-border pt-4 mt-4">
                <div className="text-terminal-muted mb-2">$ echo $SPECIALIZATIONS</div>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((spec) => (
                    <span key={spec.label}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-dashboard-panel border border-dashboard-border">
                      <spec.icon className={`w-3 h-3 ${spec.color}`} />
                      <span className="text-xs text-terminal-text">{spec.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Terminal>

          <Terminal title="ps aux | grep sre" className="h-full">
            <div className={`space-y-3 delay-300 ${fade}`}>
              <div className="grid grid-cols-12 gap-2 text-xs text-terminal-muted mb-2">
                <span className="col-span-2">PID</span>
                <span className="col-span-4">PROCESS</span>
                <span className="col-span-6">COMMAND</span>
              </div>
              {processes.map((p) => (
                <div key={p.pid} className="grid grid-cols-12 gap-2 text-sm">
                  <span className="col-span-2 text-terminal-muted">{p.pid}</span>
                  <span className="col-span-4 text-neon-cyan truncate">{p.name}</span>
                  <span className="col-span-6 text-terminal-muted text-xs leading-5">{p.cmd}</span>
                </div>
              ))}
            </div>
          </Terminal>
        </div>

        <div className="mt-6">
          <Terminal title="cat ~/README.md">
            <div className={`space-y-3 delay-500 ${fade}`}>
              <p className="text-terminal-text text-sm leading-relaxed">
                <span className="text-neon-cyan">#</span> About Me
              </p>
              <p className="text-terminal-muted text-sm leading-relaxed">
                Site Reliability Engineer with <span className="text-neon-green">10+ years</span> in infrastructure,
                running production <span className="text-neon-cyan">Kubernetes</span> and{' '}
                <span className="text-neon-cyan">OpenShift</span> platforms across on-prem and cloud environments.
              </p>
              <p className="text-terminal-muted text-sm leading-relaxed">
                I automate delivery, build <span className="text-neon-amber">observability</span> around SLOs, and
                currently contribute to a <span className="text-neon-green">GenAI platform</span> that helps
                engineers troubleshoot Kubernetes and OpenShift faster.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
                  <span className="text-xs text-terminal-muted">99.9% uptime for APAC infrastructure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-cyan" />
                  <span className="text-xs text-terminal-muted">70% less manual deployment work</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-amber" />
                  <span className="text-xs text-terminal-muted">SLOs / SLIs defined and tracked</span>
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
