import { Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Users, ClipboardList, BarChart3, Settings } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'

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
  '/instructor/students': 'My Students',
  '/instructor/grading': 'Grading',
  '/instructor/analytics': 'Analytics',
}

export default function InstructorLayout() {
  const location = useLocation()
  const title = titles[location.pathname] || 'Instructor'
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar items={navItems} role="instructor" userName="Dr. Marcus Reid" userEmail="marcus@learnflow.co" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
