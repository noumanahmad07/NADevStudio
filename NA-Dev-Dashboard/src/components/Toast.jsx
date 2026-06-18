import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-in fade-in slide-in-from-bottom-2">
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${styles[toast.type] || styles.success}`}
      >
        {toast.type === 'error' ? (
          <AlertCircle size={16} />
        ) : toast.type === 'info' ? (
          <Info size={16} />
        ) : (
          <CheckCircle2 size={16} />
        )}
        {toast.message}
      </div>
    </div>
  );
}
