/** Mountain mark — Caldera-style monochrome lockup */
export function LogoMark({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 24L12.5 10l4.2 7.2L20.5 12 28 24H4z"
        fill="currentColor"
      />
      <path
        d="M16.5 17.2L20.5 12l3.2 5.2H16.5z"
        fill="var(--color-ember)"
      />
    </svg>
  );
}

export function LogoWordmark({
  className = '',
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <LogoMark />
      <span className="font-display text-[26px] leading-none tracking-[0.02em]">
        WARDROBE
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-2 text-obsidian ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 text-obsidian ${className}`}>
      {content}
    </div>
  );
}
