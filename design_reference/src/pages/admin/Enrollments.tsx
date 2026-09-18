import { Search, Download, Filter } from 'lucide-react'
import { useState } from 'react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import Button from '../../components/ui/Button'

const enrollments = [
  { id: 1,  student: 'Alex Johnson',   course: 'React Fundamentals',   enrollDate: 'Aug 10, 2026', progress: 78, status: 'active',    grade: 'B+' },
  { id: 2,  student: 'Sam Rivera',     course: 'React Fundamentals',   enrollDate: 'Aug 12, 2026', progress: 45, status: 'active',    grade: '—'  },
  { id: 3,  student: 'Jordan Lee',     course: 'Advanced Node.js',     enrollDate: 'Jul 28, 2026', progress: 92, status: 'active',    grade: 'A'  },
  { id: 4,  student: 'Taylor Smith',   course: 'UX Design Mastery',    enrollDate: 'Sep 1, 2026',  progress: 100,status: 'completed', grade: 'A+' },
  { id: 5,  student: 'Morgan Chen',    course: 'Data Science',         enrollDate: 'Aug 20, 2026', progress: 60, status: 'active',    grade: '—'  },
  { id: 6,  student: 'Casey Kim',      course: 'React Fundamentals',   enrollDate: 'Jul 15, 2026', progress: 100,status: 'completed', grade: 'A'  },
  { id: 7,  student: 'Drew Martinez',  course: 'Advanced Node.js',     enrollDate: 'Sep 5, 2026',  progress: 12, status: 'active',    grade: '—'  },
  { id: 8,  student: 'Riley Park',     course: 'UX Design Mastery',    enrollDate: 'Aug 5, 2026',  progress: 100,status: 'completed', grade: 'B'  },
]

const statusVariant: Record<string, 'success' | 'default'> = { completed: 'success', active: 'default' }

export default function AdminEnrollments() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = enrollments.filter(e => {
    const matchSearch = e.student.toLowerCase().includes(search.toLowerCase()) || e.course.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || e.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-5 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">Enrollments</h1>
          <p className="text-sm text-slate-500 mt-0.5">{enrollments.length} total · {enrollments.filter(e => e.status === 'completed').length} completed</p>
        </div>
        <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export CSV</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search students or courses…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 h-9 w-64 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400" />
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3.5 h-9 rounded-xl text-sm font-medium capitalize transition-colors ${statusFilter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-semibold">Student</th>
              <th className="text-left px-4 py-3 font-semibold">Course</th>
              <th className="text-left px-4 py-3 font-semibold">Enrolled</th>
              <th className="text-left px-4 py-3 font-semibold">Progress</th>
              <th className="text-right px-4 py-3 font-semibold">Grade</th>
              <th className="text-right px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(e => (
              <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={e.student} size="sm" />
                    <p className="font-semibold text-slate-900">{e.student}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-600">{e.course}</td>
                <td className="px-4 py-3.5 text-slate-500 text-xs">{e.enrollDate}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5 min-w-[120px]">
                    <ProgressBar
                      value={e.progress}
                      max={100}
                      color={e.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}
                      className="flex-1"
                    />
                    <span className="text-xs text-slate-500 w-9 text-right">{e.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  {e.grade !== '—'
                    ? <span className="font-bold text-emerald-600">{e.grade}</span>
                    : <span className="text-slate-300">—</span>
                  }
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Badge variant={statusVariant[e.status]} dot>{e.status}</Badge>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">No enrollments match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
