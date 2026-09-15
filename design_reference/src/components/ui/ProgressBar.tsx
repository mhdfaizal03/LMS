interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  color?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export default function ProgressBar({ value, max = 100, className = '', color = 'bg-blue-600', showLabel, size = 'sm' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const heights = { sm: 'h-1.5', md: 'h-2.5' }
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 ${heights[size]} bg-slate-100 rounded-full overflow-hidden`}>
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="text-xs text-slate-500 tabular-nums w-8 text-right">{Math.round(pct)}%</span>}
    </div>
  )
}
