import { useState } from 'react'
import { Outlet, useLocation, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, BookOpen, UserCheck,
  BarChart3, Settings, ListOrdered, Award, ShieldCheck, Loader2
} from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import { useAuth } from '../context/AuthContext'

const groups = [
  {
    items: [
      { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', to: '/admin', end: true },
    ]
  },
  {
    heading: 'Management',
    items: [
      { icon: <Users className="w-4 h-4" />, label: 'Users', to: '/admin/users' },
      { icon: <BookOpen className="w-4 h-4" />, label: 'Courses', to: '/admin/courses' },
      { icon: <UserCheck className="w-4 h-4" />, label: 'Enrollments', to: '/admin/enrollments' },
      { icon: <Award className="w-4 h-4" />, label: 'Certificates', to: '/admin/certificates' },
    ]
  },
  {
    heading: 'Insights',
    items: [
      { icon: <ListOrdered className="w-4 h-4" />, label: 'Reports', to: '/admin/reports' },
      { icon: <BarChart3 className="w-4 h-4" />, label: 'Analytics', to: '/admin/analytics' },
    ]
  },
  {
    heading: 'System',
    items: [
      { icon: <ShieldCheck className="w-4 h-4" />, label: 'Security', to: '/admin/security' },
      { icon: <Settings className="w-4 h-4" />, label: 'Settings', to: '/admin/settings' },
    ]
  },
]

const crumbMap: Record<string, { label: string; parent?: string }> = {
  '/admin':             { label: 'Dashboard' },
  '/admin/users':       { label: 'Users', parent: '/admin' },
  '/admin/courses':     { label: 'Courses', parent: '/admin' },
  '/admin/enrollments': { label: 'Enrollments', parent: '/admin' },
  '/admin/reports':     { label: 'Reports', parent: '/admin' },
  '/admin/settings':    { label: 'Settings', parent: '/admin' },
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, token, isLoading } = useAuth()
  const location = useLocation()
  const info = crumbMap[location.pathname]
  const crumbs = info
    ? info.parent
      ? [{ label: 'Admin', to: '/admin' }, { label: info.label }]
      : [{ label: 'Admin' }, { label: info.label }]
    : [{ label: 'Admin' }]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading admin dashboard...</p>
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
        role="admin" 
        userName={user.name || 'Admin'} 
        userRole="Administrator" 
        avatarBg="bg-violet-600" 
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
