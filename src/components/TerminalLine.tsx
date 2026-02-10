import { useState, useEffect } from 'react';

interface TerminalLineProps {
  text: string;
  delay?: number;
  typingSpeed?: number;
  showPrompt?: boolean;
  promptText?: string;
  className?: string;
  onComplete?: () => void;
  highlight?: boolean;
}

const TerminalLine = ({
  text,
  delay = 0,
  typingSpeed = 30,
  showPrompt = true,
  promptText = '$',
  className = '',
  onComplete,
  highlight = false,
}: TerminalLineProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (displayText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, typingSpeed + Math.random() * 20);

      return () => clearTimeout(timeout);
    } else {
      setShowCursor(false);
      onComplete?.();
    }
  }, [displayText, isTyping, text, typingSpeed, onComplete]);

  return (
    <div className={`font-mono text-sm ${className}`}>
      {showPrompt && (
        <span className="text-neon-green mr-2">{promptText}</span>
      )}
      <span className={highlight ? 'text-neon-cyan' : 'text-terminal-text'}>
        {displayText}
      </span>
      {showCursor && isTyping && (
        <span className="text-neon-green animate-cursor-blink">▋</span>
      )}
    </div>
  );
};

export default TerminalLine;
