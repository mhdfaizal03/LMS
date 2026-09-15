import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  iconColor?: string
  iconBg?: string
}

export default function StatCard({ title, value, change, icon, iconColor = 'text-blue-600', iconBg = 'bg-blue-50' }: StatCardProps) {
  const positive = change !== undefined && change >= 0
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <p className="text-2xl font-display font-700 text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {positive ? '+' : ''}{change}% from last month
        </div>
      )}
    </div>
  )
}
