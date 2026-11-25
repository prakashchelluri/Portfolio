import { Cloud, Container, Server, LineChart, GitBranch, Network, Database, Code2, Bot } from 'lucide-react';
import { SectionHeader, Reveal } from '@/components/Reveal';

const GROUPS = [
  { title: 'Containers', icon: Container, items: ['Kubernetes', 'OpenShift', 'Docker', 'Podman'] },
  { title: 'CI/CD & automation', icon: GitBranch, items: ['Jenkins', 'GitLab CI/CD', 'GitHub Actions', 'Ansible'] },
  { title: 'Observability', icon: LineChart, items: ['Prometheus', 'Grafana', 'ELK Stack', 'Graylog', 'VictoriaMetrics'] },
  { title: 'Cloud & infrastructure', icon: Cloud, items: ['Azure', 'AWS', 'OpenStack', 'Hyper-V', 'Datacenter build'] },
  { title: 'Linux', icon: Server, items: ['Administration', 'Troubleshooting', 'Performance tuning', 'Storage I/O'] },
  { title: 'Network & security', icon: Network, items: ['Cisco IOS', 'RBAC', 'Network Policies', 'Pod Security'] },
  { title: 'Data & messaging', icon: Database, items: ['PostgreSQL', 'Cassandra', 'Kafka', 'RabbitMQ', 'etcd'] },
  { title: 'Scripting & IaC', icon: Code2, items: ['Bash', 'Python', 'Terraform'] },
  { title: 'AI for operations', icon: Bot, items: ['Webex triage bot', 'GenAI troubleshooting', 'Operational insights'] },
];

const Skills = () => (
  <section id="skills" className="py-12 md:py-16 px-5">
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="Tools I use" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-dashboard-border bg-dashboard-border">
        {GROUPS.map((g, i) => (
          <Reveal key={g.title} delay={i % 3} className="bg-dashboard-bg p-5">
            <div className="flex items-center gap-2 mb-3">
              <g.icon className="w-4 h-4 text-neon-green" />
              <h3 className="text-sm font-semibold">{g.title}</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <span key={item} className="px-2 py-0.5 rounded text-xs bg-dashboard-panel text-terminal-muted border border-dashboard-border">{item}</span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
