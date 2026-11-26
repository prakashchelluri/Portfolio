import { useEffect, useRef, useState } from 'react';
import { Bug, ServerCrash, TrendingUp, KeyRound, Gauge, RotateCcw, Check, ShoppingCart, Terminal as TermIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/Reveal';
import { useInView, reducedMotion } from '@/lib/motion';


type Tone = 'ok' | 'warn' | 'bad';
type App = { tone: Tone; label: string; overlay?: string; dim?: boolean };
type Step = { t: string; text: string; app?: App; impact?: number; servers?: string; badge?: string };
type Lane = { steps: Step[]; result: string; servers: string };
type Scenario = {
  id: string; icon: LucideIcon; title: string; blurb: string;
  without: Lane; with: Lane; explain: string; skills: string[]; logs: string[];
};

const OK: App = { tone: 'ok', label: 'Working normally' };
const BROKEN: App = { tone: 'bad', label: 'Checkout broken', overlay: 'Something went wrong. Please try again.' };
const DOWN: App = { tone: 'bad', label: 'Site down', overlay: 'Site unavailable', dim: true };
const SLOW: App = { tone: 'warn', label: 'Very slow', overlay: 'Loading… 9 seconds' };
const LEAK: App = { tone: 'bad', label: 'Customer data exposed', overlay: 'Data breach' };
const BLIP: App = { tone: 'warn', label: 'Slightly slow' };

const SCENARIOS: Scenario[] = [
  {
    id: 'bug', icon: Bug, title: 'A buggy update', blurb: 'A new release accidentally breaks checkout.',
    without: {
      servers: 'ooo',
      steps: [
        { t: '10:02', text: 'The update goes straight to customers', app: OK },
        { t: '10:03', text: 'Checkout breaks. Orders start failing', app: BROKEN, impact: 400 },
        { t: '10:21', text: 'Angry customers post on social media', app: BROKEN, impact: 2100 },
        { t: '10:49', text: 'The team finds the bug and undoes the update', app: OK, impact: 3100 },
      ],
      result: '47 minutes of broken checkout',
    },
    with: {
      servers: 'ooo',
      steps: [
        { t: '10:02', text: 'The update first runs through automatic tests', app: OK },
        { t: '10:04', text: 'A test catches the broken checkout', app: OK },
        { t: '10:04', text: 'Release blocked. The developer gets the exact error', app: OK, badge: 'Bad update stopped' },
        { t: '10:15', text: 'The fixed version passes and rolls out safely', app: OK, badge: 'Safe release' },
      ],
      result: 'Customers never saw it',
    },
    explain: 'Every change passes automated checks before it reaches customers, then rolls out gradually, so a bad update is stopped instead of shipped.',
    skills: ['CI/CD pipelines', 'GitLab CI', 'Jenkins', 'Automated testing', 'Kubernetes rolling updates'],
    logs: ['$ gitlab-ci: stage "test" started', '✗ checkout.spec: expected HTTP 200, got 500', 'pipeline failed → deploy stage skipped', '✓ fix pushed · tests green · rollout 3/3 ready'],
  },
  {
    id: 'crash', icon: ServerCrash, title: 'A server dies at 2 AM', blurb: 'The machine running the app suddenly fails.',
    without: {
      servers: 'o',
      steps: [
        { t: '02:14', text: 'The only server crashes. The site goes dark', app: DOWN, servers: 'x', impact: 300 },
        { t: '02:31', text: 'An alarm wakes an engineer up', app: DOWN, servers: 'x', impact: 1200 },
        { t: '02:52', text: 'They log in and start investigating', app: DOWN, servers: 'x', impact: 2000 },
        { t: '03:05', text: 'Server restarted by hand. Site is back', app: OK, servers: 'o', impact: 2400 },
      ],
      result: '51 minutes offline',
    },
    with: {
      servers: 'ooo',
      steps: [
        { t: '02:14', text: 'One of three servers crashes', app: OK, servers: 'oox' },
        { t: '02:14', text: 'Customers are moved to the healthy servers instantly', app: OK, servers: 'oox' },
        { t: '02:15', text: 'A replacement starts automatically', app: OK, servers: 'oon' },
        { t: '02:15', text: 'Back to full strength. Nobody was woken up', app: OK, servers: 'ooo', badge: 'Healed itself' },
      ],
      result: 'Zero seconds offline',
    },
    explain: 'The app always runs as several copies. When one fails, the platform notices within seconds, sends customers to the healthy copies and starts a replacement on its own.',
    skills: ['Kubernetes', 'OpenShift', 'Health checks', 'High availability', 'On-call'],
    logs: ['$ kubectl get pods -w', 'shop-7d9f-x2  0/1  Error   node-c NotReady', 'endpoints: removed shop-7d9f-x2 from service', 'shop-7d9f-q8  1/1  Running   (replacement)'],
  },
  {
    id: 'spike', icon: TrendingUp, title: 'Sale-day rush', blurb: 'Five times the usual visitors arrive at once.',
    without: {
      servers: 'ooo',
      steps: [
        { t: '12:00', text: 'The sale starts. Visitors jump 5×', app: SLOW, impact: 800 },
        { t: '12:03', text: 'Pages take 9 seconds to load', app: SLOW, impact: 3000 },
        { t: '12:06', text: 'Servers overload and the site crashes', app: DOWN, servers: 'xxx', impact: 9000 },
        { t: '12:44', text: 'The team adds servers by hand', app: OK, servers: 'oooooo', impact: 14000 },
      ],
      result: '38 minutes down during the big sale',
    },
    with: {
      servers: 'ooo',
      steps: [
        { t: '12:00', text: 'The sale starts. Visitors jump 5×', app: OK },
        { t: '12:01', text: 'The system sees the load and adds servers itself', app: OK, servers: 'ooonnn' },
        { t: '12:02', text: 'Pages stay fast for everyone', app: OK, servers: 'oooooo', badge: 'Scaled up' },
        { t: '14:00', text: 'Rush over. Extra servers removed to save money', app: OK, servers: 'ooo', badge: 'Scaled down' },
      ],
      result: 'Fast all day, no wasted spend',
    },
    explain: 'Capacity follows demand automatically: more servers when traffic rises, fewer when it falls, so the site stays fast without paying for idle machines.',
    skills: ['Autoscaling', 'Kubernetes', 'Prometheus', 'Capacity planning', 'Load testing'],
    logs: ['$ kubectl get hpa shop', 'cpu: 92%/70%  replicas: 3 → 6', 'p95 latency: 2.1s → 180ms', 'cpu: 31%/70%  replicas: 6 → 3'],
  },
  {
    id: 'leak', icon: KeyRound, title: 'A password slips out', blurb: 'Someone accidentally puts a password in the code.',
    without: {
      servers: 'ooo',
      steps: [
        { t: 'Mon', text: 'A cloud password is accidentally added to the code', app: OK },
        { t: 'Mon', text: 'It goes live with the next release', app: OK },
        { t: 'Wed', text: 'Automated attackers find it and get in', app: LEAK, impact: 48000 },
        { t: '3 wks', text: 'The breach is finally discovered', app: LEAK, impact: 48000 },
      ],
      result: 'Data breach found 3 weeks later',
    },
    with: {
      servers: 'ooo',
      steps: [
        { t: 'Mon', text: 'A cloud password is accidentally added to the code', app: OK },
        { t: 'Mon', text: 'A security scan spots it within seconds', app: OK },
        { t: 'Mon', text: 'The change is blocked before it goes anywhere', app: OK, badge: 'Leak blocked' },
        { t: 'Mon', text: 'Password replaced; strict access rules limit any risk', app: OK, badge: 'Secured' },
      ],
      result: 'Nothing exposed',
    },
    explain: 'Security checks are built into the delivery process, so secrets and risky changes are caught automatically, and strict access rules limit what any one mistake can reach.',
    skills: ['Secret scanning', 'DevSecOps', 'RBAC', 'Network policies', 'Pod security'],
    logs: ['$ secret-scan ./', '✗ found cloud access key in config/app.env:3', 'pipeline blocked · key revoked and rotated', '✓ RBAC: service account limited to namespace "shop"'],
  },
  {
    id: 'slow', icon: Gauge, title: 'Mysteriously slow', blurb: 'Customers say the app is slow. Nobody knows why.',
    without: {
      servers: 'ooo',
      steps: [
        { t: '15:00', text: 'Customers say the app feels slow', app: SLOW, impact: 500 },
        { t: '15:40', text: 'Support tickets pile up', app: SLOW, impact: 2500 },
        { t: '16:30', text: 'Engineers dig through millions of log lines by hand', app: SLOW, impact: 4800 },
        { t: '18:05', text: 'Cause found: the database ran out of connections', app: OK, impact: 6200 },
      ],
      result: '3 hours of slow app',
    },
    with: {
      servers: 'ooo',
      steps: [
        { t: '15:00', text: 'Monitoring flags the slowdown before most customers notice', app: BLIP, impact: 40 },
        { t: '15:01', text: 'An AI bot reads the logs and posts the likely cause in the team chat', app: BLIP, impact: 90, badge: 'AI investigating' },
        { t: '15:02', text: 'It points to the cause: database out of connections', app: BLIP, impact: 120, badge: 'Root cause found' },
        { t: '15:06', text: 'Fix applied. Speed back to normal', app: OK, impact: 120 },
      ],
      result: 'Fixed in 6 minutes',
    },
    explain: 'Good monitoring spots problems early, and AI-assisted troubleshooting turns hours of searching through logs into minutes, so engineers go straight to the cause.',
    skills: ['Prometheus', 'Grafana', 'ELK', 'SLOs & alerting', 'GenAI troubleshooting (AIOps)'],
    logs: ['ALERT ShopLatencyHigh: p95 1.9s > 500ms SLO', '$ ai-ops investigate --service shop', '→ 94% of slow requests wait on db pool (max 20/20)', '$ kubectl set env deploy/shop DB_POOL_MAX=60  ✓ p95 210ms'],
  },
];

const STEP_MS = 1900;
const toneText: Record<Tone, string> = { ok: 'text-neon-green', warn: 'text-neon-amber', bad: 'text-neon-red' };
const toneDot: Record<Tone, string> = { ok: 'bg-neon-green', warn: 'bg-neon-amber', bad: 'bg-neon-red' };

/** Number that eases towards its target. */
const Ticker = ({ value }: { value: number }) => {
  const [n, setN] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value || reducedMotion()) { from.current = value; return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 900);
      const v = Math.round(start + (value - start) * (1 - Math.pow(1 - p, 3)));
      setN(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{(reducedMotion() ? value : n).toLocaleString()}</>;
};

/** A tiny, deliberately ordinary online store, so anyone recognises what is at stake. */
const Store = ({ app, servers, badge }: { app: App; servers: string; badge?: string }) => (
  <div className="rounded-lg overflow-hidden bg-[#f4f5f7] text-[#1d232b]">
    <div className="flex items-center gap-1 px-2.5 py-1.5 bg-[#e6e8ec]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b]" /><span className="w-1.5 h-1.5 rounded-full bg-[#ffc24b]" /><span className="w-1.5 h-1.5 rounded-full bg-[#4cd07d]" />
      <span className="ml-2 flex-1 rounded bg-white px-2 text-[10px] text-[#6b7480] truncate">shopnow.example</span>
    </div>
    <div className="relative px-2.5 py-2">
      <div className={`transition-all duration-500 ${app.dim ? 'opacity-20 grayscale blur-[1px]' : ''}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-xs">ShopNow</span>
          <ShoppingCart className="w-3.5 h-3.5" />
        </div>
        <div className="grid grid-cols-3 gap-1.5 mb-1.5">
          {['#c9d8ff', '#ffd9c2', '#d4f2d8'].map((c) => <div key={c} className="h-6 rounded" style={{ background: c }} />)}
        </div>
        <div className={`rounded py-1 text-center text-[11px] font-semibold text-white transition-colors duration-500 ${app === BROKEN ? 'bg-[#e5484d]' : 'bg-[#1d232b]'}`}>
          {app === BROKEN ? 'Payment failed' : 'Checkout'}
        </div>
      </div>
      {app.overlay && (
        <div className="absolute inset-0 grid place-items-center p-2" style={{ animation: 'fade-up .4s var(--ease-out) both' }}>
          <div className={`rounded-md px-2.5 py-1.5 text-center text-[11px] font-semibold shadow-lg ${app.tone === 'bad' ? 'bg-[#e5484d] text-white' : 'bg-[#ffc24b] text-[#1d232b]'}`}>
            {app.overlay}
          </div>
        </div>
      )}
      {badge && (
        <div key={badge} className="absolute top-1.5 right-2 rounded-full bg-[#1d232b] px-2 py-0.5 text-[10px] font-semibold text-[#b4f04a]"
          style={{ animation: 'fade-up .4s var(--ease-out) both' }}>
          <Check className="inline w-3 h-3 mr-0.5 align-[-2px]" />{badge}
        </div>
      )}
    </div>
    <div className="flex items-center gap-1 px-2.5 py-1.5 border-t border-[#e1e4e8] text-[10px] text-[#6b7480]">
      Servers
      {servers.split('').map((s, i) => (
        <span key={i} title={s === 'x' ? 'crashed' : s === 'n' ? 'starting' : 'healthy'}
          className={`w-2.5 h-2.5 rounded-sm transition-colors duration-500 ${s === 'x' ? 'bg-[#e5484d]' : s === 'n' ? 'bg-[#ffc24b] animate-pulse' : 'bg-[#4cd07d]'}`} />
      ))}
    </div>
  </div>
);

const LaneView = ({ kind, lane, step, done }: { kind: 'without' | 'with'; lane: Lane; step: number; done: boolean }) => {
  const cur = step >= 0 ? lane.steps[Math.min(step, lane.steps.length - 1)] : undefined;
  const app = cur?.app ?? OK;
  const good = kind === 'with';
  const impact = cur?.impact ?? 0;
  return (
    <div className={`rounded-2xl border p-4 transition-colors duration-700 ${
      done ? (good ? 'border-neon-green/60 bg-neon-green/[0.04]' : 'border-neon-red/50 bg-neon-red/[0.04]') : 'border-dashboard-border bg-dashboard-panel'}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="font-semibold">{good ? 'With my safeguards' : 'Without safeguards'}</h3>
        <span className={`flex items-center gap-1.5 font-mono text-[11px] ${toneText[app.tone]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${toneDot[app.tone]} ${app.tone !== 'ok' ? 'animate-pulse' : ''}`} />{app.label}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
        <Store app={app} servers={cur?.servers ?? lane.servers} badge={cur?.badge} />
        <div className="text-right">
          <div className={`text-3xl font-semibold tabular-nums ${impact > 0 ? (good ? 'text-neon-amber' : 'text-neon-red') : 'text-neon-green'}`}>
            <Ticker value={impact} />
          </div>
          <div className="text-[11px] text-terminal-muted leading-tight">customers<br />affected</div>
        </div>
      </div>
      <div className="mt-3 min-h-[2.75rem] text-sm">
        {done ? (
          <div className={`rounded-lg px-3 py-2 font-semibold ${good ? 'bg-neon-green text-dashboard-bg' : 'bg-neon-red/15 text-neon-red'}`}
            style={{ animation: 'fade-up .45s var(--ease-out) both' }}>
            {good ? '✓ ' : '✗ '}{lane.result}
          </div>
        ) : cur ? (
          <p key={step} className="flex gap-2" style={{ animation: 'fade-up .45s var(--ease-out) both' }}>
            <span className="font-mono text-xs text-terminal-muted/70 pt-0.5 shrink-0">{cur.t}</span>
            <span>{cur.text}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
};

const IncidentDemo = () => {
  const [sel, setSel] = useState(0);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(-1);
  const [tried, setTried] = useState<string[]>([]);
  const [eng, setEng] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, 0.15);

  const sc = SCENARIOS[sel];
  const total = Math.max(sc.without.steps.length, sc.with.steps.length);
  const done = step >= total - 1;

  // Play the chosen scenario once the stage is on screen.
  useEffect(() => {
    if (!inView) return;
    const s = SCENARIOS[sel];
    const n = Math.max(s.without.steps.length, s.with.steps.length);
    const fast = reducedMotion();
    const timers = [setTimeout(() => setStep(fast ? n - 1 : -1), 0)];
    if (!fast) for (let i = 0; i < n; i++) timers.push(setTimeout(() => setStep(i), 500 + i * STEP_MS));
    timers.push(setTimeout(() => setTried((t) => (t.includes(s.id) ? t : [...t, s.id])), fast ? 0 : 500 + n * STEP_MS));
    return () => timers.forEach(clearTimeout);
  }, [inView, sel, run]);

  const pick = (i: number) => { setSel(i); setStep(-1); setRun((r) => r + 1); };
  const logCount = step < 0 ? 0 : Math.ceil(((step + 1) / total) * sc.logs.length);

  return (
    <section id="demo" className="py-12 md:py-16 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="What my job looks like, in two minutes"
          intro="Pick a problem and watch it hit the same online store twice: without safeguards, and with the systems I build." />

        <div className="flex flex-wrap items-center gap-2 mb-2" role="tablist" aria-label="Problems">
          {SCENARIOS.map((s, i) => {
            const on = i === sel;
            return (
              <button key={s.id} role="tab" aria-selected={on} onClick={() => pick(i)}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors ${
                  on ? 'border-neon-green bg-neon-green/10 text-neon-green' : 'border-dashboard-border text-terminal-muted hover:text-terminal-text hover:border-terminal-muted/60'}`}>
                <s.icon className="w-4 h-4" />
                {s.title}
                {tried.includes(s.id) && !on && <Check className="w-3.5 h-3.5 text-neon-green" aria-label="tried" />}
              </button>
            );
          })}
          <button onClick={() => pick(sel)} className="ml-auto flex items-center gap-1.5 text-xs text-terminal-muted hover:text-neon-green">
            <RotateCcw className="w-3.5 h-3.5" /> Replay
          </button>
        </div>

        <p className="mb-4 text-sm text-terminal-muted">The problem: <span className="text-terminal-text">{sc.blurb}</span></p>

        <div ref={stage} className="grid md:grid-cols-2 gap-3" aria-live="polite">
          <LaneView key={`w-${sel}-${run}`} kind="without" lane={sc.without} step={step} done={done} />
          <LaneView key={`m-${sel}-${run}`} kind="with" lane={sc.with} step={step} done={done} />
        </div>

        <div className={`mt-4 rounded-2xl border border-dashboard-border bg-dashboard-panel px-5 py-4 transition-opacity duration-700 ${done ? 'opacity-100' : 'opacity-50'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
            <p className="flex-1 text-sm leading-relaxed"><span className="text-terminal-muted">What made the difference: </span>{sc.explain}</p>
            <button onClick={() => setEng((e) => !e)} aria-expanded={eng}
              className="shrink-0 flex items-center gap-2 font-mono text-xs text-terminal-muted hover:text-neon-green">
              <TermIcon className="w-4 h-4" /> {eng ? 'Hide' : 'Show'} engineer's view
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {sc.skills.map((k) => (
              <span key={k} className="font-mono text-[11px] px-2 py-0.5 rounded-full border border-dashboard-border text-terminal-muted">{k}</span>
            ))}
          </div>
          {eng && (
            <div className="mt-3 rounded-lg bg-terminal-bg p-3 font-mono text-xs space-y-1">
              {sc.logs.slice(0, logCount).map((l, i) => (
                <div key={`${sel}-${i}`} style={{ animation: 'fade-up .3s var(--ease-out) both' }}
                  className={l.startsWith('$') ? 'text-neon-cyan' : l.startsWith('✗') || l.startsWith('ALERT') ? 'text-neon-red' : l.startsWith('✓') ? 'text-neon-green' : 'text-terminal-muted'}>
                  {l}
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-terminal-muted/70">Illustrative example; numbers show a typical incident, not a specific company.</p>
      </div>
    </section>
  );
};

export default IncidentDemo;
