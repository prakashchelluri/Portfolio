import { Cloud, Container, Server, LineChart, GitBranch, Network, Database, Code2, Bot } from 'lucide-react';

const groups = [
  { title: 'Containers & Orchestration', icon: Container, color: 'text-neon-cyan', items: ['Kubernetes', 'OpenShift', 'Docker', 'Podman'] },
  { title: 'CI/CD & Automation', icon: GitBranch, color: 'text-neon-green', items: ['Jenkins', 'GitLab CI/CD', 'GitHub Actions', 'Ansible'] },
  { title: 'Monitoring & Observability', icon: LineChart, color: 'text-neon-purple', items: ['Prometheus', 'Grafana', 'ELK Stack', 'Graylog', 'VictoriaMetrics'] },
  { title: 'Infrastructure & Cloud', icon: Cloud, color: 'text-neon-amber', items: ['OpenStack', 'Hyper-V', 'AWS', 'Azure'] },
  { title: 'Linux', icon: Server, color: 'text-neon-cyan', items: ['Server administration', 'Troubleshooting', 'Performance tuning'] },
  { title: 'Networking & Security', icon: Network, color: 'text-neon-green', items: ['Cisco IOS', 'D-Link', 'RBAC', 'Network Policies', 'Pod Security Standards'] },
  { title: 'Databases & Messaging', icon: Database, color: 'text-neon-purple', items: ['PostgreSQL', 'Cassandra', 'Kafka', 'RabbitMQ'] },
  { title: 'Scripting & IaC', icon: Code2, color: 'text-neon-amber', items: ['Bash', 'Python', 'Terraform'] },
  { title: 'AI for Operations', icon: Bot, color: 'text-neon-cyan', items: ['GenAI-assisted troubleshooting', 'Operational insights for K8s / OpenShift'] },
];

const Skills = () => (
  <section id="skills" className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-px bg-neon-cyan" />
        <span className="text-xs font-mono text-neon-cyan uppercase tracking-wider">Monitoring Dashboard</span>
      </div>

      <h2 className="font-mono text-2xl md:text-3xl text-terminal-text mb-8">
        Tech <span className="text-neon-cyan">Stack</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g) => (
          <div key={g.title}
            className="p-4 rounded-lg bg-dashboard-panel border border-dashboard-border hover:border-neon-cyan/50 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <g.icon className={`w-4 h-4 ${g.color}`} />
              <h3 className="text-sm text-terminal-text">{g.title}</h3>
              <span className="ml-auto w-2 h-2 rounded-full bg-neon-green" aria-hidden />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <span key={item}
                  className="px-2 py-0.5 rounded text-xs bg-dashboard-bg text-terminal-muted border border-dashboard-border">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
