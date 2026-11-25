import { useEffect, useRef, useState } from 'react';
import PipelineStage from '@/components/PipelineStage';
import Terminal from '@/components/Terminal';
import { CheckCircle2, TrendingUp, Cloud, Bot, Globe } from 'lucide-react';

const experiences = [
  {
    title: 'Site Reliability Engineer',
    company: 'Netcracker Technology Solutions',
    period: 'Feb 2022 - Present',
    status: 'running' as const,
    achievements: [
      { metric: '70%', label: 'Less manual deployment work', icon: TrendingUp },
      { metric: 'SLOs', label: 'Defined and tracked', icon: CheckCircle2 },
      { metric: 'Hybrid', label: 'On-prem + Azure', icon: Cloud },
      { metric: 'GenAI', label: 'Ops platform (contributor)', icon: Bot },
    ],
    details: [
      'Manage production Kubernetes and OpenShift clusters for high availability and reliability',
      'Automated deployments with Jenkins and GitLab CI/CD, cutting manual intervention by 70%',
      'Integrated Prometheus, Grafana and ELK for system visibility',
      'Defined and implemented SLOs/SLIs, improving reliability tracking and incident response',
      'Troubleshoot applications across Kubernetes and cloud-integrated environments, including Azure',
      'Contributing to a GenAI platform for Kubernetes/OpenShift operations that assists troubleshooting and operational insights',
    ],
  },
  {
    title: 'Senior IT Engineer',
    company: 'Netcracker Technology Solutions',
    period: 'Dec 2014 - Feb 2022',
    status: 'completed' as const,
    achievements: [
      { metric: '99.9%', label: 'APAC infrastructure uptime', icon: CheckCircle2 },
      { metric: 'Global', label: 'Datacenter coverage', icon: Globe },
    ],
    details: [
      'Managed Linux and OpenStack environments across global datacenters',
      'Handled network and virtualization escalations to keep services up',
      'Configured Cisco and D-Link switches and managed Active Directory',
      'Supported Hyper-V infrastructure and performed hardware upgrades',
      'Provided L2 support for Podman and WSL for developer productivity',
    ],
  },
];

const summary = [
  { value: '10+', label: 'Years Experience', color: 'text-neon-green' },
  { value: '2', label: 'Roles', color: 'text-neon-cyan' },
  { value: '99.9%', label: 'APAC Uptime', color: 'text-neon-amber' },
  { value: '70%', label: 'Less Manual Deploys', color: 'text-neon-purple' },
];

const Experience = () => {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-neon-cyan" />
          <span className="text-xs font-mono text-neon-cyan uppercase tracking-wider">CI/CD Pipeline</span>
        </div>

        <h2 className="font-mono text-2xl md:text-3xl text-terminal-text mb-12">
          Professional <span className="text-neon-green">Journey</span>
        </h2>

        <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {experiences.map((exp, index) => (
            <PipelineStage key={exp.title} title={exp.title} subtitle={`${exp.company} | ${exp.period}`}
              status={exp.status} isLast={index === experiences.length - 1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {exp.achievements.map((a) => (
                  <div key={a.label} className="p-2 rounded bg-dashboard-bg border border-dashboard-border">
                    <div className="flex items-center gap-1 mb-1">
                      <a.icon className="w-3 h-3 text-neon-green" />
                      <span className="text-lg font-mono font-bold text-terminal-text">{a.metric}</span>
                    </div>
                    <span className="text-xs text-terminal-muted">{a.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {exp.details.map((detail) => (
                  <div key={detail} className="flex items-start gap-2">
                    <span className="text-neon-cyan mt-1">›</span>
                    <span className="text-sm text-terminal-muted">{detail}</span>
                  </div>
                ))}
              </div>
            </PipelineStage>
          ))}
        </div>

        <div className="mt-8">
          <Terminal title="pipeline summary">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {summary.map((s) => (
                <div key={s.label}>
                  <div className={`text-2xl font-mono ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-terminal-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </Terminal>
        </div>
      </div>
    </section>
  );
};

export default Experience;
