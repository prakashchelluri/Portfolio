import { useRef } from 'react';
import type { CSSProperties } from 'react';
import { SectionHeader } from '@/components/Reveal';
import { useInView } from '@/lib/motion';


type Row =
  | { kind: 'head' | 'role'; lane: 0 | 1; title: string; org: string; period: string; refs: string[] }
  | { kind: 'commit'; lane: 0 | 1; hash: string; type: string; msg: string }
  | { kind: 'branch' }
  | { kind: 'tag'; lane: 0 | 1; tag: string; msg: string };

const ROWS: Row[] = [
  { kind: 'head', lane: 1, title: 'Site Reliability Engineer', org: 'Netcracker Technology Solutions', period: 'Feb 2022 → present', refs: ['HEAD -> sre'] },
  { kind: 'commit', lane: 1, hash: 'b7e02d4', type: 'feat(bot)', msg: 'build a custom Webex bot that analyses issues assigned to the team, proposes fixes from our rules and learns from its mistakes' },
  { kind: 'commit', lane: 1, hash: 'c41e9a2', type: 'feat(aiops)', msg: 'contribute to a GenAI platform for Kubernetes/OpenShift troubleshooting and operational insights' },
  { kind: 'commit', lane: 1, hash: '9b7f310', type: 'feat(slo)', msg: 'define and implement SLOs/SLIs to improve reliability tracking and incident response' },
  { kind: 'commit', lane: 1, hash: '5d02c7e', type: 'feat(ci)', msg: 'automate deployments with Jenkins and GitLab CI/CD, 70% less manual intervention' },
  { kind: 'commit', lane: 1, hash: 'e88a14b', type: 'feat(obs)', msg: 'integrate Prometheus, Grafana and ELK for system visibility' },
  { kind: 'commit', lane: 1, hash: '2fa6d91', type: 'ops(k8s)', msg: 'run production Kubernetes and OpenShift clusters; troubleshoot across on-prem and Azure' },
  { kind: 'branch' },
  { kind: 'role', lane: 0, title: 'Senior IT Engineer', org: 'Netcracker Technology Solutions', period: 'Dec 2014 → Feb 2022', refs: ['main'] },
  { kind: 'commit', lane: 0, hash: 'd15a0c8', type: 'feat(dc)', msg: 'build datacenters from scratch in Dubai and Abu Dhabi' },
  { kind: 'commit', lane: 0, hash: '61f3e9b', type: 'lead(office)', msg: 'lead office setup projects in Hyderabad and the UK' },
  { kind: 'commit', lane: 0, hash: '7c3b5e0', type: 'perf(apac)', msg: 'deliver 99.9% uptime for APAC region infrastructure' },
  { kind: 'commit', lane: 0, hash: 'a90d2f4', type: 'ops(dc)', msg: 'manage Linux and OpenStack environments across global datacenters' },
  { kind: 'commit', lane: 0, hash: '3e61b8c', type: 'fix(net)', msg: 'handle network and virtualization escalations; configure Cisco and D-Link switches' },
  { kind: 'commit', lane: 0, hash: 'f02a7d5', type: 'ops(virt)', msg: 'support Hyper-V, Active Directory, Podman and WSL; perform hardware upgrades' },
  { kind: 'tag', lane: 0, tag: 'ccna', msg: 'Cisco Certified Network Associate' },
  { kind: 'tag', lane: 0, tag: 'v0.1.0', msg: 'B.Tech, Electronics & Communication Engineering · JNTU Kakinada · 2007 → 2011' },
];

const LANE_X = [14, 38];
const COLOR = ['#5cc8ff', '#b4f04a'];

