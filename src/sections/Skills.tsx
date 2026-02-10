import { useRef } from 'react';
import MetricCard from '@/components/MetricCard';
import { 
  Cloud, 
  Container, 
  Server, 
  LineChart, 
  GitBranch, 
  Settings,
  Network,
  Database,
  Shield
} from 'lucide-react';

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const skills = [
    { 
      title: 'Kubernetes', 
      value: 99, 
      status: 'healthy' as const, 
      icon: Cloud,
      description: 'Production-grade cluster management'
    },
    { 
      title: 'OpenShift', 
      value: 95, 
      status: 'healthy' as const, 
      icon: Container,
      description: 'Enterprise container platform'
    },
    { 
      title: 'Docker/Podman', 
      value: 95, 
      status: 'healthy' as const, 
      icon: Container,
      description: 'Container runtime expertise'
    },
    { 
      title: 'Linux', 
      value: 98, 
      status: 'healthy' as const, 
      icon: Server,
      description: 'System administration & tuning'
    },
    { 
      title: 'Prometheus/Grafana', 
      value: 90, 
      status: 'healthy' as const, 
      icon: LineChart,
      description: 'Metrics & visualization'
    },
    { 
      title: 'Jenkins/GitLab CI', 
      value: 92, 
      status: 'healthy' as const, 
      icon: GitBranch,
      description: 'CI/CD pipeline automation'
    },
    { 
      title: 'Ansible', 
      value: 88, 
      status: 'warning' as const, 
      icon: Settings,
      description: 'Configuration management'
    },
    { 
      title: 'OpenStack', 
      value: 85, 
      status: 'warning' as const, 
      icon: Cloud,
      description: 'Private cloud infrastructure'
    },
    { 
      title: 'Networking', 
      value: 82, 
      status: 'warning' as const, 
      icon: Network,
      description: 'CCNA certified professional'
    },
    { 
      title: 'AWS', 
      value: 75, 
      status: 'warning' as const, 
      icon: Cloud,
      description: 'Cloud services & architecture'
    },
    { 
      title: 'PostgreSQL', 
      value: 80, 
      status: 'warning' as const, 
      icon: Database,
      description: 'Database administration'
    },
    { 
      title: 'Security', 
      value: 85, 
      status: 'warning' as const, 
      icon: Shield,
      description: 'RBAC, policies, standards'
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="skills" 
      className="py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-neon-cyan" />
            <span className="text-xs font-mono text-neon-cyan uppercase tracking-wider">
              Monitoring Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
              <span className="text-xs text-terminal-muted">Expert</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan" />
              <span className="text-xs text-terminal-muted">Advanced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-amber" />
              <span className="text-xs text-terminal-muted">Proficient</span>
            </div>
          </div>
        </div>

        <h2 className="font-mono text-2xl md:text-3xl text-terminal-text mb-8">
          Skills <span className="text-neon-cyan">Metrics</span>
        </h2>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <MetricCard
              key={index}
              title={skill.title}
              value={skill.value}
              status={skill.status}
              icon={skill.icon}
              description={skill.description}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Dashboard Footer */}
        <div className="mt-8 p-4 rounded-lg bg-dashboard-panel border border-dashboard-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-terminal-muted block">Total Skills</span>
                <span className="text-lg font-mono text-terminal-text">{skills.length}</span>
              </div>
              <div>
                <span className="text-xs text-terminal-muted block">Expert Level</span>
                <span className="text-lg font-mono text-neon-green">
                  {skills.filter(s => s.status === 'healthy').length}
                </span>
              </div>
              <div>
                <span className="text-xs text-terminal-muted block">Avg Proficiency</span>
                <span className="text-lg font-mono text-neon-cyan">
                  {Math.round(skills.reduce((acc, s) => acc + s.value, 0) / skills.length)}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs text-terminal-muted">Dashboard updated: Just now</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
