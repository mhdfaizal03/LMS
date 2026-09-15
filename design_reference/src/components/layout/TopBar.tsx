import { Bell, Search, Menu } from 'lucide-react'
import { useState } from 'react'

interface TopBarProps {
  title: string
  onMenuToggle?: () => void
}

export default function TopBar({ title, onMenuToggle }: TopBarProps) {
  const [showNotifs, setShowNotifs] = useState(false)

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 flex-shrink-0">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button onClick={onMenuToggle} className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100">
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center h-8 bg-slate-50 border border-slate-200 rounded-lg px-3 gap-2 text-slate-400">
          <Search className="w-3.5 h-3.5" />
          <input className="bg-transparent text-sm outline-none w-40 placeholder:text-slate-400 text-slate-700" placeholder="Search..." />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-30">
              <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Notifications</p>
              {[
                { text: 'New student enrolled in React Fundamentals', time: '2m ago', type: 'enroll' },
                { text: 'Assignment "UI Design Project" has 3 pending submissions', time: '1h ago', type: 'assign' },
                { text: 'Course "Advanced CSS" was published successfully', time: '3h ago', type: 'publish' },
              ].map((n, i) => (
                <button key={i} className="w-full px-4 py-3 hover:bg-slate-50 flex gap-3 items-start text-left">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-700">{n.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
