import { useState } from 'react'
import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, Compass, Award, User, BookOpen, Loader2 } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import { useAuth } from '../context/AuthContext'

const groups = [
  {
    items: [
      { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', to: '/student', end: true },
    ]
  },
  {
    heading: 'Learning',
    items: [
      { icon: <BookOpen className="w-4 h-4" />, label: 'My Courses', to: '/student/learn/1' },
      { icon: <Compass className="w-4 h-4" />, label: 'Browse Courses', to: '/student/courses' },
    ]
  },
  {
    heading: 'Profile',
    items: [
      { icon: <Award className="w-4 h-4" />, label: 'Certificates', to: '/student/certificates' },
      { icon: <User className="w-4 h-4" />, label: 'My Profile', to: '/student/profile' },
    ]
  },
]

const crumbMap: Record<string, string> = {
  '/student':              'Dashboard',
  '/student/courses':      'Browse Courses',
  '/student/certificates': 'Certificates',
  '/student/profile':      'My Profile',
}

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user, token, isLoading } = useAuth()
  const base = '/' + location.pathname.split('/').slice(1, 3).join('/')
  const label = crumbMap[base] ?? 'Learning'
  const crumbs = label === 'Dashboard'
    ? [{ label: 'Student' }, { label: 'Dashboard' }]
    : [{ label: 'Student', to: '/student' }, { label }]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading your learning space...</p>
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
        role="student" 
        userName={user.name || 'Student'} 
        userRole="Learner"
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