const Graph = ({ row, first, last, on }: { row: Row; first: boolean; last: boolean; on: boolean }) => {
  if (row.kind === 'branch') {
    return (
      <svg className="absolute inset-y-0 left-0 w-12 h-full" preserveAspectRatio="none" viewBox="0 0 48 100" aria-hidden>
        <path d={`M${LANE_X[0]} 100 C ${LANE_X[0]} 40, ${LANE_X[1]} 60, ${LANE_X[1]} 0`} fill="none" stroke={COLOR[1]} strokeWidth="2" vectorEffect="non-scaling-stroke"
          pathLength={1} strokeDasharray="1" style={{ strokeDashoffset: on ? 0 : 1, transition: 'stroke-dashoffset 1.2s var(--ease-out)' }} />
        <line x1={LANE_X[0]} y1="100" x2={LANE_X[0]} y2="60" stroke={COLOR[0]} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  }
  const x = LANE_X[row.lane];
  const big = row.kind === 'head' || row.kind === 'role';
  return (
    <div className="absolute inset-y-0 left-0 w-12" aria-hidden>
      <div className="absolute w-0.5" style={{ left: x - 1, top: first ? 22 : 0, bottom: last ? 'calc(100% - 22px)' : 0, background: COLOR[row.lane], transformOrigin: 'top', transform: on ? 'none' : 'scaleY(0)', transition: 'transform .9s var(--ease-out)' }} />
      <div className={`absolute ${row.kind === 'tag' ? 'rotate-45' : 'rounded-full'}`}
        style={{
          left: x - (big ? 8 : 5), top: 22 - (big ? 8 : 5), width: big ? 16 : 10, height: big ? 16 : 10,
          background: row.kind === 'commit' ? '#05070a' : COLOR[row.lane], border: `2px solid ${COLOR[row.lane]}`,
          boxShadow: big ? `0 0 16px ${COLOR[row.lane]}` : undefined,
          transform: on ? undefined : 'scale(0)', transition: 'transform .5s var(--ease-out) .2s',
        }} />
    </div>
  );
};

const RowView = ({ row, i }: { row: Row; i: number }) => {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, 0.4);
  const style = { '--d': 0 } as CSSProperties;
  return (
    <li ref={ref} className="relative pl-16 min-h-[44px]">
      <Graph row={row} first={i === 0} last={i === ROWS.length - 1} on={inView} />
      <div className={`reveal ${inView ? 'is-in' : ''} py-2`} style={style}>
        {(row.kind === 'head' || row.kind === 'role') && (
          <div className="pb-4 pt-0.5">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs mb-2">
              {row.refs.map((r) => (
                <span key={r} className={`px-2 py-0.5 rounded border ${row.lane ? 'border-neon-green text-neon-green' : 'border-neon-cyan text-neon-cyan'}`}>{r}</span>
              ))}
              <span className="text-terminal-muted">{row.period}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">{row.title}</h3>
            <p className="text-terminal-muted">{row.org}</p>
          </div>
        )}
        {row.kind === 'commit' && (
          <p className="font-mono text-sm leading-6 group">
            <span className="text-neon-amber mr-3">{row.hash}</span>
            <span className={row.lane ? 'text-neon-green' : 'text-neon-cyan'}>{row.type}:</span>{' '}
            <span className="text-terminal-text/90">{row.msg}</span>
          </p>
        )}
        {row.kind === 'branch' && (
          <p className="font-mono text-sm text-terminal-muted py-4">
            <span className="text-neon-green">$</span> git checkout -b sre <span className="text-terminal-muted/60"># Feb 2022: from infrastructure to reliability engineering</span>
          </p>
        )}
        {row.kind === 'tag' && (
          <p className="font-mono text-sm">
            <span className="px-2 py-0.5 mr-3 rounded bg-neon-cyan/10 text-neon-cyan">tag: {row.tag}</span>
            <span className="text-terminal-text/90">{row.msg}</span>
          </p>
        )}
      </div>
    </li>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="py-12 md:py-16 px-5">
      <div className="max-w-5xl mx-auto">
        <SectionHeader title="Where I have worked"
          intro="Newest first, written as a git log because that is how I think about it." />

        <div className="rounded-2xl border border-dashboard-border bg-dashboard-panel/50 p-5 md:p-8">
          <ol className="relative">
            {ROWS.map((row, i) => <RowView key={i} row={row} i={i} />)}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Experience;
