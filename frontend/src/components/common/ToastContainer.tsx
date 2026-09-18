import React from 'react'
import { useNotification, ToastType } from '../../context/NotificationContext'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
  info: <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" />,
}

const borderMap: Record<ToastType, string> = {
  success: 'border-l-emerald-500 dark:border-l-emerald-400',
  error: 'border-l-rose-500 dark:border-l-rose-400',
  warning: 'border-l-amber-500 dark:border-l-amber-400',
  info: 'border-l-indigo-500 dark:border-l-indigo-400',
}

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotification()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 border-l-4 shadow-xl shadow-slate-900/10 pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-2 ${borderMap[toast.type]}`}
        >
          <div className="mt-0.5">{iconMap[toast.type]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
