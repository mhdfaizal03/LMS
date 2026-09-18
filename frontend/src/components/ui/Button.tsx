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
  primary:   'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 shadow-md shadow-indigo-500/20 disabled:shadow-none hover:shadow-indigo-500/40',
  secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300',
  outline:   'border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 bg-white shadow-sm',
  ghost:     'text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200',
  danger:    'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-md shadow-red-500/20 disabled:shadow-none',
  success:   'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-md shadow-emerald-500/20 disabled:shadow-none',
  warning:   'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-md shadow-amber-500/20 disabled:shadow-none',
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
        'inline-flex items-center justify-center font-bold tracking-wide transition-all duration-300 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
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
