import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  body: string;
  children?: ReactNode;
}

export function EmptyState({ title, body, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card bg-surface p-6 text-center md:p-10">
      <h2 className="font-display text-subheading leading-subheading tracking-[0.02em] text-ink">
        {title}
      </h2>
      <p className="max-w-xs font-dm-sans font-medium text-body-sm leading-body-sm text-ink/80">
        {body}
      </p>
      {children}
    </div>
  );
}
