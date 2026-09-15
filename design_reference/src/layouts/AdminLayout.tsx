import { Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, UserCheck, BarChart3, Settings, ListOrdered, Award } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'

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
}

export default function AdminLayout() {
  const location = useLocation()
  const title = titles[location.pathname] || 'Admin'
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar items={navItems} role="admin" userName="Sarah Chen" userEmail="sarah@learnflow.co" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
