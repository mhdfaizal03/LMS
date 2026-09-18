import { useState } from 'react'
import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Users, ClipboardList, BarChart3, Settings, MessageSquare, Loader2 } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import { useAuth } from '../context/AuthContext'

const groups = [
  {
    items: [
      { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', to: '/instructor', end: true },
    ]
  },
  {
    heading: 'Teaching',
    items: [
      { icon: <BookOpen className="w-4 h-4" />, label: 'My Courses', to: '/instructor/courses' },
      { icon: <Users className="w-4 h-4" />, label: 'Students', to: '/instructor/students' },
      { icon: <ClipboardList className="w-4 h-4" />, label: 'Grading', to: '/instructor/grading', badge: 3 },
    ]
  },
  {
    heading: 'Insights',
    items: [
      { icon: <BarChart3 className="w-4 h-4" />, label: 'Analytics', to: '/instructor/analytics' },
    ]
  },
  {
    heading: 'Account',
    items: [
      { icon: <MessageSquare className="w-4 h-4" />, label: 'Announcements', to: '/instructor/announcements' },
      { icon: <Settings className="w-4 h-4" />, label: 'Settings', to: '/instructor/settings' },
    ]
  },
]

const crumbMap: Record<string, string> = {
  '/instructor':               'Dashboard',
  '/instructor/courses':       'My Courses',
  '/instructor/courses/builder': 'Course Builder',
  '/instructor/students':      'Students',
  '/instructor/grading':       'Grading',
  '/instructor/analytics':     'Analytics',
}

export default function InstructorLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, token, isLoading } = useAuth()
  const location = useLocation()
  const label = crumbMap[location.pathname] ?? 'Instructor'
  const crumbs = label === 'Dashboard'
    ? [{ label: 'Instructor' }, { label: 'Dashboard' }]
    : [{ label: 'Instructor', to: '/instructor' }, { label }]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading your instructor workspace...</p>
        </div>
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar 
        groups={groups} 
        role="instructor" 
        userName={user.name || 'Instructor'} 
        userRole="Faculty Member" 
        avatarBg="bg-blue-600" 
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar crumbs={crumbs} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
