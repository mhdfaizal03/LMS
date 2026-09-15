import { useState, useEffect } from 'react'
import { Bell, Search, Menu, CheckCheck, Loader2 } from 'lucide-react'
import { notificationApi } from '../../api'
import { NotificationItem } from '../../types'

interface TopBarProps {
  title: string
  onMenuToggle?: () => void
}

export default function TopBar({ title, onMenuToggle }: TopBarProps) {
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const list = await notificationApi.getNotifications()
      setNotifications(list || [])
    } catch (err) {
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.is_read).length

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (err) {
      console.error('Mark all read error:', err)
    }
  }

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 flex-shrink-0 shadow-xs">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-sm font-bold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-30 animate-in fade-in">
              <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {loading ? (
                  <div className="p-4 text-center">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin mx-auto" />
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 flex gap-2.5 items-start text-left transition-colors ${
                        n.is_read ? 'bg-white opacity-70' : 'bg-blue-50/40'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          n.is_read ? 'bg-slate-300' : 'bg-blue-600'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
