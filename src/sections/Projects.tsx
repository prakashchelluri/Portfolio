import { useEffect, useRef, useState } from 'react';
import { 
  Cloud, 
  GitBranch, 
  LineChart, 
  Settings, 
  ArrowRight,
  Server
} from 'lucide-react';

const Projects = () => {
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

  const projects = [
    {
      title: 'Kubernetes Cluster Automation',
      icon: Cloud,
      color: 'text-neon-cyan',
      bgColor: 'bg-neon-cyan/10',
      architecture: [
        { name: 'GitLab', icon: GitBranch },
        { name: 'Ansible', icon: Settings },
        { name: 'Kubernetes', icon: Cloud },
      ],
      problem: 'Manual deployments causing downtime and inconsistent environments',
      solution: 'Implemented GitOps pipeline with automated rollbacks and canary deployments',
      impact: [
        '70% reduction in deployment time',
        'Zero-downtime releases achieved',
        '99.9% uptime maintained',
        'Consistent environment provisioning',
      ],
      tags: ['GitOps', 'Kubernetes', 'Ansible', 'CI/CD'],
    },
    {
      title: 'Monitoring Stack Implementation',
      icon: LineChart,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/10',
      architecture: [
        { name: 'Prometheus', icon: LineChart },
        { name: 'Grafana', icon: LineChart },
        { name: 'ELK Stack', icon: Server },
      ],
      problem: 'Lack of visibility into system health and performance metrics',
      solution: 'Deployed comprehensive observability stack with custom dashboards and alerting',
      impact: [
        '35% reduction in MTTR',
        'Proactive issue detection',
        'Custom SLO dashboards',
        'Predictive alerting enabled',
      ],
      tags: ['Observability', 'Prometheus', 'Grafana', 'ELK'],
    },
    {
      title: 'CI/CD Pipeline Modernization',
      icon: GitBranch,
      color: 'text-neon-purple',
      bgColor: 'bg-neon-purple/10',
      architecture: [
        { name: 'Jenkins', icon: Settings },
        { name: 'GitLab CI', icon: GitBranch },
        { name: 'Docker', icon: Cloud },
      ],
      problem: 'Legacy build processes with manual steps and slow feedback loops',
      solution: 'Migrated to modern CI/CD with parallel builds, automated testing, and artifact management',
      impact: [
        '50% faster build times',
        'Automated test execution',
        'Parallel pipeline stages',
        'Artifact versioning',
      ],
      tags: ['Jenkins', 'GitLab CI', 'Docker', 'Automation'],
    },
    {
      title: 'Infrastructure as Code Rollout',
      icon: Settings,
      color: 'text-neon-amber',
      bgColor: 'bg-neon-amber/10',
      architecture: [
        { name: 'Ansible', icon: Settings },
        { name: 'Terraform', icon: Cloud },
        { name: 'OpenStack', icon: Server },
      ],
      problem: 'Manual server configuration leading to configuration drift',
      solution: 'Implemented IaC with version-controlled playbooks and state management',
      impact: [
        '100% configuration consistency',
        'Version-controlled infrastructure',
        'Rapid environment provisioning',
        'Reduced human error',
      ],
      tags: ['IaC', 'Ansible', 'Terraform', 'OpenStack'],
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="projects" 
      className="py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-neon-cyan" />
          <span className="text-xs font-mono text-neon-cyan uppercase tracking-wider">
            Infrastructure Architecture
          </span>
        </div>

        <h2 className="font-mono text-2xl md:text-3xl text-terminal-text mb-12">
          Key <span className="text-neon-purple">Projects</span>
        </h2>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`group p-5 rounded-lg bg-dashboard-panel border border-dashboard-border hover:border-neon-cyan/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-neon-cyan/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${project.bgColor}`}>
                    <project.icon className={`w-5 h-5 ${project.color}`} />
                  </div>
                  <h3 className="font-mono text-lg font-semibold text-terminal-text group-hover:text-neon-cyan transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Architecture Diagram */}
              <div className="flex items-center justify-center gap-2 mb-4 p-3 rounded bg-dashboard-bg">
                {project.architecture.map((item, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center px-3 py-2 rounded bg-dashboard-panel border border-dashboard-border">
                      <item.icon className="w-4 h-4 text-terminal-muted mb-1" />
                      <span className="text-xs text-terminal-muted">{item.name}</span>
                    </div>
                    {i < project.architecture.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-terminal-muted mx-1" />
                    )}
                  </div>
                ))}
              </div>

              {/* Problem & Solution */}
              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-xs text-neon-red uppercase tracking-wider">Problem</span>
                  <p className="text-sm text-terminal-muted">{project.problem}</p>
                </div>
                <div>
                  <span className="text-xs text-neon-cyan uppercase tracking-wider">Solution</span>
                  <p className="text-sm text-terminal-muted">{project.solution}</p>
                </div>
              </div>

              {/* Impact */}
              <div className="mb-4">
                <span className="text-xs text-neon-green uppercase tracking-wider">Impact</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {project.impact.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-neon-green">✓</span>
                      <span className="text-xs text-terminal-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 rounded text-xs font-mono bg-dashboard-bg text-terminal-muted border border-dashboard-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
