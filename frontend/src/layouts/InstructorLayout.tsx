import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Users, ClipboardList, BarChart3, Settings, Loader2 } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', to: '/instructor' },
  { icon: <BookOpen className="w-4 h-4" />, label: 'My Courses', to: '/instructor/courses' },
  { icon: <Users className="w-4 h-4" />, label: 'Students', to: '/instructor/students' },
  { icon: <ClipboardList className="w-4 h-4" />, label: 'Grading', to: '/instructor/grading' },
  { icon: <BarChart3 className="w-4 h-4" />, label: 'Analytics', to: '/instructor/analytics' },
  { icon: <Settings className="w-4 h-4" />, label: 'Settings', to: '/instructor/settings' },
]

const titles: Record<string, string> = {
  '/instructor': 'Dashboard',
  '/instructor/courses': 'My Courses',
  '/instructor/courses/builder': 'Course Builder',
  '/instructor/courses/new': 'Create Course',
  '/instructor/students': 'My Students',
  '/instructor/grading': 'Grading',
  '/instructor/analytics': 'Analytics',
}

export default function InstructorLayout() {
  const { user, token, isLoading } = useAuth()
  const location = useLocation()
  const title = titles[location.pathname] || 'Instructor'

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
        role={user.role || 'instructor'}
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
