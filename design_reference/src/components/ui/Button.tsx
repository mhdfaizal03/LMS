import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:   'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm shadow-blue-200 disabled:shadow-none',
  secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300',
  outline:   'border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 bg-white',
  ghost:     'text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-200 disabled:shadow-none',
  success:   'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm shadow-emerald-200 disabled:shadow-none',
  warning:   'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700',
}

const sizes: Record<Size, string> = {
  xs: 'h-7  px-2.5 text-xs  gap-1   rounded-md',
  sm: 'h-8  px-3   text-xs  gap-1.5 rounded-lg',
  md: 'h-9  px-4   text-sm  gap-2   rounded-lg',
  lg: 'h-11 px-5   text-sm  gap-2.5 rounded-xl font-semibold',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, iconRight, children, className = '', disabled, fullWidth, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
      {children && <span>{children}</span>}
      {!loading && iconRight}
    </button>
  )
)

Button.displayName = 'Button'
export default Button
