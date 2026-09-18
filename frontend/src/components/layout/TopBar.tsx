import { Bell, Search, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Crumb { label: string; to?: string }

interface TopBarProps {
  crumbs?: Crumb[]
  actions?: React.ReactNode
  onMenuClick?: () => void
}

const notifications = [
  { text: 'Alex Johnson submitted React State Management Analysis', time: '5m ago', unread: true },
  { text: 'New enrollment: Priya Sharma joined UX Design Mastery', time: '18m ago', unread: true },
  { text: 'Quiz "React Hooks" has a 91% average score', time: '2h ago', unread: false },
  { text: 'Course "Cloud Architecture" review requested', time: '4h ago', unread: false },
]

export default function TopBar({ crumbs = [], actions, onMenuClick }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const unread = notifications.filter(n => n.unread).length

  return (
    <header className="h-16 glass border-b-0 mx-4 mt-4 rounded-2xl flex items-center px-4 md:px-6 gap-4 sticky top-4 z-20 flex-shrink-0 premium-shadow">
      {/* Breadcrumbs */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {onMenuClick && (
          <button onClick={onMenuClick} className="md:hidden p-1.5 -ml-1.5 mr-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        )}
        <div className="flex items-center gap-1.5 overflow-hidden">
        {crumbs.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />}
            {c.to && i < crumbs.length - 1 ? (
              <Link to={c.to} className="text-sm text-slate-500 hover:text-slate-700 truncate transition-colors">{c.label}</Link>
            ) : (
              <span className="text-sm font-semibold text-slate-900 truncate">{c.label}</span>
            )}
          </div>
        ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <div className="hidden md:flex items-center h-8 gap-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:border-slate-300 transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            className="bg-transparent text-sm outline-none w-36 placeholder:text-slate-400 text-slate-700"
            placeholder="Quick search…"
          />
          <kbd className="hidden lg:inline-flex items-center text-xs text-slate-400 border border-slate-200 rounded px-1 font-mono">⌘K</kbd>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-all duration-300 hover:scale-105"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-rose-600 rounded-full ring-2 ring-white shadow-sm" />
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-3 w-80 glass rounded-2xl shadow-2xl border border-white py-2 z-20 overflow-hidden backdrop-blur-xl">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-semibold text-slate-900">Notifications</p>
                  <button className="text-xs text-blue-600 font-medium hover:text-blue-700">Mark all read</button>
                </div>
                {notifications.map((n, i) => (
                  <button key={i} className="w-full px-4 py-3 hover:bg-slate-50 flex gap-3 items-start text-left transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-blue-500' : 'bg-transparent'}`} />
                    <div>
                      <p className="text-xs text-slate-700 leading-snug">{n.text}</p>
                      <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 px-4 py-2">
                  <button className="text-xs text-blue-600 font-medium hover:text-blue-700">View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        {actions}
      </div>
    </header>
  )
}
