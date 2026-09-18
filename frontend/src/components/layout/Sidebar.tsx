import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LogOut, GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

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
  mobileOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ groups, role, userName, userRole, avatarBg = 'bg-blue-600', mobileOpen = false, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const initials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen md:h-[calc(100vh-2rem)] md:my-4 md:ml-4 rounded-r-3xl md:rounded-3xl flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out select-none z-40
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} premium-shadow glass-dark`}
        style={{
          width: collapsed ? 80 : 260,
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
                onClick={() => {
                  if (window.innerWidth < 768 && onClose) onClose()
                }}
                className={({ isActive }) => [
                  'flex items-center rounded-xl text-sm font-semibold transition-all duration-300 mb-1 mx-2',
                  collapsed ? 'h-11 w-11 justify-center mx-auto' : 'h-11 px-3 gap-3',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 translate-x-1'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:translate-x-1',
                ].join(' ')}
              >
                <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">{item.icon}</span>
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
      <div className="flex-shrink-0 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
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
            onClick={() => {
              if (logout) logout()
              navigate('/login')
            }}
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
    </>
  )
}
