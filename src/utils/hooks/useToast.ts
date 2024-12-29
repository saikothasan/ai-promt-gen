import { useState, useCallback } from 'react';
import { Toast } from '../../types';

export const useToast = () => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type, id: crypto.randomUUID() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast };
};