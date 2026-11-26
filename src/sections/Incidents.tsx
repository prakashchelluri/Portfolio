import { Reveal } from '@/components/Reveal';

// Two real incidents, kept short and sanitised: no client names, team names, ticket IDs or internal links.

type Incident = { title: string; env: string; tags: string[]; rows: [string, string][]; tradeoff?: string };

const INCIDENTS: Incident[] = [
  {
    title: 'etcd timeouts on Dev and QA Kubernetes clusters',
    env: 'Dev · QA',
    tags: ['Kubernetes', 'etcd', 'Linux storage', 'ZRAM'],
    rows: [
      ['What broke', 'Dev and QA clusters kept hitting etcd timeouts.'],
      ['What I found', 'etcd was starved of storage IOPS. Moving it from HDD to SSD helped, but the hardware still could not give the cluster the I/O it needed.'],
      ['What I did', 'Disabled fsync for etcd in Dev and QA only, and the timeouts stopped. Then moved container logs onto a 1 GB compressed RAM disk (ZRAM) with log rotation, so log writes stopped competing with etcd for the disk.'],
      ['Result', 'Less disk I/O from logs and lower I/O pressure on the nodes.'],
    ],
    tradeoff: 'Turning off fsync trades durability for speed. Acceptable for Dev and QA; never for production, where etcd must know data is safely on disk.',
  },
  {
    title: 'Artifact downloads failing after a DNS cut-over',
    env: 'Multi-region',
    tags: ['Artifact repository', 'DNS', 'Replication', 'Rollback'],
    rows: [
      ['What broke', 'After a DNS change pointed our artifact repository at a new site, clusters in one region could no longer pull artifacts. Pulls hung until they were killed.'],
      ['What we found', 'It looked like a network problem at first. Comparing the two sites showed the new one only had versions up to v5, while the original had up to v10: replication had not finished.'],
      ['What we did', 'Asked for the DNS change to be rolled back and verified pulls worked again. Next day, jobs failed again: the rollback had not fully restored the original setup because not all repositories were federated. Fixed within an hour once the owning team was on duty.'],
      ['What changed', 'Verify replication is complete before any cut-over, test the rollback procedure itself, and make sure an owner is on duty in every time zone.'],
    ],
  },
];

const Incidents = () => (
  <div className="mt-14">
    <Reveal>
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Two incidents, briefly</h3>
        <span className="font-mono text-xs text-terminal-muted">postmortems</span>
      </div>
    </Reveal>
    <div className="grid lg:grid-cols-2 gap-4">
      {INCIDENTS.map((inc, i) => (
        <Reveal key={inc.title} delay={i} className="h-full">
          <article className="h-full rounded-2xl border border-dashboard-border bg-dashboard-panel p-5 md:p-6">
            <div className="flex items-center gap-2 font-mono text-xs text-terminal-muted mb-2">
              <span className="w-2 h-2 rounded-full bg-neon-amber" /> resolved · {inc.env}
            </div>
            <h4 className="text-xl font-semibold leading-snug mb-4">{inc.title}</h4>
            <dl className="space-y-3">
              {inc.rows.map(([k, v]) => (
                <div key={k} className="grid sm:grid-cols-[7.5rem_1fr] gap-x-4 gap-y-0.5">
                  <dt className="font-mono text-xs text-terminal-muted pt-0.5">{k}</dt>
                  <dd className="text-terminal-text/90 leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
            {inc.tradeoff && (
              <p className="mt-4 rounded-xl border border-neon-amber/40 bg-neon-amber/[0.06] px-4 py-3 text-sm leading-relaxed">
                <span className="font-semibold text-neon-amber">The trade-off: </span>{inc.tradeoff}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {inc.tags.map((t) => (
                <span key={t} className="font-mono text-xs px-2 py-1 rounded border border-dashboard-border text-terminal-muted">{t}</span>
              ))}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  </div>
);

export default Incidents;
