export function Mark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M2 28 16 6l14 22H2Z" fill="#fc5000" />
      <path d="M11 28 16 16l5 12H11Z" fill="#f7f6f2" />
    </svg>
  );
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Mark />
      <span className="font-display text-subheading leading-subheading tracking-[0.02em] text-ink">
        WARDROBE
      </span>
    </span>
  );
}
