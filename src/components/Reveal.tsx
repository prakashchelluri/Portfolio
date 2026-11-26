import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useInView } from '@/lib/motion';

type Props = { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'p' | 'span' };

/** Fades in its children when scrolled into view. */
export const Reveal = ({ children, delay = 0, className = '', as: Tag = 'div' }: Props) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.15);
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={{ '--d': delay } as CSSProperties}
    >
      {children}
    </Tag>
  );
};

/** Section heading with an optional intro line. */
export const SectionHeader = ({ title, intro }: { title: string; intro?: ReactNode }) => (
  <Reveal className="mb-8 md:mb-10">
    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-terminal-text">{title}</h2>
    {intro && <p className="mt-3 max-w-2xl text-terminal-muted text-base md:text-lg">{intro}</p>}
  </Reveal>
);
