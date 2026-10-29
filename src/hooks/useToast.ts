import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook para gerenciar estado e exibição de notificações toast
 */
export function useToast(defaultDurationMs: number = 3500) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string, durationMs?: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToastMessage(msg);
    timeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      timeoutRef.current = null;
    }, durationMs ?? defaultDurationMs);
  }, [defaultDurationMs]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    toastMessage,
    showToast
  };
}
