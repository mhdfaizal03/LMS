import { Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, BookOpen, UserCheck,
  BarChart3, Settings, ListOrdered, Award, ShieldCheck,
} from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'

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
  const location = useLocation()
  const info = crumbMap[location.pathname]
  const crumbs = info
    ? info.parent
      ? [{ label: 'Admin', to: '/admin' }, { label: info.label }]
      : [{ label: 'Admin' }, { label: info.label }]
    : [{ label: 'Admin' }]

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar groups={groups} role="admin" userName="Sarah Chen" userRole="Administrator" avatarBg="bg-violet-600" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar crumbs={crumbs} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
