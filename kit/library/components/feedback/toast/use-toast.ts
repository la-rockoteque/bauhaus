import { useCallback, useRef, useState } from 'react';
import type { ToastData } from './toast';

/** The toast list for a `ToastRegion`. `show` returns the id, so the caller can close it early. */
export function useToast() {
  const [toasts, setToasts] = useState<readonly ToastData[]>([]);
  const count = useRef(0);
  const show = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${++count.current}`;
    setToasts((list) => [...list, { ...toast, id }]);
    return id;
  }, []);
  const dismiss = useCallback((id: string) => setToasts((list) => list.filter((toast) => toast.id !== id)), []);
  return { toasts, show, dismiss };
}
