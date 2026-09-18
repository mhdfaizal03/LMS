import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  accent?: string
  accentText?: string
  accentBg?: string
  footer?: React.ReactNode
}

export default function StatCard({
  title, value, change, changeLabel = 'vs last month',
  icon, accent = '#2563EB', accentText = 'text-blue-600', accentBg = 'bg-blue-50',
  footer,
}: StatCardProps) {
  const positive = change === undefined || change >= 0

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 premium-shadow hover:premium-shadow-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 leading-none">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl ${accentBg} ${accentText} flex items-center justify-center flex-shrink-0 shadow-inner`}>
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {change !== undefined ? (
          <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
            <span className={`flex items-center justify-center w-4 h-4 rounded ${positive ? 'bg-emerald-50' : 'bg-red-50'}`}>
              {positive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
            </span>
            {positive ? '+' : ''}{change}%
            <span className="text-slate-400 font-normal">{changeLabel}</span>
          </div>
        ) : <div />}
        {footer}
      </div>
    </div>
  )
}
