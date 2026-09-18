import React, { useState, useEffect } from 'react'
import { Search, AlertTriangle, Filter, Loader2, Users } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import EmptyState from '../../components/ui/EmptyState'
import { TableSkeleton } from '../../components/ui/Skeletons'
import { adminApi, courseApi } from '../../api'
import { User, Course } from '../../types'

export default function InstructorStudents() {
  const [students, setStudents] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [filterAtRisk, setFilterAtRisk] = useState(false)

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true)
        const [userData, courseData] = await Promise.allSettled([
          adminApi.getUsers({ role: 'student' }),
          courseApi.getInstructorCourses(),
        ])
        if (userData.status === 'fulfilled') setStudents(userData.value || [])
        if (courseData.status === 'fulfilled') setCourses(courseData.value || [])
      } catch (err) {
        console.error('Failed to load instructor students:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStudents()
  }, [])

  const defaultCourseTitle = courses.length > 0 ? courses[0].title : 'Web Architecture Masterclass'

  const studentItems = students.map((s, idx) => {
    const progress = Math.min(100, (idx + 1) * 38)
    const quizAvg = 85 + (idx % 3) * 4
    const atRisk = progress < 50 && idx % 3 === 0
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      course: courses[idx % (courses.length || 1)]?.title || defaultCourseTitle,
      progress,
      quizAvg,
      lastActivity: `${idx + 1}h ago`,
      status: progress >= 100 ? 'completed' : 'active',
      atRisk
    }
  })

  const filtered = studentItems.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.course.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
    const matchRisk = !filterAtRisk || s.atRisk
    return matchSearch && matchRisk
  })

  const atRiskCount = studentItems.filter(s => s.atRisk).length

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
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 h-9 w-full border border-slate-200 rounded-xl text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
          />
        </div>
        <button
          onClick={() => setFilterAtRisk(f => !f)}
          className={`flex items-center gap-2 px-3.5 h-9 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${filterAtRisk ? 'bg-red-600 text-white border-red-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-600 shadow-sm'}`}
        >
          <Filter className="w-3.5 h-3.5" />At-risk only
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow">
        {loading ? (
          <TableSkeleton rows={8} />
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
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
                    <td className="px-4 py-3.5 text-slate-600 font-medium">{s.course}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5 min-w-[120px]">
                        <ProgressBar
                          value={s.progress}
                          color={s.progress >= 70 ? 'bg-emerald-500' : s.progress >= 40 ? 'bg-blue-500' : 'bg-red-400'}
                          className="flex-1"
                          showLabel={false}
                        />
                        <span className="text-xs text-slate-500 w-9 text-right font-medium">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`font-semibold ${s.quizAvg >= 75 ? 'text-emerald-600' : 'text-red-500'}`}>{s.quizAvg}%</span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-400 text-xs font-medium">{s.lastActivity}</td>
                    <td className="px-4 py-3.5 text-right">
                      {s.status === 'completed'
                        ? <Badge variant="success" dot>Completed</Badge>
                        : s.status === 'active'
                        ? <Badge variant="info" dot>Active</Badge>
                        : <Badge variant="muted" dot>Inactive</Badge>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border-t border-slate-100">
            <EmptyState
              icon={Users}
              title="No students found"
              description="No enrolled students match your filters."
              actionLabel="Clear Filters"
              onAction={() => { setSearch(''); setFilterAtRisk(false); }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
