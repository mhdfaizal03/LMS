import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, UserCheck, BarChart3, Settings, ListOrdered, Award, Loader2 } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', to: '/admin' },
  { icon: <Users className="w-4 h-4" />, label: 'Users', to: '/admin/users' },
  { icon: <BookOpen className="w-4 h-4" />, label: 'Courses', to: '/admin/courses' },
  { icon: <UserCheck className="w-4 h-4" />, label: 'Enrollments', to: '/admin/enrollments' },
  { icon: <ListOrdered className="w-4 h-4" />, label: 'Reports', to: '/admin/reports' },
  { icon: <Award className="w-4 h-4" />, label: 'Certificates', to: '/admin/certificates' },
  { icon: <BarChart3 className="w-4 h-4" />, label: 'Analytics', to: '/admin/analytics' },
  { icon: <Settings className="w-4 h-4" />, label: 'Settings', to: '/admin/settings' },
]

const titles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'User Management',
  '/admin/courses': 'Course Management',
  '/admin/enrollments': 'Enrollments',
  '/admin/reports': 'Reports & Analytics',
  '/admin/settings': 'Settings',
  '/lms/admin': 'Admin Control Center',
}

export default function AdminLayout() {
  const { user, token, isLoading } = useAuth()
  const location = useLocation()
  const title = titles[location.pathname] || 'Admin'

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
        role={user.role || 'admin'}
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
