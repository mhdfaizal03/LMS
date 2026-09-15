import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LogOut, GraduationCap } from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  icon: React.ReactNode
  label: string
  to: string
}

interface SidebarProps {
  items: NavItem[]
  role: 'admin' | 'instructor' | 'student'
  userName: string
  userEmail: string
}

const roleColors = {
  admin: 'Admin',
  instructor: 'Instructor',
  student: 'Student',
}

export default function Sidebar({ items, role, userName, userEmail }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  return (
    <aside className={`flex flex-col bg-slate-900 text-slate-300 transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 h-screen sticky top-0`}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 h-16 border-b border-slate-800 flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-4.5 h-4.5 text-white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div>
            <span className="font-display font-700 text-white text-sm tracking-tight">LearnFlow</span>
            <span className="ml-1.5 text-xs bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded font-medium">{roleColors[role]}</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-hidden">
        <ul className="space-y-0.5 px-2">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === `/${role}` || item.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                  ${collapsed ? 'justify-center' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
                {!collapsed && item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User + collapse */}
      <div className="border-t border-slate-800 p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-semibold flex-shrink-0">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{userName}</p>
              <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>
        )}
        <div className="flex gap-1">
          <button
            onClick={() => navigate('/login')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors ${collapsed ? 'flex-1 justify-center' : 'flex-1'}`}
            title="Sign out"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && 'Sign out'}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  )
}
