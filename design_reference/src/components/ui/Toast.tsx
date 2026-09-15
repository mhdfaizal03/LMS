import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useState, useEffect } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  onClose?: () => void
  duration?: number
}

const config = {
  success: { icon: CheckCircle, bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon_color: 'text-emerald-500' },
  error: { icon: XCircle, bg: 'bg-red-50 border-red-200', text: 'text-red-800', icon_color: 'text-red-500' },
  warning: { icon: AlertCircle, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon_color: 'text-amber-500' },
  info: { icon: Info, bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon_color: 'text-blue-500' },
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true)
  const { icon: Icon, bg, text, icon_color } = config[type]

  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); setTimeout(() => onClose?.(), 300) }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-md transition-all duration-300 ${bg} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${icon_color}`} />
      <p className={`text-sm font-medium flex-1 ${text}`}>{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(() => onClose?.(), 300) }} className={`${text} opacity-60 hover:opacity-100`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
