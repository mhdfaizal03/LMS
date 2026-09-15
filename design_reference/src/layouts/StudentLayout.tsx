import { Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Compass, Award, User } from 'lucide-react'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'

const navItems = [
  { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard', to: '/student' },
  { icon: <BookOpen className="w-4 h-4" />, label: 'My Courses', to: '/student/learn/1' },
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
  const location = useLocation()
  const base = '/' + location.pathname.split('/').slice(1, 3).join('/')
  const title = titles[base] || 'Learning'
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar items={navItems} role="student" userName="Alex Johnson" userEmail="alex@student.edu" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
