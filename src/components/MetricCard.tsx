import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  maxValue?: number;
  unit?: string;
  status: 'healthy' | 'warning' | 'critical';
  icon: LucideIcon;
  description?: string;
  delay?: number;
}

const statusColors = {
  healthy: 'text-neon-green border-neon-green/30',
  warning: 'text-neon-amber border-neon-amber/30',
  critical: 'text-neon-red border-neon-red/30',
};

const statusBg = {
  healthy: 'bg-neon-green/10',
  warning: 'bg-neon-amber/10',
  critical: 'bg-neon-red/10',
};

const statusDots = {
  healthy: 'bg-neon-green animate-pulse-glow',
  warning: 'bg-neon-amber',
  critical: 'bg-neon-red',
};

const MetricCard = ({
  title,
  value,
  maxValue = 100,
  unit = '%',
  status,
  icon: Icon,
  description,
  delay = 0,
}: MetricCardProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setAnimatedValue(value);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  const percentage = (animatedValue / maxValue) * 100;

  return (
    <div
      ref={cardRef}
      className={`p-4 rounded-lg border bg-dashboard-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${statusColors[status]}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-md ${statusBg[status]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-mono text-sm text-terminal-text">{title}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${statusDots[status]}`} />
      </div>

      {/* Value */}
      <div className="mb-3">
        <span className="text-2xl font-mono font-bold">
          {animatedValue}{unit}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-dashboard-border rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-1500 ease-out ${
            status === 'healthy' ? 'bg-neon-green' :
            status === 'warning' ? 'bg-neon-amber' : 'bg-neon-red'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-terminal-muted font-mono">{description}</p>
      )}
    </div>
  );
};

export default MetricCard;
