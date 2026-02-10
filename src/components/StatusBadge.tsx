import type { ReactNode } from 'react';

interface StatusBadgeProps {
  status: 'online' | 'busy' | 'offline' | 'healthy' | 'warning' | 'error';
  children: ReactNode;
  className?: string;
  pulse?: boolean;
}

const statusConfig = {
  online: { dot: 'bg-neon-green', glow: 'animate-pulse-glow' },
  healthy: { dot: 'bg-neon-green', glow: 'animate-pulse-glow' },
  busy: { dot: 'bg-neon-amber', glow: '' },
  warning: { dot: 'bg-neon-amber', glow: '' },
  offline: { dot: 'bg-neon-red', glow: '' },
  error: { dot: 'bg-neon-red', glow: '' },
};

const StatusBadge = ({ 
  status, 
  children, 
  className = '',
  pulse = true 
}: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-dashboard-panel border border-dashboard-border text-xs font-mono ${className}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} ${pulse ? config.glow : ''}`} />
      {children}
    </span>
  );
};

export default StatusBadge;
