import type { ReactNode } from 'react';
import { Check, Loader2, Circle } from 'lucide-react';

interface PipelineStageProps {
  title: string;
  subtitle: string;
  status: 'completed' | 'running' | 'pending';
  children?: ReactNode;
  isLast?: boolean;
}

const statusConfig = {
  completed: {
    icon: Check,
    bg: 'bg-neon-green/20',
    border: 'border-neon-green',
    text: 'text-neon-green',
    dot: 'bg-neon-green',
  },
  running: {
    icon: Loader2,
    bg: 'bg-neon-cyan/20',
    border: 'border-neon-cyan',
    text: 'text-neon-cyan',
    dot: 'bg-neon-cyan',
  },
  pending: {
    icon: Circle,
    bg: 'bg-dashboard-border',
    border: 'border-dashboard-border',
    text: 'text-terminal-muted',
    dot: 'bg-terminal-muted',
  },
};

const PipelineStage = ({
  title,
  subtitle,
  status,
  children,
  isLast = false,
}: PipelineStageProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="relative">
      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-6 top-12 w-px h-[calc(100%-3rem)] bg-dashboard-border">
          {status === 'completed' && (
            <div className="w-full h-full bg-neon-green/50" />
          )}
          {status === 'running' && (
            <div className="w-full bg-neon-cyan/50 animate-pulse" style={{ height: '50%' }} />
          )}
        </div>
      )}

      <div className="flex gap-4">
        {/* Stage Indicator */}
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${config.bg} ${config.border}`}>
            <Icon className={`w-5 h-5 ${config.text} ${status === 'running' ? 'animate-spin' : ''}`} />
          </div>
        </div>

        {/* Stage Content */}
        <div className="flex-1 pb-8">
          <div className={`p-4 rounded-lg border bg-dashboard-panel ${config.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${config.dot} ${status === 'running' ? 'animate-pulse' : ''}`} />
              <span className={`text-xs font-mono uppercase ${config.text}`}>
                {status === 'completed' ? 'Completed' : status === 'running' ? 'In Progress' : 'Pending'}
              </span>
            </div>
            <h3 className="font-mono text-lg font-semibold text-terminal-text mb-1">
              {title}
            </h3>
            <p className="text-sm text-terminal-muted font-mono mb-3">
              {subtitle}
            </p>
            {children && (
              <div className="mt-3 pt-3 border-t border-dashboard-border">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineStage;
