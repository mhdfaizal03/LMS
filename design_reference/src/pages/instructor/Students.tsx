import { Search, AlertTriangle, Filter } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'

const students = [
  { id: 1,  name: 'Alex Johnson',   email: 'alex@email.com',   course: 'React Fundamentals',  progress: 78, quizAvg: 84, lastActive: '2h ago',  status: 'active',  atRisk: false },
  { id: 2,  name: 'Sam Rivera',     email: 'sam@email.com',    course: 'React Fundamentals',  progress: 45, quizAvg: 61, lastActive: '3d ago',  status: 'active',  atRisk: true  },
  { id: 3,  name: 'Jordan Lee',     email: 'jordan@email.com', course: 'Advanced Node.js',    progress: 92, quizAvg: 91, lastActive: '1h ago',  status: 'active',  atRisk: false },
  { id: 4,  name: 'Taylor Smith',   email: 'taylor@email.com', course: 'React Fundamentals',  progress: 20, quizAvg: 55, lastActive: '7d ago',  status: 'inactive',atRisk: true  },
  { id: 5,  name: 'Morgan Chen',    email: 'morgan@email.com', course: 'Advanced Node.js',    progress: 67, quizAvg: 78, lastActive: '5h ago',  status: 'active',  atRisk: false },
  { id: 6,  name: 'Casey Kim',      email: 'casey@email.com',  course: 'React Fundamentals',  progress: 100,quizAvg: 96, lastActive: '1d ago',  status: 'completed',atRisk: false },
  { id: 7,  name: 'Drew Martinez',  email: 'drew@email.com',   course: 'Advanced Node.js',    progress: 38, quizAvg: 52, lastActive: '10d ago', status: 'inactive',atRisk: true  },
]

export default function InstructorStudents() {
  const [search, setSearch] = useState('')
  const [filterAtRisk, setFilterAtRisk] = useState(false)

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.includes(search.toLowerCase())
    const matchRisk   = !filterAtRisk || s.atRisk
    return matchSearch && matchRisk
  })

  const atRiskCount = students.filter(s => s.atRisk).length

  return (
    <div className="space-y-5 max-w-[1100px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">Students</h1>
          <p className="text-sm text-slate-500 mt-0.5">{students.length} enrolled across your courses</p>
        </div>
        {atRiskCount > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3.5 py-2 text-sm font-semibold">
            <AlertTriangle className="w-4 h-4" />
            {atRiskCount} students at risk
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search students…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 h-9 w-full border border-slate-200 rounded-xl text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
          />
        </div>
        <button
          onClick={() => setFilterAtRisk(f => !f)}
          className={`flex items-center gap-2 px-3.5 h-9 rounded-xl text-sm font-medium border transition-colors ${filterAtRisk ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-600'}`}
        >
          <Filter className="w-3.5 h-3.5" />At-risk only
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-semibold">Student</th>
              <th className="text-left px-4 py-3 font-semibold">Course</th>
              <th className="text-left px-4 py-3 font-semibold">Progress</th>
              <th className="text-right px-4 py-3 font-semibold">Quiz Avg.</th>
              <th className="text-right px-4 py-3 font-semibold">Last Active</th>
              <th className="text-right px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(s => (
              <tr key={s.id} className={`hover:bg-slate-50 transition-colors ${s.atRisk ? 'bg-red-50/40' : ''}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size="sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{s.name}</p>
                        {s.atRisk && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                      </div>
                      <p className="text-xs text-slate-400">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-600">{s.course}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5 min-w-[120px]">
                    <ProgressBar
                      value={s.progress}
                      max={100}
                      color={s.progress >= 70 ? 'bg-emerald-500' : s.progress >= 40 ? 'bg-blue-500' : 'bg-red-400'}
                      className="flex-1"
                    />
                    <span className="text-xs text-slate-500 w-9 text-right">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className={`font-semibold ${s.quizAvg >= 75 ? 'text-emerald-600' : 'text-red-500'}`}>{s.quizAvg}%</span>
                </td>
                <td className="px-4 py-3.5 text-right text-slate-400 text-xs">{s.lastActive}</td>
                <td className="px-4 py-3.5 text-right">
                  {s.status === 'completed'
                    ? <Badge variant="success" dot>Completed</Badge>
                    : s.status === 'active'
                    ? <Badge variant="default" dot>Active</Badge>
                    : <Badge variant="muted" dot>Inactive</Badge>
                  }
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">No students match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
