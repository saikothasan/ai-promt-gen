import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Toast as ToastType } from '../types';

export const Toast = ({ message, type, id }: ToastType) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      } ${type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
      role="alert"
    >
      <div className="flex items-center gap-2">
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <XCircle className="w-5 h-5" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
};