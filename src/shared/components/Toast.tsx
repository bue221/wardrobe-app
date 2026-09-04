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

  const surfaces = {
    error: 'bg-obsidian text-chalk',
    success: 'bg-ember text-obsidian',
    info: 'bg-limestone text-obsidian',
  };

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-[800px] font-body text-body-sm max-w-xs text-center ${surfaces[type]}`}
      style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}
      role="status"
    >
      {message}
    </div>
  );
}
