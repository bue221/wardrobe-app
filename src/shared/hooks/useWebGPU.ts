import { useState, useEffect } from 'react';

export function useWebGPU() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      if (!navigator.gpu) {
        setSupported(false);
        return;
      }
      try {
        const adapter = await navigator.gpu.requestAdapter();
        setSupported(adapter !== null);
      } catch {
        setSupported(false);
      }
    };
    check();
  }, []);

  return supported;
}
