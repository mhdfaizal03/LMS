type Variant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'muted' | 'violet'

interface BadgeProps {
  children: React.ReactNode
  variant?: Variant
  dot?: boolean
  className?: string
}

const map: Record<Variant, string> = {
  default: 'bg-blue-50  text-blue-700  border-blue-100',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50  text-amber-700  border-amber-100',
  error:   'bg-red-50    text-red-700    border-red-100',
  info:    'bg-sky-50    text-sky-700    border-sky-100',
  muted:   'bg-slate-100 text-slate-600  border-slate-200',
  violet:  'bg-violet-50 text-violet-700 border-violet-100',
}

const dots: Record<Variant, string> = {
  default: 'bg-blue-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error:   'bg-red-500',
  info:    'bg-sky-500',
  muted:   'bg-slate-400',
  violet:  'bg-violet-500',
}

export default function Badge({ children, variant = 'default', dot, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border ${map[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dots[variant]}`} />}
      {children}
    </span>
  )
}
