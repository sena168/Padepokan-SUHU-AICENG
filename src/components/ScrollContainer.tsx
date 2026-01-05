import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollContainerProps {
  children: ReactNode;
  className?: string;
}

export function ScrollContainer({ children, className }: ScrollContainerProps) {
  return (
    <div className={cn('scroll-container p-8 my-6', className)}>
      <div className="text-deep-purple">{children}</div>
    </div>
  );
}
