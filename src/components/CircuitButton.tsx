import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CircuitButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function CircuitButton({
  children,
  onClick,
  className,
  type = 'button',
  disabled = false,
}: CircuitButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'circuit-btn px-6 py-3 rounded-lg font-semibold tracking-wide text-secondary-foreground',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none',
        className
      )}
    >
      {children}
    </button>
  );
}
