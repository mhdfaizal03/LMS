import { Search } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'

const students = [
  { name: 'Alex Johnson', email: 'alex@student.edu', course: 'React Fundamentals', progress: 78, quizAvg: 84, assignments: '3/4', lastActivity: '2h ago', status: 'active' },
  { name: 'Priya Sharma', email: 'priya@student.edu', course: 'Advanced Node.js', progress: 100, quizAvg: 91, assignments: '5/5', lastActivity: 'Yesterday', status: 'completed' },
  { name: 'Carlos Mendez', email: 'carlos@student.edu', course: 'ML Basics', progress: 34, quizAvg: 72, assignments: '1/3', lastActivity: '2 weeks ago', status: 'at-risk' },
  { name: 'Emily Chen', email: 'emily@student.edu', course: 'React Fundamentals', progress: 55, quizAvg: 78, assignments: '2/4', lastActivity: 'Today', status: 'active' },
  { name: 'James Okafor', email: 'james@student.edu', course: 'ML Basics', progress: 92, quizAvg: 88, assignments: '3/3', lastActivity: '5h ago', status: 'active' },
  { name: 'Sofia Martinez', email: 'sofia@student.edu', course: 'React Fundamentals', progress: 12, quizAvg: 65, assignments: '0/4', lastActivity: '3 weeks ago', status: 'at-risk' },
]

const statusBadge: Record<string, 'success' | 'info' | 'error' | 'muted'> = {
  completed: 'success', active: 'info', 'at-risk': 'error', inactive: 'muted'
}

export default function InstructorStudents() {
  const [search, setSearch] = useState('')
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">My Students</h2>
        <p className="text-sm text-slate-500">{students.length} enrolled students across all courses</p>
      </div>
      <div className="flex items-center gap-2 h-9 bg-white border border-slate-200 rounded-lg px-3 max-w-sm">
        <Search className="w-3.5 h-3.5 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400" />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Course</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-36">Progress</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Quiz Avg</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Assignments</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Active</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">{s.course}</td>
                  <td className="px-4 py-3.5"><ProgressBar value={s.progress} showLabel /></td>
                  <td className="px-4 py-3.5 text-slate-700">{s.quizAvg}%</td>
                  <td className="px-4 py-3.5 text-slate-700">{s.assignments}</td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs">{s.lastActivity}</td>
                  <td className="px-4 py-3.5"><Badge variant={statusBadge[s.status]}>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
