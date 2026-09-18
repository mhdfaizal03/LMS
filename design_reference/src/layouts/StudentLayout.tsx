import { Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Compass, Award, User, BookOpen } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'

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
  const location = useLocation()
  const base = '/' + location.pathname.split('/').slice(1, 3).join('/')
  const label = crumbMap[base] ?? 'Learning'
  const crumbs = label === 'Dashboard'
    ? [{ label: 'Student' }, { label: 'Dashboard' }]
    : [{ label: 'Student', to: '/student' }, { label }]

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar groups={groups} role="student" userName="Alex Johnson" userRole="Student" avatarBg="bg-emerald-600" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar crumbs={crumbs} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
