import { useEffect, useRef, useState } from 'react';
import { SectionHeader, Reveal } from '@/components/Reveal';
import { useInView, reducedMotion } from '@/lib/motion';

const FACTS: [string, string][] = [
  ['Role', 'Site Reliability Engineer'],
  ['Based in', 'Hyderabad, India'],
  ['Experience', '10+ years in infrastructure'],
  ['Built', 'Datacenters in Dubai and Abu Dhabi'],
  ['Focus', 'Kubernetes, OpenShift, CI/CD, observability, AI for ops'],
  ['Certification', 'CCNA'],
];

const STATS = [
  { value: 10, suffix: '+', label: 'years in infrastructure' },
  { value: 99.9, suffix: '%', label: 'APAC infra uptime', decimals: 1 },
  { value: 70, suffix: '%', label: 'less manual deployment work' },
];

const CountUp = ({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, 0.6);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || reducedMotion()) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / 1600);
      setN(value * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  const shown = inView && reducedMotion() ? value : n;
  return <span ref={ref} className="tabular-nums">{shown.toFixed(decimals)}{suffix}</span>;
};

const hl = 'text-neon-green';

const About = () => (
  <section id="about" className="py-12 md:py-16 px-5">
    <div className="max-w-7xl mx-auto">
      <SectionHeader title="About me" />

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-start">
        <div>
          <Reveal>
            <p className="text-2xl sm:text-3xl leading-snug font-medium tracking-tight">
              I have spent <span className={hl}>10+ years</span> in infrastructure. I built{' '}
              <span className={hl}>datacenters from scratch in Dubai and Abu Dhabi</span>, led office setups in
              Hyderabad and the UK, and in 2022 moved into site reliability engineering.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <p className="mt-6 text-lg text-terminal-muted leading-relaxed">
              Today I run production <span className="text-terminal-text">Kubernetes and OpenShift</span>, automate
              delivery, design SLOs that mean something, and build AI tools for my team, like a{' '}
              <span className="text-terminal-text">Webex bot that proposes fixes</span> for the issues assigned to us
              and learns from its mistakes.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-dashboard-border rounded-2xl overflow-hidden border border-dashboard-border">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i} className="bg-dashboard-bg p-6">
                <div className="text-5xl font-semibold tracking-tight text-terminal-text">
                  <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <div className="mt-2 font-mono text-xs text-terminal-muted">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-dashboard-border bg-dashboard-panel overflow-hidden">
            <div className="relative aspect-square overflow-hidden">
              <img src="/portrait.jpg" alt="Satya Prakash Chelluri" loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-[50%_20%]" />
            </div>
            <dl className="px-5 py-4 divide-y divide-dashboard-border">
              {FACTS.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7rem_1fr] gap-3 py-2 text-sm">
                  <dt className="text-terminal-muted">{k}</dt>
                  <dd className="text-terminal-text">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default About;
