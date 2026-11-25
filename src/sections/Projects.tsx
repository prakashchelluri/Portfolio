import { useEffect, useRef, useState } from 'react';
import { Cloud, GitBranch, LineChart, Settings, ArrowRight, Server, Bot, Database } from 'lucide-react';

// Every claim here comes from the resume. Add numbers only when they are defensible in an interview.
const projects = [
  {
    title: 'GenAI Platform for K8s / OpenShift Ops',
    icon: Bot,
    color: 'text-neon-cyan',
    bgColor: 'bg-neon-cyan/10',
    architecture: [
      { name: 'Cluster signals', icon: Server },
      { name: 'GenAI', icon: Bot },
      { name: 'Engineer', icon: Settings },
    ],
    context: 'Troubleshooting Kubernetes and OpenShift means pulling context from events, logs and metrics by hand',
    work: 'Contributing to a GenAI platform that assists troubleshooting and surfaces operational insights',
    outcome: ['AI-assisted troubleshooting', 'Operational insights', 'Kubernetes and OpenShift', 'In active development'],
    tags: ['AIOps', 'GenAI', 'Kubernetes', 'OpenShift'],
  },
  {
    title: 'Deployment Automation',
    icon: GitBranch,
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/10',
    architecture: [
      { name: 'GitLab', icon: GitBranch },
      { name: 'Jenkins', icon: Settings },
      { name: 'Kubernetes', icon: Cloud },
    ],
    context: 'Deployments to production clusters needed manual steps from engineers',
    work: 'Automated deployments to Kubernetes and OpenShift with Jenkins and GitLab CI/CD pipelines',
    outcome: ['70% less manual intervention', 'Repeatable releases', 'Pipeline-driven deploys', 'Fewer hand-offs'],
    tags: ['CI/CD', 'Jenkins', 'GitLab CI', 'Kubernetes'],
  },
  {
    title: 'Observability & SLOs',
    icon: LineChart,
    color: 'text-neon-purple',
    bgColor: 'bg-neon-purple/10',
    architecture: [
      { name: 'Prometheus', icon: LineChart },
      { name: 'Grafana', icon: LineChart },
      { name: 'ELK Stack', icon: Database },
    ],
    context: 'Reliability was hard to track without shared metrics, logs and targets',
    work: 'Integrated Prometheus, Grafana and ELK, then defined SLOs and SLIs for the services',
    outcome: ['SLOs / SLIs defined', 'Better reliability tracking', 'Faster incident response', 'Shared dashboards'],
    tags: ['Observability', 'SLOs', 'Prometheus', 'Grafana', 'ELK'],
  },
  {
    title: 'Hybrid Infrastructure Operations',
    icon: Server,
    color: 'text-neon-amber',
    bgColor: 'bg-neon-amber/10',
    architecture: [
      { name: 'OpenStack', icon: Cloud },
      { name: 'Hyper-V', icon: Server },
      { name: 'Azure', icon: Cloud },
    ],
    context: 'Infrastructure spread across global datacenters, virtualization platforms and cloud',
    work: 'Ran Linux, OpenStack and Hyper-V environments and handled network and virtualization escalations',
    outcome: ['99.9% APAC uptime', 'Global datacenters', 'Network escalations', 'Hardware upgrades'],
    tags: ['OpenStack', 'Hyper-V', 'Linux', 'Networking', 'Azure'],
  },
];

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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-neon-cyan" />
          <span className="text-xs font-mono text-neon-cyan uppercase tracking-wider">Infrastructure Architecture</span>
        </div>

        <h2 className="font-mono text-2xl md:text-3xl text-terminal-text mb-12">
          Key <span className="text-neon-purple">Work</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div key={project.title}
              className={`group p-5 rounded-lg bg-dashboard-panel border border-dashboard-border hover:border-neon-cyan/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-neon-cyan/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${project.bgColor}`}>
                  <project.icon className={`w-5 h-5 ${project.color}`} />
                </div>
                <h3 className="font-mono text-lg font-semibold text-terminal-text group-hover:text-neon-cyan transition-colors">
                  {project.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-y-2 mb-4 p-3 rounded bg-dashboard-bg">
                {project.architecture.map((item, i) => (
                  <div key={item.name} className="flex items-center">
                    <div className="flex flex-col items-center px-3 py-2 rounded bg-dashboard-panel border border-dashboard-border">
                      <item.icon className="w-4 h-4 text-terminal-muted mb-1" />
                      <span className="text-xs text-terminal-muted">{item.name}</span>
                    </div>
                    {i < project.architecture.length - 1 && <ArrowRight className="w-4 h-4 text-terminal-muted mx-1" />}
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-xs text-neon-amber uppercase tracking-wider">Context</span>
                  <p className="text-sm text-terminal-muted">{project.context}</p>
                </div>
                <div>
                  <span className="text-xs text-neon-cyan uppercase tracking-wider">What I did</span>
                  <p className="text-sm text-terminal-muted">{project.work}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-xs text-neon-green uppercase tracking-wider">Outcome</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {project.outcome.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-neon-green">✓</span>
                      <span className="text-xs text-terminal-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag}
                    className="px-2 py-1 rounded text-xs font-mono bg-dashboard-bg text-terminal-muted border border-dashboard-border">
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
