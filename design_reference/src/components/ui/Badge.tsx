type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'muted'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const styles: Record<BadgeVariant, string> = {
  default: 'bg-blue-50 text-blue-700 border border-blue-100',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border border-amber-100',
  error: 'bg-red-50 text-red-700 border border-red-100',
  info: 'bg-sky-50 text-sky-700 border border-sky-100',
  muted: 'bg-slate-100 text-slate-600 border border-slate-200',
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  )
}
