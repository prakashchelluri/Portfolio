import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Terminal from '@/components/Terminal';
import { Check, X, Loader2, Circle, Minus, CheckCircle2 } from 'lucide-react';

// A browser-only simulation: a commit travels through pipeline gates into a small
// "cluster" the visitor can then break (kill pods, drain nodes, spike traffic).

type PodState = 'Running' | 'Creating' | 'Crash' | 'Terminating';
type Pod = { id: number; ver: string; state: PodState; node: number };
type Status = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
type Payload = 'clean' | 'secret' | 'cve' | 'crash' | 'errors';
type Gate = 'secrets' | 'cve' | 'probe' | 'slo';
type Incident = null | 'secret' | 'cve' | 'down' | 'errors';
type Mission = 'ship' | 'blocked' | 'incident' | 'recover' | 'heal' | 'spike' | 'drain';
type Tone = 'good' | 'warn' | 'bad';
type Release = { name: string; sha: string };

const REPLICAS = 3;
const NODES = [
  { name: 'worker-a', zone: 'zone-1' },
  { name: 'worker-b', zone: 'zone-2' },
  { name: 'worker-c', zone: 'zone-3' },
];

const STAGES = [
  { title: 'Commit', tool: 'Git · GitLab', why: 'Protected main branch; every change arrives through a reviewed merge request.' },
  { title: 'Build & Test', tool: 'GitLab CI', why: 'Fast feedback first: lint and unit tests fail in minutes, not after a deploy.' },
  { title: 'Security Scan', tool: 'gitleaks · semgrep', why: 'A hard gate. Leaked credentials stop the pipeline before anything is built.' },
  { title: 'Image & Sign', tool: 'Buildah · Trivy · cosign', why: 'Rootless build, CVE scan of the image, then a signature the cluster verifies at admission.' },
  { title: 'GitOps', tool: 'Kustomize', why: 'CI never touches the cluster. It only commits the new image tag; Git stays the source of truth.' },
  { title: 'Argo CD Sync', tool: 'K8s / OpenShift', why: 'Rolling update with maxUnavailable 0 and readiness probes, so a bad release never takes traffic.' },
  { title: 'Verify', tool: 'Prometheus · Grafana', why: 'A release is done only when error rate and latency stay inside the SLO.' },
];

const PAYLOADS: { id: Payload; label: string }[] = [
  { id: 'clean', label: 'Clean commit' },
  { id: 'secret', label: 'Leaked AWS key' },
  { id: 'cve', label: 'Vulnerable base image' },
  { id: 'crash', label: 'Crashes on start' },
  { id: 'errors', label: 'Fails 1 request in 8' },
];

const GATES: { id: Gate; label: string }[] = [
  { id: 'secrets', label: 'Secret scan' },
  { id: 'cve', label: 'Image CVE scan' },
  { id: 'probe', label: 'Readiness probes' },
  { id: 'slo', label: 'SLO gate + auto-rollback' },
];

