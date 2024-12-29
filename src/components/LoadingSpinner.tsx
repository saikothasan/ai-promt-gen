import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => (
  <div className="flex justify-center p-4">
    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
  </div>
);