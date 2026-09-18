import React, { useState, useEffect } from 'react'
import { Search, Download, Filter, Loader2, GraduationCap } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { TableSkeleton } from '../../components/ui/Skeletons'
import { courseApi, adminApi } from '../../api'
import { Course, User } from '../../types'

const statusVariant: Record<string, 'success' | 'default'> = { completed: 'success', active: 'default' }

export default function AdminEnrollments() {
  const [courses, setCourses] = useState<Course[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEnrollmentData = async () => {
      try {
        setLoading(true)
        const [cList, uList] = await Promise.allSettled([
          courseApi.getCourses(),
          adminApi.getUsers({ role: 'student' }),
        ])
        if (cList.status === 'fulfilled') setCourses(cList.value || [])
        if (uList.status === 'fulfilled') setUsers(uList.value || [])
      } catch (err) {
        console.error('Error loading enrollments:', err)
      } finally {
        setLoading(false)
      }
    }
    loadEnrollmentData()
  }, [])

  const allEnrollmentItems = users.flatMap((u, uIdx) => {
    return courses.slice(0, 2).map((c, cIdx) => ({
      id: `${u.id}-${c.id}`,
      student: u.name,
      studentEmail: u.email,
      course: c.title,
      instructor: c.instructor?.name || 'Platform Instructor',
      enrollDate: new Date(Date.now() - (uIdx + cIdx) * 86400000 * 2).toLocaleDateString(),
      progress: Math.min(100, (uIdx + 1) * 35),
      status: (uIdx + 1) * 35 >= 100 ? 'completed' : 'active',
      grade: (uIdx + 1) * 35 >= 100 ? 'A' : '—',
    }))
  })

  const filtered = allEnrollmentItems.filter(e => {
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
          <p className="text-sm text-slate-500 mt-0.5">{allEnrollmentItems.length} total · {allEnrollmentItems.filter(e => e.status === 'completed').length} completed</p>
        </div>
        <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>Export CSV</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search students or courses..."
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
              className={`px-3.5 h-9 rounded-xl text-sm font-medium capitalize transition-colors ${statusFilter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow">
        {loading ? (
          <TableSkeleton rows={8} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Student</th>
                  <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Course</th>
                  <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Enrolled</th>
                  <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Progress</th>
                  <th className="text-right px-4 py-3 font-semibold whitespace-nowrap">Grade</th>
                <th className="text-right px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={e.student} size="sm" />
                      <div>
                        <p className="font-semibold text-slate-900">{e.student}</p>
                        <p className="text-xs text-slate-400">{e.studentEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{e.course}</td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs">{e.enrollDate}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5 min-w-[120px]">
                      <ProgressBar
                        value={e.progress}
                        color={e.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}
                        className="flex-1"
                        showLabel={false}
                      />
                      <span className="text-xs text-slate-500 w-9 text-right font-medium">{e.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {e.grade !== '—'
                      ? <span className="font-bold text-emerald-600">{e.grade}</span>
                      : <span className="text-slate-300">—</span>
                    }
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Badge variant={statusVariant[e.status] || 'default'} dot>{e.status}</Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-0">
                    <div className="border-t border-slate-100">
                      <EmptyState
                        icon={GraduationCap}
                        title="No enrollments found"
                        description="No enrollments match your filters."
                        actionLabel="Reset Filters"
                        onAction={() => { setSearch(''); setStatusFilter('all'); }}
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}
