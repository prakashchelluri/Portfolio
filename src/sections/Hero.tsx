import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowDownRight, Github, Linkedin } from 'lucide-react';
import { reducedMotion } from '@/lib/motion';

// Background: drifting nodes that link to their neighbours, with packets hopping between them.

const LABELS = ['kubernetes', 'openshift', 'prometheus', 'grafana', 'gitlab ci', 'jenkins', 'ansible', 'terraform',
  'kafka', 'postgresql', 'azure', 'aws', 'openstack', 'elk', 'docker', 'victoriametrics'];
const LIME = '180,240,74';
const SKY = '92,200,255';

type Node = { x: number; y: number; vx: number; vy: number; r: number; label?: string; glow: number };
type Packet = { from: number; to: number; t: number; speed: number; color: string };

const ClusterCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const still = reducedMotion();
    let w = 0, h = 0, maxDist = 200, raf = 0, last = 0, spawnAt = 0, visible = true;
    let nodes: Node[] = [];
    let edges: [number, number][] = [];
    let neighbors: number[][] = [];
    const packets: Packet[] = [];
    const mouse = { x: -9999, y: -9999 };

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      maxDist = Math.min(220, Math.max(130, w / 6));
      const count = Math.round(Math.min(70, Math.max(26, (w * h) / 20000)));
      const labels = LABELS.slice(0, w < 640 ? 7 : LABELS.length);
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: i < labels.length ? 3 : 1.2 + Math.random() * 1.6,
        label: labels[i],
        glow: 0,
      }));
      packets.length = 0;
    };

    const link = () => {
      // O(n²) neighbour search; cheap at this node count.
      const seen = new Set<number>();
      edges = [];
      neighbors = nodes.map(() => []);
      nodes.forEach((a, i) => {
        nodes
          .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
          .filter((o) => o.j !== i && o.d < maxDist)
          .sort((p, q) => p.d - q.d)
          .slice(0, 3)
          .forEach(({ j }) => {
            const key = Math.min(i, j) * 1000 + Math.max(i, j);
            if (seen.has(key)) return;
            seen.add(key);
            edges.push([i, j]);
            neighbors[i].push(j);
            neighbors[j].push(i);
          });
      });
    };

    const send = (from: number, to: number, color = Math.random() < 0.7 ? LIME : SKY) =>
      packets.push({ from, to, t: 0, speed: 0.0007 + Math.random() * 0.0009, color });

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (!still) {
          const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 120 && d > 0) { n.vx += (dx / d) * 0.004; n.vy += (dy / d) * 0.004; } // gentle push from the cursor
          n.vx *= 0.995; n.vy *= 0.995;
          const sp = Math.hypot(n.vx, n.vy);
          if (sp < 0.05) { n.vx += (Math.random() - 0.5) * 0.02; n.vy += (Math.random() - 0.5) * 0.02; }
          n.x += n.vx * dt * 0.06; n.y += n.vy * dt * 0.06;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          n.x = Math.max(0, Math.min(w, n.x)); n.y = Math.max(0, Math.min(h, n.y));
        }
        const near = Math.hypot(n.x - mouse.x, n.y - mouse.y) < 170;
        n.glow += ((near ? 1 : 0) - n.glow) * 0.08;
      }
      link();

      ctx.lineWidth = 1;
      for (const [i, j] of edges) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const g = Math.max(a.glow, b.glow);
        ctx.strokeStyle = `rgba(${g > 0.05 ? LIME : '138,148,163'},${(1 - d / maxDist) * (0.18 + g * 0.5)})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }

      // The cursor probes nearby nodes
      for (const n of nodes) {
        if (n.glow < 0.05) continue;
        ctx.strokeStyle = `rgba(${SKY},${n.glow * 0.35})`;
        ctx.setLineDash([2, 4]);
        ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(n.x, n.y); ctx.stroke();
        ctx.setLineDash([]);
      }

      if (!still) {
        if (performance.now() > spawnAt && packets.length < 45 && edges.length) {
          const [i, j] = edges[(Math.random() * edges.length) | 0];
          send(i, j);
          spawnAt = performance.now() + 90;
        }
        for (let k = packets.length - 1; k >= 0; k--) {
          const p = packets[k];
          p.t += p.speed * dt;
          if (p.t >= 1) {
            const next = neighbors[p.to]?.filter((n) => n !== p.from) ?? [];
            if (next.length && Math.random() < 0.6) packets.push({ ...p, from: p.to, to: next[(Math.random() * next.length) | 0], t: 0 });
            packets.splice(k, 1);
            continue;
          }
          const a = nodes[p.from], b = nodes[p.to];
          if (!a || !b) { packets.splice(k, 1); continue; }
          const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
          ctx.fillStyle = `rgba(${p.color},0.18)`;
          ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgb(${p.color})`;
          ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
        }
      }

      ctx.font = '11px "JetBrains Mono", monospace';
      for (const n of nodes) {
        ctx.fillStyle = n.glow > 0.05 ? `rgba(${LIME},${0.5 + n.glow * 0.5})` : 'rgba(138,148,163,0.55)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + n.glow * 1.5, 0, Math.PI * 2); ctx.fill();
        if (n.label) {
          ctx.strokeStyle = `rgba(${LIME},${0.25 + n.glow * 0.5})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = n.glow > 0.05 ? `rgba(230,235,241,${0.5 + n.glow * 0.5})` : 'rgba(138,148,163,0.6)';
          ctx.fillText(n.label, n.x + 10, n.y + 4);
        }
      }
    };

    const loop = (t: number) => {
      const dt = Math.min(48, t - (last || t));
      last = t;
      draw(dt);
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const start = () => { if (!raf && !still) { last = 0; raf = requestAnimationFrame(loop); } };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      if (still) draw(0);
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    const onClick = (e: PointerEvent) => {
      onMove(e);
      let best = 0, bd = Infinity;
      nodes.forEach((n, i) => { const d = Math.hypot(n.x - mouse.x, n.y - mouse.y); if (d < bd) { bd = d; best = i; } });
      for (let k = 0; k < 3; k++) neighbors[best]?.forEach((j) => send(best, j, LIME));
    };

    setup(); link(); draw(16);
    const host = canvas.parentElement!;
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointerdown', onClick);
    const ro = new ResizeObserver(() => { setup(); link(); draw(16); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(canvas);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onClick);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden />;
};

const WORDS = ['boring.', 'observable.', 'automated.', 'self-healing.'];

const RotatingWord = () => {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const t = setInterval(() => setCur((c) => (c + 1) % WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-grid overflow-hidden [clip-path:inset(0)] align-bottom pb-[0.08em]" aria-hidden>
      {WORDS.map((w, i) => {
        const pos = (i - cur + WORDS.length) % WORDS.length; // 0 = showing, last = leaving
        const moving = pos === 0 || pos === WORDS.length - 1;
        return (
          <span key={w} className="col-start-1 row-start-1 text-neon-green"
            style={{
              transform: pos === 0 ? 'none' : pos === WORDS.length - 1 ? 'translateY(-105%)' : 'translateY(105%)',
              opacity: pos === 0 ? 1 : 0,
              transition: moving ? 'transform .9s var(--ease-out), opacity .9s var(--ease-out)' : 'none',
            }}>
            {w}
          </span>
        );
      })}
    </span>
  );
};

const Hero = () => {
  const line = (i: number) => ({ animation: `rise-in 1.2s var(--ease-out) ${0.15 + i * 0.12}s both` }) as CSSProperties;
  const fade = (i: number) => ({ animation: `fade-up 1s var(--ease-out) ${0.6 + i * 0.1}s both` }) as CSSProperties;

  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col overflow-hidden select-none">
      <ClusterCanvas />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_25%_55%,#05070a_10%,rgba(5,7,10,0.7)_45%,transparent_80%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-dashboard-bg to-transparent" />

      <div className="relative flex-1 flex items-center pointer-events-none">
        <div className="max-w-7xl w-full mx-auto px-5 pt-28 pb-16">
          <p className="text-lg sm:text-xl text-terminal-text mb-6" style={fade(0)}>
            Satya Prakash Chelluri<span className="text-terminal-muted">, Site Reliability Engineer in Hyderabad</span>
          </p>

          <h1 className="text-[11.5vw] sm:text-7xl lg:text-[7.5rem] font-semibold tracking-tighter leading-[0.95] text-terminal-text">
            <span className="sr-only">I keep production boring, observable, automated and self-healing.</span>
            <span className="word-mask" aria-hidden><span style={line(0)}>I keep</span></span>
            <br aria-hidden />
            <span className="word-mask" aria-hidden><span style={line(1)}>production</span></span>
            <br aria-hidden />
            <span className="word-mask" aria-hidden><span style={line(2)}><RotatingWord /></span></span>
          </h1>

          <p className="mt-8 max-w-xl text-base sm:text-lg text-terminal-muted" style={fade(1)}>
            10+ years in infrastructure, from building datacenters in Dubai and Abu Dhabi to running Kubernetes and
            OpenShift today. I automate delivery and build AI tools that help my team fix issues faster.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 pointer-events-auto" style={fade(2)}>
            <a href="#projects"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-neon-green text-dashboard-bg font-medium hover:shadow-[0_0_32px_rgba(180,240,74,0.45)] transition-shadow">
              See what I have built
              <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
            <a href="https://github.com/prakashchelluri" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-dashboard-border bg-dashboard-bg/60 backdrop-blur text-terminal-text hover:border-terminal-muted transition-colors">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/prakashchelluri" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-dashboard-border bg-dashboard-bg/60 backdrop-blur text-terminal-text hover:border-terminal-muted transition-colors">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
