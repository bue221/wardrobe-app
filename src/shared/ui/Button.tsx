import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-ember text-obsidian rounded-pill py-3 px-6 min-h-11 font-dm-sans font-medium text-base transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98]',
  secondary:
    'bg-transparent border-[1.5px] border-solid border-ink text-ink rounded-card p-4 min-h-11 min-w-11 font-dm-sans font-medium text-base transition-colors duration-200 hover:bg-surface active:scale-[0.98]',
  ghost:
    'bg-transparent text-ink rounded-pill px-3 py-2 min-h-11 min-w-11 font-dm-sans font-medium text-base transition-colors duration-200 hover:text-ember',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`${VARIANT[variant]} disabled:opacity-40 ${className}`}
      {...props}
    />
  );
}
