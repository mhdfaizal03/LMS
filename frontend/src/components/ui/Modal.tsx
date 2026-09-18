import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <div className={`relative bg-white rounded-3xl premium-shadow w-full ${sizes[size]} flex flex-col max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-display font-bold text-slate-900 tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
