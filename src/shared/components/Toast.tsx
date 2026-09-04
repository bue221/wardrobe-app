import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const surface = type === 'error' ? 'bg-ember text-obsidian' : 'bg-surface text-ink';

  return (
    <div
      className={`fixed left-1/2 z-50 max-w-xs -translate-x-1/2 rounded-card px-4 py-3 text-center font-dm-sans font-medium text-body-sm leading-body-sm ${surface}`}
      style={{ bottom: 'calc(6.5rem + env(safe-area-inset-bottom, 0px))' }}
      role="status"
    >
      {message}
    </div>
  );
}