const MISSIONS: { id: Mission; label: string }[] = [
  { id: 'ship', label: 'Ship your name to production' },
  { id: 'blocked', label: 'Get a bad commit stopped by a gate' },
  { id: 'incident', label: 'Switch off a gate and break production' },
  { id: 'recover', label: 'Recover from an incident' },
  { id: 'heal', label: 'Kill a pod and watch it heal' },
  { id: 'spike', label: 'Survive a traffic spike' },
  { id: 'drain', label: 'Drain a node for maintenance' },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const newSha = () => Math.random().toString(16).slice(2, 9).padEnd(7, '0');
const podCount = (pods: Pod[], node: number) => pods.filter((p) => p.node === node && p.state !== 'Terminating').length;
// Least-loaded node, optionally skipping a cordoned one.
const pickNode = (pods: Pod[], exclude: number) =>
  [0, 1, 2].filter((n) => n !== exclude).sort((a, b) => podCount(pods, a) - podCount(pods, b))[0];

const statusIcon = {
  pending: { Icon: Circle, cls: 'text-terminal-muted', border: 'border-dashboard-border' },
  running: { Icon: Loader2, cls: 'text-neon-cyan animate-spin', border: 'border-neon-cyan' },
  passed: { Icon: Check, cls: 'text-neon-green', border: 'border-neon-green/50' },
  failed: { Icon: X, cls: 'text-neon-red', border: 'border-neon-red' },
  skipped: { Icon: Minus, cls: 'text-terminal-muted', border: 'border-dashboard-border' },
};

const podCls: Record<PodState, string> = {
  Running: 'border-neon-green/60 text-neon-green',
  Creating: 'border-neon-amber text-neon-amber animate-pulse',
  Crash: 'border-neon-red text-neon-red',
  Terminating: 'border-dashboard-border text-terminal-muted opacity-50',
};

const toneCls: Record<Tone, string> = { good: 'text-neon-green', warn: 'text-neon-amber', bad: 'text-neon-red' };

const inputCls =
  'w-full bg-dashboard-bg border border-dashboard-border rounded px-3 py-2 text-sm text-terminal-text placeholder:text-terminal-muted focus:outline-none focus:border-neon-cyan';
const chipCls = (on: boolean) =>
  `cursor-pointer px-2.5 py-1.5 rounded border text-xs transition-colors focus-within:border-neon-cyan ${
    on ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10' : 'border-dashboard-border text-terminal-muted'
  }`;
const panelCls = 'p-4 rounded-lg bg-dashboard-panel border border-dashboard-border';
const smallBtn =
  'px-2.5 py-1.5 rounded border border-dashboard-border text-xs text-terminal-text hover:border-neon-cyan hover:text-neon-cyan disabled:opacity-40 disabled:cursor-not-allowed transition-colors';

const Spark = ({ data, floor, color, label, value }: { data: number[]; floor: number; color: string; label: string; value: string }) => {
  const max = Math.max(floor, ...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${29 - (v / max) * 27}`).join(' ');
  return (
    <div className="p-2 rounded bg-dashboard-bg border border-dashboard-border">
      <div className="flex justify-between gap-2 text-[11px]">
        <span className="text-terminal-muted">{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-8 mt-1" aria-hidden>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
};

const FIRST: Release = { name: 'world', sha: 'a1b2c3d' };

const PipelineDemo = () => {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [payload, setPayload] = useState<Payload>('clean');
  const [gates, setGates] = useState<Record<Gate, boolean>>({ secrets: true, cve: true, probe: true, slo: true });
  const [busy, setBusy] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>(STAGES.map(() => 'pending'));
  const [log, setLog] = useState<string[]>([]);
  const [events, setEvents] = useState<string[]>([]);
  const [pods, setPods] = useState<Pod[]>([0, 1, 2].map((i) => ({ id: i, ver: FIRST.sha, state: 'Running', node: i })));
  const [live, setLive] = useState(FIRST);
  const [lastGood, setLastGood] = useState(FIRST);
  const [incident, setIncident] = useState<Incident>(null);
  const [spike, setSpike] = useState(false);
  const [cordoned, setCordoned] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<{ tone: Tone; text: string } | null>(null);
  const [done, setDone] = useState<Mission[]>([]);
  const [hist, setHist] = useState(() => Array.from({ length: 40 }, () => ({ rps: 120, err: 0, p95: 35 })));

  const dead = useRef(false);
  const nextId = useRef(3);
  const logRef = useRef<HTMLDivElement>(null);
  const sim = useRef({ pods, spike, incident }); // latest state for timers and async flows

  useEffect(() => { sim.current = { pods, spike, incident }; });
  useEffect(() => { dead.current = false; return () => { dead.current = true; }; }, []);
  useEffect(() => { logRef.current?.scrollTo(0, logRef.current.scrollHeight); }, [log]);

  // Metrics: derived every second from what the cluster looks like right now.
  useEffect(() => {
    const t = setInterval(() => {
      const s = sim.current;
      const ready = s.pods.filter((p) => p.state === 'Running').length;
      const jitter = () => Math.random() - 0.5;
      const rps = (s.spike ? 480 : 120) + jitter() * 16;
      const load = ready ? rps / (ready * 150) : 0; // each pod handles ~150 rps
      let err = ready === 0 ? 100 : load > 1 ? (1 - 1 / load) * 100 : 0;
      if (s.incident === 'errors') err = Math.max(err, 12 + jitter() * 2);
      const p95 = ready === 0 ? 0 : 35 * (1 + Math.max(0, load - 0.6) * 4) + jitter() * 4;
      setHist((h) => [...h.slice(-39), { rps, err, p95 }]);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const wait = async (ms: number) => { await sleep(ms); if (dead.current) throw new Error('unmounted'); };
  const say = async (...lines: string[]) => { for (const l of lines) { await wait(340); setLog((x) => [...x, l]); } };
  const ev = (line: string) => setEvents((e) => [...e.slice(-4), line]);
  const win = (...m: Mission[]) => setDone((d) => [...new Set([...d, ...m])]);
  const setPodState = (id: number, state: PodState) => setPods((ps) => ps.map((p) => (p.id === id ? { ...p, state } : p)));

  // One action at a time keeps pipeline runs and cluster actions from racing each other.
  const act = async (fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    try { await fn(); } catch (e) { if (!dead.current) throw e; } finally { if (!dead.current) setBusy(false); }
  };

  // Rolling update to `ver`: surge one pod, wait for it, then remove one old pod.
  // Returns false when a readiness probe stops the rollout.
  const rollout = async (ver: string, healthy: boolean, probes: boolean) => {
    const targets = sim.current.pods.filter((p) => p.ver !== ver);
    let have = sim.current.pods.length - targets.length;
    for (const t of targets) {
      if (have < REPLICAS) {
        const id = nextId.current++;
        setPods((ps) => [...ps, { id, ver, state: 'Creating', node: t.node }]);
        setLog((x) => [...x, `pod hello-${ver}-${id} ContainerCreating`]);
        await wait(800);
        setPodState(id, healthy ? 'Running' : 'Crash');
        if (!healthy && probes) {
          setLog((x) => [...x, '! readiness probe failed: GET /healthz returned 500']);
          return false;
        }
        setLog((x) => [...x, probes ? 'readiness probe passed, old pod terminated'
          : healthy ? '~ no readiness probe: pod assumed ready'
          : '~ no readiness probe: crash-looping pod counted as available']);
        have++;
      }
      setPodState(t.id, 'Terminating');
      await wait(350);
      setPods((ps) => ps.filter((p) => p.id !== t.id));
    }
    return true;
  };

  const push = (e: FormEvent) => {
    e.preventDefault();
    const who = name.trim();
    if (!who) return;
    act(async () => {
      const sha = newSha();
      const img = `registry.example.com/hello:${sha}`;
      const message = msg.trim() || `feat: greet ${who}`;
      const good = incident ? lastGood : live;

      setStatuses(STAGES.map(() => 'pending'));
      setLog([]);
      setOutcome(null);

      const st = (i: number, s: Status) => setStatuses((p) => p.map((v, j) => (j === i ? s : v)));
      const stage = async (i: number, lines: string[], end: Status = 'passed') => { st(i, 'running'); await say(...lines); st(i, end); };
      const finish = (tone: Tone, text: string, ...m: Mission[]) => {
        setStatuses((p) => p.map((v) => (v === 'pending' ? 'skipped' : v)));
        setOutcome({ tone, text });
        win(...m);
      };
      const restore = async () => {
        await say('$ git revert HEAD && git push   # manifest repo', 'argocd: syncing back to last good revision');
        await rollout(good.sha, true, gates.probe);
        setLive(good);
        setIncident(null);
      };

      await stage(0, [`$ git commit -m "${message}"`, `[main ${sha}] ${message}`, '$ git push origin main', 'remote: webhook delivered, pipeline created']);
      await stage(1, ['$ npm ci && npm run lint', 'lint: 0 problems', '$ npm test', 'tests passed']);

      if (gates.secrets && payload === 'secret') {
        await stage(2, ['$ gitleaks detect', '! leak: aws-access-key in config/app.env:3', '! gate failed: rotate the key, then purge it from history'], 'failed');
        return finish('good', 'Blocked at the secret scan. Nothing was built or deployed.', 'blocked');
      }
      await stage(2, [...(gates.secrets ? ['$ gitleaks detect', 'no leaks found'] : ['~ secret scan is switched off']), '$ semgrep ci', '0 blocking findings']);

      const build = [`$ buildah bud -t ${img} .`, 'image built: rootless, non-root user'];
      if (gates.cve && payload === 'cve') {
        await stage(3, [...build, `$ trivy image ${img}`, '! 1 CRITICAL vulnerability in the base image (fix available)', '! gate failed: rebuild on a patched base image'], 'failed');
        return finish('good', 'Blocked at the image scan. The vulnerable image was never signed or deployed.', 'blocked');
      }
      await stage(3, [...build, ...(gates.cve ? [`$ trivy image ${img}`, '0 critical, 0 high'] : ['~ image scan is switched off']), `$ cosign sign ${img}`, 'signature pushed to registry']);

      await stage(4, ['$ cd manifests/overlays/prod', `$ kustomize edit set image hello=${img}`, `$ git commit -m "release hello ${sha}" && git push`, 'manifest repo updated']);

      st(5, 'running');
      await say('argocd: app "hello" OutOfSync, syncing', 'deployment/hello configured (maxSurge 1, maxUnavailable 0)');
      if (!(await rollout(sha, payload !== 'crash', gates.probe))) {
        await say('$ kubectl logs deploy/hello --previous', '! Error: missing env GREETING_CONFIG', '! argocd: Degraded. Old pods still serve 100% of traffic');
        await restore();
        st(5, 'failed');
        return finish('good', 'The readiness probe caught it. Old pods kept all the traffic and the release was reverted.', 'blocked');
      }
      setLive({ name: who, sha });
      await say('rollout complete: 3/3 updated', 'argocd: Synced · Healthy');
      st(5, 'passed');

      st(6, 'running');
      await say('$ curl -s https://hello.apps.example.com');
      if (payload === 'crash' || payload === 'errors') {
        const down = payload === 'crash';
        setIncident(down ? 'down' : 'errors');
        setLastGood(good);
        await say(
          down ? '! HTTP 503 Service Unavailable' : `Hello, ${who}!   (but 1 request in 8 fails)`,
          `! promql: error ratio = ${down ? 100 : 12}%, 99.9% SLO breached`,
          '! alert firing: HelloHighErrorRate',
        );
        if (gates.slo) {
          await say('slo gate: breach detected, rolling back automatically');
          await restore();
          st(6, 'failed');
          return down
            ? finish('warn', 'A full outage, then the SLO gate rolled it back on its own. A readiness probe would have prevented it entirely.', 'incident', 'recover')
            : finish('good', 'The SLO gate saw the error rate and rolled back within a minute. Nobody had to be paged.', 'blocked');
        }
        st(6, 'failed');
        await say('~ SLO gate is switched off: nothing stops this release. You are on call.');
        return finish('bad', down
          ? 'Production is down, and Argo CD still says Healthy: without a readiness probe Kubernetes cannot tell. Roll it back.'
          : 'One request in eight is failing and no gate is watching. Roll it back.', 'incident');
      }
      await say(`Hello, ${who}!`, 'promql: error ratio (5m) = 0.00%, inside 99.9% SLO', 'promql: p95 latency inside budget', 'release marked healthy, Grafana annotation added');
      st(6, 'passed');

      if (payload === 'secret' || payload === 'cve') {
        setIncident(payload);
        setLastGood(good);
        return finish('bad', payload === 'secret'
          ? 'Deployed with a live AWS key inside the image. Every check is green because the one that mattered was off. Rolling back is not enough: the key must be rotated.'
          : 'Deployed with a known critical vulnerability. Every check is green because the one that mattered was off.', 'incident');
      }
      setIncident(null);
      const won: Mission[] = incident ? ['ship', 'recover'] : ['ship'];
      finish('good', `Deployed. ${who} is live on 3 pods.`, ...won);
    });
  };

  const rollback = () => act(async () => {
    if (incident === 'secret') await say('$ aws iam update-access-key --status Inactive   # then issue a new one', 'leaked key disabled and rotated');
    await say('$ git revert HEAD && git push   # manifest repo', 'argocd: syncing back to last good revision');
    await rollout(lastGood.sha, true, gates.probe);
    setLive(lastGood);
    setIncident(null);
    setOutcome({ tone: 'good', text: 'Recovered. Now switch the gate back on so it cannot happen again.' });
    win('recover');
  });

  const kill = (pod: Pod) => act(async () => {
    ev(`$ kubectl delete pod hello-${pod.ver}-${pod.id}`);
    setPodState(pod.id, 'Terminating');
    await wait(500);
    const id = nextId.current++;
    setPods((ps) => {
      const rest = ps.filter((p) => p.id !== pod.id);
      return [...rest, { id, ver: pod.ver, state: 'Creating', node: pickNode(rest, -1) }];
    });
    ev('replicaset: 2 of 3 pods, creating a replacement');
    await wait(1300);
    setPodState(id, 'Running');
    ev('replacement Ready. No user impact: the other replicas held the traffic');
    win('heal');
  });

  const trafficSpike = () => act(async () => {
    setSpike(true);
    ev('load test: traffic 120 → 480 rps');
    await wait(3000);
    const ids = [0, 1, 2].map(() => nextId.current++);
    setPods((ps) => ids.reduce<Pod[]>((acc, id) => [...acc, { id, ver: live.sha, state: 'Creating', node: pickNode(acc, -1) }], ps));
    ev('hpa: CPU above 70% target, scaling 3 → 6');
    await wait(1500);
    setPods((ps) => ps.map((p) => (ids.includes(p.id) ? { ...p, state: 'Running' } : p)));
    ev('6/6 ready: latency and errors recover');
    await wait(4000);
    setSpike(false);
    ev('traffic back to normal');
    await wait(1500);
    setPods((ps) => ps.filter((p) => !ids.includes(p.id)));
    ev('hpa: scaled 6 → 3 (the real stabilization window is 5 minutes)');
    win('spike');
  });

  const drain = (n: number) => act(async () => {
    const victims = sim.current.pods.filter((p) => p.node === n);
    setCordoned(n);
    ev(`$ kubectl drain ${NODES[n].name} --ignore-daemonsets`);
    ev(victims.length ? 'cordoned; evicting one pod at a time (PodDisruptionBudget: minAvailable 2)' : 'cordoned; nothing to evict');
    for (const v of victims) {
      const id = nextId.current++;
      setPods((ps) => [
        ...ps.map((p) => (p.id === v.id ? { ...p, state: 'Terminating' as const } : p)),
        { id, ver: v.ver, state: 'Creating', node: pickNode(ps, n) },
      ]);
      await wait(1000);
      setPods((ps) => ps.filter((p) => p.id !== v.id).map((p) => (p.id === id ? { ...p, state: 'Running' } : p)));
      await wait(300);
    }
    ev('node drained: safe to patch or reboot');
    await wait(2500);
    setCordoned(null);
    ev(`$ kubectl uncordon ${NODES[n].name}   # pods stay put; Kubernetes does not rebalance on its own`);
    win('drain');
  });

  const ready = pods.filter((p) => p.state === 'Running').length;
  const now = hist[hist.length - 1];
  const active = statuses.findIndex((s) => s === 'running' || s === 'failed');
  const note = STAGES[active >= 0 ? active : statuses.lastIndexOf('passed')];
  const clusterLocked = busy || incident === 'down';
  const alert = now.err >= 10 ? { text: 'FIRING · HelloHighErrorRate', cls: 'text-neon-red border-neon-red' }
    : now.err >= 1 ? { text: 'PENDING · burning error budget', cls: 'text-neon-amber border-neon-amber' }
    : { text: 'No alerts', cls: 'text-neon-green border-dashboard-border' };

  return (
    <section id="pipeline" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-px bg-neon-cyan" />
          <span className="text-xs font-mono text-neon-cyan uppercase tracking-wider">Hands-on Demo</span>
        </div>
        <h2 className="font-mono text-2xl md:text-3xl text-terminal-text mb-3">
          Ship your name to production. <span className="text-neon-green">Then try to break it.</span>
        </h2>
        <p className="text-sm text-terminal-muted mb-6 max-w-3xl">
          This is how I build delivery pipelines and run clusters. Push a commit, switch off a safety gate and see what
          gets through, then kill pods, drain a node or spike the traffic. It is a simulation running in your browser;
          nothing is sent anywhere.
        </p>

        {/* Missions */}
        <div className={`${panelCls} mb-6`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-terminal-muted">Things to try</span>
            <span className="text-xs text-neon-cyan">{done.length}/{MISSIONS.length} done</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1">
            {MISSIONS.map((m) => {
              const ok = done.includes(m.id);
              return (
                <li key={m.id} className={`flex items-center gap-2 text-xs ${ok ? 'text-neon-green' : 'text-terminal-muted'}`}>
                  {ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden /> : <Circle className="w-3.5 h-3.5 shrink-0" aria-hidden />}
                  {m.label}
                  <span className="sr-only">{ok ? '(done)' : '(not done)'}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Stages */}
        <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {STAGES.map((s, i) => {
            const { Icon, cls, border } = statusIcon[statuses[i]];
            return (
              <li key={s.title} className={`p-2 rounded border bg-dashboard-panel ${border}`}>
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${cls}`} aria-hidden />
                  <span className="text-xs text-terminal-text truncate">{s.title}</span>
                  <span className="sr-only">{statuses[i]}</span>
                </div>
                <div className="text-[10px] text-terminal-muted mt-1 truncate">{s.tool}</div>
              </li>
            );
          })}
        </ol>
        <p className="mt-2 mb-6 text-xs text-terminal-muted min-h-8">
          {note && (<><span className="text-neon-cyan">{note.title}:</span> {note.why}</>)}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: the commit, the gates, the log */}
          <Terminal title="visitor@laptop:~/hello-app">
            <form onSubmit={push} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pd-name" className="block text-xs text-terminal-muted mb-1">Your name</label>
                  <input id="pd-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)}
                    maxLength={24} required placeholder="Ada" autoComplete="off" disabled={busy} />
                </div>
                <div>
                  <label htmlFor="pd-msg" className="block text-xs text-terminal-muted mb-1">Commit message</label>
                  <input id="pd-msg" className={inputCls} value={msg} onChange={(e) => setMsg(e.target.value)}
                    maxLength={60} placeholder={`feat: greet ${name.trim() || 'Ada'}`} autoComplete="off" disabled={busy} />
                </div>
              </div>
              <fieldset disabled={busy}>
                <legend className="text-xs text-terminal-muted mb-1">What is in your commit?</legend>
                <div className="flex flex-wrap gap-2">
                  {PAYLOADS.map((p) => (
                    <label key={p.id} className={chipCls(payload === p.id)}>
                      <input type="radio" name="pd-payload" className="sr-only" checked={payload === p.id} onChange={() => setPayload(p.id)} />
                      {p.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset disabled={busy}>
                <legend className="text-xs text-terminal-muted mb-1">Pipeline gates (switch one off and see what gets through)</legend>
                <div className="flex flex-wrap gap-2">
                  {GATES.map((g) => (
                    <label key={g.id} className={`cursor-pointer px-2.5 py-1.5 rounded border text-xs transition-colors focus-within:border-neon-cyan ${
                      gates[g.id] ? 'border-neon-green/60 text-neon-green' : 'border-neon-red text-neon-red line-through'
                    }`}>
                      <input type="checkbox" className="sr-only" checked={gates[g.id]}
                        onChange={() => setGates((x) => ({ ...x, [g.id]: !x[g.id] }))} />
                      {g.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="submit" disabled={busy}
                className="w-full px-4 py-2 rounded bg-neon-green/10 border border-neon-green text-neon-green text-sm hover:bg-neon-green/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {busy ? 'working…' : '$ git push origin main'}
              </button>
            </form>

            <div ref={logRef} className="mt-4 h-72 overflow-y-auto border-t border-terminal-border pt-3 text-xs leading-relaxed">
              {log.length === 0 && <span className="text-terminal-muted">Pipeline output appears here.</span>}
              {log.map((line, i) => (
                <div key={i} className={`break-words ${
                  line.startsWith('$') ? 'text-neon-cyan' : line.startsWith('!') ? 'text-neon-red' : line.startsWith('~') ? 'text-neon-amber' : 'text-terminal-muted'
                }`}>
                  {/^[!~] /.test(line) ? line.slice(2) : line}
                </div>
              ))}
            </div>
          </Terminal>

          {/* Right: the app, the cluster, the metrics */}
          <div className="space-y-4">
            <div className="rounded-lg bg-dashboard-panel border border-dashboard-border overflow-hidden">
              <div className="px-4 py-2 border-b border-dashboard-border text-xs text-terminal-muted truncate">
                https://hello.apps.example.com
              </div>
              <div className="px-4 py-6 text-center">
                {ready === 0 ? (
                  <div className="text-2xl text-neon-red">503 Service Unavailable</div>
                ) : (
                  <div className="text-2xl md:text-3xl text-terminal-text break-words">
                    Hello, <span className="text-neon-green">{live.name}</span>!
                  </div>
                )}
                <div className="mt-2 text-xs text-terminal-muted">image hello:{live.sha}</div>
                {incident && incident !== 'down' && (
                  <div className="mt-2 text-xs text-neon-amber">
                    {incident === 'secret' ? 'This image contains a live AWS access key'
                      : incident === 'cve' ? 'Running with a known critical vulnerability'
                      : '1 request in 8 is failing'}
                  </div>
                )}
              </div>
            </div>

            <div role="status" className="min-h-5">
              {outcome && <p className={`text-sm ${toneCls[outcome.tone]}`}>{outcome.text}</p>}
              {incident && !busy && (
                <button type="button" onClick={rollback}
                  className="mt-2 px-3 py-1.5 rounded border border-neon-red text-neon-red text-xs hover:bg-neon-red/10 transition-colors">
                  {incident === 'secret' ? '$ rotate the key && git revert HEAD' : '$ git revert HEAD   # roll back'}
                </button>
              )}
            </div>

            <div className={panelCls}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs text-terminal-muted">deployment/hello · {ready} ready</span>
                <span className={`text-xs ${statuses[5] === 'running' ? 'text-neon-amber' : 'text-neon-green'}`}>
                  argocd: {statuses[5] === 'running' ? 'Progressing' : 'Synced · Healthy'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {NODES.map((node, n) => (
                  <div key={node.name} className={`rounded border p-2 min-h-28 ${cordoned === n ? 'border-neon-amber' : 'border-dashboard-border'}`}>
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="text-[11px] leading-tight min-w-0">
                        <div className="text-terminal-text truncate">{node.name}</div>
                        <div className="text-terminal-muted truncate">{cordoned === n ? 'cordoned' : node.zone}</div>
                      </div>
                      <button type="button" disabled={clusterLocked} onClick={() => drain(n)}
                        aria-label={`Drain node ${node.name}`}
                        className="text-[10px] px-1.5 py-0.5 rounded border border-dashboard-border text-terminal-muted hover:border-neon-amber hover:text-neon-amber disabled:opacity-40 disabled:cursor-not-allowed">
                        drain
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {pods.filter((p) => p.node === n).map((p) => (
                        <button key={p.id} type="button" onClick={() => kill(p)}
                          disabled={clusterLocked || p.state !== 'Running'}
                          aria-label={`Kill pod hello-${p.ver}-${p.id}, ${p.state}`} title="Click to kill this pod"
                          className={`w-full rounded border px-1 py-1 text-center enabled:hover:border-neon-red enabled:hover:text-neon-red disabled:cursor-default transition-colors ${podCls[p.state]}`}>
                          <div className="text-[11px] truncate">{p.ver}</div>
                          <div className="text-[10px] text-terminal-muted">{p.state}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <button type="button" className={smallBtn} disabled={clusterLocked} onClick={trafficSpike}>
                  Send a traffic spike
                </button>
                <span className="text-[11px] text-terminal-muted">or click a pod to kill it, or drain a node</span>
              </div>
              {events.length > 0 && (
                <div className="mt-3 pt-3 border-t border-dashboard-border text-[11px] leading-relaxed">
                  {events.map((line, i) => (
                    <div key={i} className={`break-words ${line.startsWith('$') ? 'text-neon-cyan' : 'text-terminal-muted'}`}>{line}</div>
                  ))}
                </div>
              )}
            </div>

            <div className={panelCls}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs text-terminal-muted">Prometheus · last 40s</span>
                <span className={`text-[11px] px-2 py-0.5 rounded border ${alert.cls}`}>{alert.text}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Spark label="req/s" floor={200} color="#06b6d4" data={hist.map((h) => h.rps)} value={now.rps.toFixed(0)} />
                <Spark label="errors" floor={5} color="#ef4444" data={hist.map((h) => h.err)} value={`${now.err.toFixed(1)}%`} />
                <Spark label="p95" floor={80} color="#f59e0b" data={hist.map((h) => h.p95)} value={`${now.p95.toFixed(0)}ms`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PipelineDemo;
