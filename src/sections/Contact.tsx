import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeader, Reveal } from '@/components/Reveal';


const EMAIL = 'prakashchelluri@gmail.com';
const GITHUB = 'https://github.com/prakashchelluri';
const LINKS = [
  { label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
  { label: 'LinkedIn', value: 'in/prakashchelluri', href: 'https://www.linkedin.com/in/prakashchelluri' },
];

const a = (href: string, text: string) => (
  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
    className="text-neon-cyan underline underline-offset-4 hover:text-neon-green">{text}</a>
);

const COMMANDS: Record<string, () => ReactNode> = {
  help: () => 'commands: whoami  contact  email  linkedin  github  stack  status  clear',
  whoami: () => 'Satya Prakash Chelluri · Site Reliability Engineer · Hyderabad, India',
  contact: () => <>email {a(`mailto:${EMAIL}`, EMAIL)} · linkedin {a(LINKS[1].href, LINKS[1].value)} · github {a(GITHUB, 'prakashchelluri')}</>,
  email: () => <>{a(`mailto:${EMAIL}`, EMAIL)}</>,
  linkedin: () => <>{a(LINKS[1].href, 'linkedin.com/in/prakashchelluri')}</>,
  github: () => <>{a(GITHUB, 'github.com/prakashchelluri')}</>,
  stack: () => 'kubernetes openshift docker jenkins gitlab-ci ansible terraform prometheus grafana elk azure aws openstack python bash',
  status: () => <span className="text-neon-green">● available for opportunities</span>,
  ls: () => 'about/  journey/  work/  demo/  stack/  contact/',
  exit: () => 'There is no exit from on-call. Try "contact".',
};

type Line = { cmd: string; out: ReactNode };

const Contact = () => {
  const [lines, setLines] = useState<Line[]>([{ cmd: 'help', out: COMMANDS.help() }]);
  const [input, setInput] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: 'smooth' }); }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!cmd) return;
    if (cmd === 'clear') { setLines([]); return; }
    const fn = COMMANDS[cmd];
    setLines((l) => [...l.slice(-30), { cmd, out: fn ? fn() : <span className="text-neon-red">command not found: {cmd}. Try "help".</span> }]);
  };

  const submit = (e: FormEvent) => { e.preventDefault(); run(input); setInput(''); };

  return (
    <section id="contact" className="py-12 md:py-16 px-5">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Get in touch" />

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <Reveal>
            <div className="rounded-2xl border border-dashboard-border bg-terminal-bg overflow-hidden shadow-[0_0_80px_-20px_rgba(180,240,74,0.25)]"
              onClick={() => inputRef.current?.focus()}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-dashboard-border">
                <span className="w-3 h-3 rounded-full bg-neon-red/80" />
                <span className="w-3 h-3 rounded-full bg-neon-amber/80" />
                <span className="w-3 h-3 rounded-full bg-neon-green/80" />
                <span className="ml-3 font-mono text-xs text-terminal-muted">visitor@on-call:~</span>
              </div>
              <div ref={box} className="h-72 overflow-y-auto p-4 font-mono text-sm space-y-3" aria-live="polite">
                {lines.map((l, i) => (
                  <div key={i} style={{ animation: 'fade-up .3s var(--ease-out) both' }}>
                    <div><span className="text-neon-green">$</span> {l.cmd}</div>
                    <div className="text-terminal-muted break-words">{l.out}</div>
                  </div>
                ))}
                <form onSubmit={submit} className="flex items-center gap-2">
                  <label htmlFor="shell" className="text-neon-green">$</label>
                  <input id="shell" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-terminal-text caret-neon-green" autoComplete="off"
                    spellCheck={false} placeholder="type a command, e.g. contact" aria-label="Shell command" />
                </form>
              </div>
              <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-dashboard-border">
                {['whoami', 'contact', 'status'].map((c) => (
                  <button key={c} type="button" onClick={(e) => { e.stopPropagation(); run(c); }}
                    className="font-mono text-xs px-2.5 py-1 rounded-full border border-dashboard-border text-terminal-muted hover:border-neon-green hover:text-neon-green transition-colors">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <ul className="divide-y divide-dashboard-border border-y border-dashboard-border">
            {LINKS.map((l, i) => (
              <Reveal as="li" key={l.label} delay={i + 1}>
                <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-7">
                  <div className="min-w-0">
                    <div className="font-mono text-xs text-terminal-muted mb-1">{l.label}</div>
                    <div className="text-xl sm:text-3xl font-medium tracking-tight break-all group-hover:text-neon-green transition-colors">{l.value}</div>
                  </div>
                  <span className="shrink-0 grid place-items-center w-12 h-12 rounded-full border border-dashboard-border group-hover:bg-neon-green group-hover:border-neon-green transition-all duration-500">
                    <ArrowUpRight className="w-5 h-5 group-hover:text-dashboard-bg transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </a>
              </Reveal>
            ))}
            <Reveal as="li" delay={4}>
              <p className="py-7 font-mono text-sm text-terminal-muted">
                Based in Hyderabad, India · open to new opportunities
                <span className="mx-2">·</span>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-neon-green">GitHub</a>
              </p>
            </Reveal>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Contact;
