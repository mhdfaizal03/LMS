import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Compass, Award, User, Loader2 } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', to: '/student' },
  { icon: <Compass className="w-4 h-4" />, label: 'Browse Courses', to: '/student/courses' },
  { icon: <Award className="w-4 h-4" />, label: 'Certificates', to: '/student/certificates' },
  { icon: <User className="w-4 h-4" />, label: 'Profile', to: '/student/profile' },
]

const titles: Record<string, string> = {
  '/student': 'Dashboard',
  '/student/courses': 'Browse Courses',
  '/student/certificates': 'My Certificates',
  '/student/profile': 'My Profile',
}

export default function StudentLayout() {
  const { user, token, isLoading } = useAuth()
  const location = useLocation()
  const base = '/' + location.pathname.split('/').slice(1, 3).join('/')
  const title = titles[base] || 'Student Portal'

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        items={navItems}
        role={user.role || 'student'}
        userName={user.name}
        userEmail={user.email}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
