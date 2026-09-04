import type { ReactNode } from 'react';

interface HalftoneBlockProps {
  className?: string;
  children?: ReactNode;
}

export function HalftoneBlock({ className = '', children }: HalftoneBlockProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-card bg-linear-to-br from-plasma-violet to-ember ${className}`}
    >
      <div className="halftone-dots pointer-events-none absolute inset-0" aria-hidden />
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  );
}
