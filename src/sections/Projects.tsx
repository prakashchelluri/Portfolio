import { useState } from 'react';
import { SectionHeader, Reveal } from '@/components/Reveal';
import Incidents from '@/sections/Incidents';
import OpenSource from '@/sections/OpenSource';


type N = { id: string; label: string; x: number; y: number; hot?: boolean };
type Work = { title: string; tag: string; nodes: N[]; edges: [string, string][]; context: string; work: string; outcome: string[]; stack: string[] };

const WORK: Work[] = [
  {
    title: 'AI triage bot for my team (Webex)',
    tag: 'aiops',
    nodes: [
      { id: 'iss', label: 'assigned issue', x: 70, y: 70 },
      { id: 'rul', label: 'team rules', x: 70, y: 230 },
      { id: 'bot', label: 'Webex AI bot', x: 300, y: 150, hot: true },
      { id: 'fix', label: 'proposed fix', x: 540, y: 70 },
      { id: 'eng', label: 'engineer feedback', x: 540, y: 230 },
    ],
    edges: [['iss', 'bot'], ['rul', 'bot'], ['bot', 'fix'], ['fix', 'eng'], ['eng', 'bot']],
    context: 'Every issue assigned to the team needs analysing, and many fixes follow rules the team already knows.',
    work: 'Built a custom Webex bot that analyses the issues assigned to my teammates, proposes fixes based on the rules we set, and learns from its mistakes.',
    outcome: ['Fix proposals right in Webex', 'Follows team-defined rules', 'Learns from its mistakes'],
    stack: ['Webex', 'AIOps', 'Automation'],
  },
  {
    title: 'GenAI platform for K8s / OpenShift ops',
    tag: 'aiops',
    nodes: [
      { id: 'ev', label: 'events', x: 70, y: 60 },
      { id: 'lg', label: 'logs', x: 70, y: 150 },
      { id: 'mt', label: 'metrics', x: 70, y: 240 },
      { id: 'ai', label: 'GenAI platform', x: 330, y: 150, hot: true },
      { id: 'en', label: 'engineer', x: 560, y: 150 },
    ],
    edges: [['ev', 'ai'], ['lg', 'ai'], ['mt', 'ai'], ['ai', 'en']],
    context: 'Troubleshooting Kubernetes and OpenShift means pulling context from events, logs and metrics by hand.',
    work: 'Contributing to a GenAI platform that assists troubleshooting and surfaces operational insights for cluster operators.',
    outcome: ['AI-assisted troubleshooting', 'Operational insights', 'In active development'],
    stack: ['GenAI', 'Kubernetes', 'OpenShift'],
  },
  {
    title: 'Deployment automation',
    tag: 'ci/cd',
    nodes: [
      { id: 'git', label: 'git push', x: 60, y: 150 },
      { id: 'gl', label: 'GitLab CI', x: 220, y: 80 },
      { id: 'jk', label: 'Jenkins', x: 220, y: 220 },
      { id: 'reg', label: 'artifacts', x: 390, y: 150 },
      { id: 'k8s', label: 'K8s / OpenShift', x: 570, y: 150, hot: true },
    ],
    edges: [['git', 'gl'], ['git', 'jk'], ['gl', 'reg'], ['jk', 'reg'], ['reg', 'k8s']],
    context: 'Releases to production clusters needed manual steps from engineers.',
    work: 'Automated deployments to Kubernetes and OpenShift with Jenkins and GitLab CI/CD pipelines.',
    outcome: ['70% less manual intervention', 'Repeatable releases', 'Pipeline-driven deploys'],
    stack: ['Jenkins', 'GitLab CI', 'Kubernetes', 'OpenShift'],
  },
  {
    title: 'Observability & SLOs',
    tag: 'observability',
    nodes: [
      { id: 'svc', label: 'services', x: 60, y: 150 },
      { id: 'pr', label: 'Prometheus', x: 230, y: 80 },
      { id: 'elk', label: 'ELK', x: 230, y: 220 },
      { id: 'gf', label: 'Grafana', x: 400, y: 150 },
      { id: 'slo', label: 'SLOs · alerts', x: 570, y: 150, hot: true },
    ],
    edges: [['svc', 'pr'], ['svc', 'elk'], ['pr', 'gf'], ['elk', 'gf'], ['gf', 'slo']],
    context: 'Reliability is hard to track without shared metrics, logs and targets.',
    work: 'Integrated Prometheus, Grafana and ELK, then defined SLOs and SLIs for the services.',
    outcome: ['SLOs / SLIs defined', 'Better reliability tracking', 'Faster incident response'],
    stack: ['Prometheus', 'Grafana', 'ELK'],
  },
  {
    title: 'Datacenters and offices built from scratch',
    tag: 'infra',
    nodes: [
      { id: 'dxb', label: 'Dubai datacenter', x: 80, y: 40 },
      { id: 'auh', label: 'Abu Dhabi datacenter', x: 80, y: 113 },
      { id: 'hyd', label: 'Hyderabad office', x: 80, y: 187 },
      { id: 'uk', label: 'UK office', x: 80, y: 260 },
      { id: 'ops', label: 'global infra ops', x: 360, y: 150, hot: true },
      { id: 'up', label: '99.9% APAC uptime', x: 570, y: 150 },
    ],
    edges: [['dxb', 'ops'], ['auh', 'ops'], ['hyd', 'ops'], ['uk', 'ops'], ['ops', 'up']],
    context: 'New regions and offices needed infrastructure built from nothing, then run reliably.',
    work: 'Built datacenters from scratch in Dubai and Abu Dhabi, led office setup projects in Hyderabad and the UK, and ran Linux, OpenStack and Hyper-V environments across global datacenters.',
    outcome: ['2 datacenters built from scratch', 'Office setups led in 2 countries', '99.9% APAC uptime'],
    stack: ['Datacenter build', 'Project lead', 'Cisco', 'OpenStack', 'Hyper-V', 'Linux'],
  },
];

