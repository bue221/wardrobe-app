import type { ReactNode } from 'react';

interface TagProps {
  children: ReactNode;
  className?: string;
}

export function Tag({ children, className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center bg-sulfur text-obsidian rounded-pill px-2.5 py-1 font-dm-sans font-medium text-caption leading-caption ${className}`}
    >
      {children}
    </span>
  );
}
