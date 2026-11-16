import { useState } from 'react';

export function useQrScanner() {
  const [value, setValue] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(true);

  function onScanned(data: string) {
    if (!enabled) return;
    setEnabled(false);
    setValue(data);
  }

  function reset() {
    setValue(null);
    setEnabled(true);
  }

  return {
    value,
    enabled,
    onScanned,
    reset,
  };
}