const Diagram = ({ w }: { w: Work }) => {
  const at = (id: string) => w.nodes.find((n) => n.id === id)!;
  return (
    <svg viewBox="-30 0 700 300" className="w-full h-auto" role="img" aria-label={`Diagram: ${w.nodes.map((n) => n.label).join(', ')}`}>
      {w.edges.map(([a, b], i) => {
        const p = at(a), q = at(b);
        const mx = (p.x + q.x) / 2;
        const d = `M${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${q.y}, ${q.x} ${q.y}`;
        return (
          <g key={a + b}>
            <path d={d} fill="none" stroke="#1f2731" strokeWidth="2" />
            <path d={d} fill="none" stroke="#b4f04a" strokeOpacity="0.5" strokeWidth="1.5" pathLength={1}
              strokeDasharray="1" style={{ animation: `draw 1s var(--ease-out) ${i * 0.12}s both` }} />
            {[0, 1, 2].map((k) => (
              <circle key={k} r="3.5" fill={k === 1 ? '#5cc8ff' : '#b4f04a'} opacity="0">
                <animateMotion dur="2.4s" begin={`${0.8 + i * 0.25 + k * 0.8}s`} repeatCount="indefinite" path={d} />
                <animate attributeName="opacity" values="0;1;1;0" dur="2.4s" begin={`${0.8 + i * 0.25 + k * 0.8}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </g>
        );
      })}
      {w.nodes.map((n, i) => {
        const width = Math.max(84, n.label.length * 8.4 + 28);
        return (
          <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
            <g style={{ animation: `pop .6s var(--ease-out) ${i * 0.08}s both` }}>
              {n.hot && <rect x={-width / 2 - 6} y={-25} width={width + 12} height={50} rx={14} fill="#b4f04a" opacity="0.12" />}
              <rect x={-width / 2} y={-19} width={width} height={38} rx={10} fill="#0b0f14" stroke={n.hot ? '#b4f04a' : '#2a3542'} strokeWidth={n.hot ? 1.5 : 1} />
              <text textAnchor="middle" y={5} fontSize="13" className={`font-mono ${n.hot ? 'fill-neon-green' : 'fill-terminal-text'}`}>{n.label}</text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};

const Projects = () => {
  const [sel, setSel] = useState(0);
  const w = WORK[sel];
  return (
    <section id="projects" className="py-12 md:py-16 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Selected work" />

        <div className="grid lg:grid-cols-[0.9fr_1.6fr] gap-6">
          <ul className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible -mx-5 px-5 lg:mx-0 lg:px-0 pb-2" role="tablist" aria-label="Work">
            {WORK.map((x, i) => (
              <Reveal as="li" key={x.title} delay={i} className="shrink-0">
                <button role="tab" aria-selected={sel === i} onClick={() => setSel(i)}
                  className={`group w-full text-left rounded-2xl border p-5 transition-all duration-500 ${
                    sel === i ? 'border-neon-green bg-neon-green/[0.06]' : 'border-dashboard-border hover:border-terminal-muted/50'
                  }`}>
                  <div className="flex items-center justify-between font-mono text-xs mb-2">
                    <span className={sel === i ? 'text-neon-green' : 'text-terminal-muted'}>0{i + 1} / {x.tag}</span>
                    <span className={`w-2 h-2 rounded-full ${sel === i ? 'bg-neon-green' : 'bg-dashboard-border'}`} />
                  </div>
                  <span className={`block text-lg font-medium leading-snug whitespace-nowrap lg:whitespace-normal ${sel === i ? 'text-terminal-text' : 'text-terminal-muted group-hover:text-terminal-text'}`}>
                    {x.title}
                  </span>
                </button>
              </Reveal>
            ))}
          </ul>

          <div key={sel} role="tabpanel" className="rounded-2xl border border-dashboard-border bg-dashboard-panel overflow-hidden"
            style={{ animation: 'fade-up .6s var(--ease-out) both' }}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-dashboard-border font-mono text-xs text-terminal-muted">
              <span>diagram://{w.tag}</span>
              <span className="text-neon-green">● live</span>
            </div>
            <div className="p-4 md:p-6 bg-[radial-gradient(circle_at_1px_1px,#18202a_1px,transparent_0)] [background-size:20px_20px]">
              <Diagram w={w} />
            </div>
            <div className="grid md:grid-cols-2 gap-6 p-6 border-t border-dashboard-border">
              <div className="space-y-4">
                <div>
                  <div className="font-mono text-xs text-neon-amber mb-1">Context</div>
                  <p className="text-terminal-muted">{w.context}</p>
                </div>
                <div>
                  <div className="font-mono text-xs text-neon-cyan mb-1">What I did</div>
                  <p className="text-terminal-text">{w.work}</p>
                </div>
              </div>
              <div>
                <div className="font-mono text-xs text-neon-green mb-2">Outcome</div>
                <ul className="space-y-2 mb-5">
                  {w.outcome.map((o) => (
                    <li key={o} className="flex items-center gap-2"><span className="text-neon-green">✓</span>{o}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {w.stack.map((s) => (
                    <span key={s} className="font-mono text-xs px-2 py-1 rounded border border-dashboard-border text-terminal-muted">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Incidents />
        <OpenSource />
      </div>
    </section>
  );
};

export default Projects;
