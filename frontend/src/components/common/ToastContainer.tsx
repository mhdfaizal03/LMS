import React from 'react';
import { useNotification, ToastType } from '../../context/NotificationContext';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={20} color="#10b981" />,
  error: <AlertCircle size={20} color="#ef4444" />,
  warning: <AlertTriangle size={20} color="#f59e0b" />,
  info: <Info size={20} color="#3b82f6" />,
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '400px',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            pointerEvents: 'auto',
            animation: 'modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div>{iconMap[toast.type]}</div>
          <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              padding: '4px',
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
