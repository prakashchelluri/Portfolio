import type { ReactNode } from 'react';
import { X, Minus, Square } from 'lucide-react';

interface TerminalProps {
  children: ReactNode;
  title?: string;
  className?: string;
  showControls?: boolean;
}

const Terminal = ({ 
  children, 
  title = 'terminal', 
  className = '',
  showControls = true 
}: TerminalProps) => {
  return (
    <div className={`bg-terminal-bg border border-terminal-border rounded-lg overflow-hidden shadow-2xl ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-terminal-border">
        <div className="flex items-center gap-2">
          {showControls && (
            <>
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </>
          )}
        </div>
        <span className="text-terminal-muted text-xs font-mono">{title}</span>
        <div className="flex items-center gap-2 text-terminal-muted">
          <Minus className="w-4 h-4 hover:text-terminal-text cursor-pointer" />
          <Square className="w-3 h-3 hover:text-terminal-text cursor-pointer" />
          <X className="w-4 h-4 hover:text-terminal-text cursor-pointer" />
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm text-terminal-text">
        {children}
      </div>
    </div>
  );
};

export default Terminal;
