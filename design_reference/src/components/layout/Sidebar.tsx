import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LogOut, GraduationCap } from 'lucide-react'
import { useState } from 'react'

export interface NavItem {
  icon: React.ReactNode
  label: string
  to: string
  badge?: number
  end?: boolean
}

interface NavGroup {
  heading?: string
  items: NavItem[]
}

interface SidebarProps {
  groups: NavGroup[]
  role: 'admin' | 'instructor' | 'student'
  userName: string
  userRole: string
  avatarBg?: string
}

export default function Sidebar({ groups, role, userName, userRole, avatarBg = 'bg-blue-600' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const initials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-200 select-none`}
      style={{
        width: collapsed ? 60 : 228,
        background: 'var(--color-sidebar)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-14 border-b flex-shrink-0 ${collapsed ? 'justify-center px-3' : 'px-4 gap-3'}`}
        style={{ borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <GraduationCap className="w-4 h-4 text-white" strokeWidth={2.2} />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-display font-700 text-white text-sm tracking-tight leading-none">LearnFlow</p>
            <p className="text-xs mt-0.5 font-medium capitalize" style={{ color: role === 'admin' ? '#A78BFA' : role === 'instructor' ? '#60A5FA' : '#34D399' }}>
              {role}
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-none py-3 px-2 space-y-0.5">
        {groups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
            {group.heading && !collapsed && (
              <p className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.5)' }}>
                {group.heading}
              </p>
            )}
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end ?? false}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) => [
                  'flex items-center rounded-lg text-sm font-medium transition-all duration-150 mb-0.5',
                  collapsed ? 'h-9 w-9 justify-center mx-auto' : 'h-9 px-2.5 gap-2.5',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
                ].join(' ')}
              >
                <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">{item.icon}</span>
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                {!collapsed && item.badge && item.badge > 0 ? (
                  <span className="flex-shrink-0 min-w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center px-1 font-semibold leading-none">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 p-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${avatarBg}`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate leading-none">{userName}</p>
              <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(148,163,184,0.6)' }}>{userRole}</p>
            </div>
          </div>
        )}
        <div className={`flex gap-1 ${collapsed ? 'flex-col items-center' : ''}`}>
          <button
            onClick={() => navigate('/login')}
            title="Sign out"
            className={`flex items-center gap-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors ${collapsed ? 'w-9 h-9 justify-center' : 'flex-1 h-8 px-2.5'}`}
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            {!collapsed && 'Sign out'}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-9 h-8 rounded-lg text-slate-600 hover:bg-slate-800 hover:text-slate-300 transition-colors flex items-center justify-center"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </aside>
  )
}
