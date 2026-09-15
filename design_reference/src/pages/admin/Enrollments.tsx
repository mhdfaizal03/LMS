import { Search } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'

const enrollments = [
  { student: 'Alex Johnson', course: 'React Fundamentals', instructor: 'Dr. Marcus Reid', enrolled: 'Aug 12, 2024', progress: 78, status: 'active' },
  { student: 'Priya Sharma', course: 'UX Design Mastery', instructor: 'Sarah Kim', enrolled: 'Jun 3, 2024', progress: 100, status: 'completed' },
  { student: 'Carlos Mendez', course: 'Data Science with Python', instructor: 'Prof. Lin Zhang', enrolled: 'Sep 1, 2024', progress: 34, status: 'active' },
  { student: 'Emily Chen', course: 'Advanced Node.js', instructor: 'Tom Whitfield', enrolled: 'Jul 15, 2024', progress: 55, status: 'active' },
  { student: 'James Okafor', course: 'Machine Learning Basics', instructor: 'Dr. Ana Ruiz', enrolled: 'May 22, 2024', progress: 92, status: 'active' },
  { student: 'Sofia Martinez', course: 'React Fundamentals', instructor: 'Dr. Marcus Reid', enrolled: 'Aug 30, 2024', progress: 12, status: 'active' },
  { student: 'Ethan Williams', course: 'UX Design Mastery', instructor: 'Sarah Kim', enrolled: 'Apr 18, 2024', progress: 100, status: 'completed' },
]

const statusBadge: Record<string, 'success' | 'muted' | 'info'> = {
  completed: 'success', active: 'info', inactive: 'muted'
}

export default function AdminEnrollments() {
  const [search, setSearch] = useState('')
  const filtered = enrollments.filter(e =>
    e.student.toLowerCase().includes(search.toLowerCase()) ||
    e.course.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Enrollments</h2>
        <p className="text-sm text-slate-500">{enrollments.length} total enrollments</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center gap-2 h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search enrollments..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400" />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Course</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Instructor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Enrolled</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-40">Progress</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={e.student} size="sm" />
                      <span className="font-medium text-slate-900">{e.student}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">{e.course}</td>
                  <td className="px-4 py-3.5 text-slate-500">{e.instructor}</td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs">{e.enrolled}</td>
                  <td className="px-4 py-3.5"><ProgressBar value={e.progress} showLabel /></td>
                  <td className="px-4 py-3.5"><Badge variant={statusBadge[e.status]}>{e.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
