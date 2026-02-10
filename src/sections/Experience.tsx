import { useEffect, useRef, useState } from 'react';
import PipelineStage from '@/components/PipelineStage';
import Terminal from '@/components/Terminal';
import { CheckCircle2, TrendingDown, TrendingUp, Clock, Zap } from 'lucide-react';

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const experiences = [
    {
      title: 'Senior Site Reliability Engineer',
      company: 'Netcracker Technology Solutions',
      period: 'May 2020 - Present',
      status: 'running' as const,
      achievements: [
        { metric: '70%', label: 'Automation Improvement', icon: TrendingUp, positive: true },
        { metric: '35%', label: 'MTTR Reduction', icon: TrendingDown, positive: true },
        { metric: '99.9%', label: 'Uptime Achieved', icon: CheckCircle2, positive: true },
        { metric: 'Zero', label: 'Downtime Deployments', icon: Zap, positive: true },
      ],
      details: [
        'Managed production-grade Kubernetes clusters ensuring high availability',
        'Automated deployments using Jenkins and GitLab CI/CD',
        'Integrated Prometheus, Grafana, ELK for comprehensive observability',
        'Defined and implemented SLOs/SLIs for reliability tracking',
        'Enhanced cluster security with RBAC, Network Policies, Pod Security',
      ],
    },
    {
      title: 'Senior IT Engineer',
      company: 'Netcracker Technology Solutions',
      period: 'Jan 2015 - Feb 2020',
      status: 'completed' as const,
      achievements: [
        { metric: '99.9%', label: 'APAC Uptime', icon: CheckCircle2, positive: true },
        { metric: 'Global', label: 'Datacenter Coverage', icon: Clock, positive: true },
      ],
      details: [
        'Managed Linux and OpenStack environments across global datacenters',
        'Handled network and virtualization escalations ensuring uptime',
        'Configured Cisco and D-Link infrastructure',
        'Supported Hyper-V infrastructure and performed hardware upgrades',
        'Provided L2 support for Podman and WSL ensuring developer efficiency',
      ],
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="experience" 
      className="py-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-neon-cyan" />
          <span className="text-xs font-mono text-neon-cyan uppercase tracking-wider">
            CI/CD Pipeline
          </span>
        </div>

        <h2 className="font-mono text-2xl md:text-3xl text-terminal-text mb-12">
          Professional <span className="text-neon-green">Journey</span>
        </h2>

        {/* Pipeline */}
        <div className={`space-y-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {experiences.map((exp, index) => (
            <PipelineStage
              key={index}
              title={exp.title}
              subtitle={`${exp.company} | ${exp.period}`}
              status={exp.status}
              isLast={index === experiences.length - 1}
            >
              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {exp.achievements.map((achievement, i) => (
                  <div 
                    key={i}
                    className="p-2 rounded bg-dashboard-bg border border-dashboard-border"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <achievement.icon className={`w-3 h-3 ${achievement.positive ? 'text-neon-green' : 'text-neon-amber'}`} />
                      <span className="text-lg font-mono font-bold text-terminal-text">
                        {achievement.metric}
                      </span>
                    </div>
                    <span className="text-xs text-terminal-muted">{achievement.label}</span>
                  </div>
                ))}
              </div>

              {/* Details List */}
              <div className="space-y-2">
                {exp.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-neon-cyan mt-1">›</span>
                    <span className="text-sm text-terminal-muted">{detail}</span>
                  </div>
                ))}
              </div>
            </PipelineStage>
          ))}
        </div>

        {/* Pipeline Summary */}
        <div className="mt-8">
          <Terminal title="pipeline summary">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-mono text-neon-green">10+</div>
                <div className="text-xs text-terminal-muted">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl font-mono text-neon-cyan">1</div>
                <div className="text-xs text-terminal-muted">Company</div>
              </div>
              <div>
                <div className="text-2xl font-mono text-neon-amber">10+</div>
                <div className="text-xs text-terminal-muted">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-mono text-neon-purple">99.9%</div>
                <div className="text-xs text-terminal-muted">Avg Uptime</div>
              </div>
            </div>
          </Terminal>
        </div>
      </div>
    </section>
  );
};

export default Experience;
