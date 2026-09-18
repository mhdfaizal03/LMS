import { Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Users, ClipboardList, BarChart3, Settings, MessageSquare } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'

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
  const location = useLocation()
  const label = crumbMap[location.pathname] ?? 'Instructor'
  const crumbs = label === 'Dashboard'
    ? [{ label: 'Instructor' }, { label: 'Dashboard' }]
    : [{ label: 'Instructor', to: '/instructor' }, { label }]

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar groups={groups} role="instructor" userName="Dr. Marcus Reid" userRole="Instructor" avatarBg="bg-blue-600" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar crumbs={crumbs} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
