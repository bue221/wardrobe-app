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

  const colors = {
    error: 'bg-red-600',
    success: 'bg-emerald-600',
    info: 'bg-slate-700',
  };

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl text-white text-sm shadow-xl max-w-xs text-center ${colors[type]}`}
      style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {message}
    </div>
  );
}
