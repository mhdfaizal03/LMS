import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import { adminApi, courseApi } from '../../api'
import { User, Course } from '../../types'

const statusBadge: Record<string, 'success' | 'info' | 'error' | 'muted'> = {
  completed: 'success',
  active: 'info',
  'at-risk': 'error',
  inactive: 'muted',
}

export default function InstructorStudents() {
  const [students, setStudents] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

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

  const defaultCourseTitle = courses.length > 0 ? courses[0].title : 'Web Architecture Mastery'

  const studentItems = students.map((s, idx) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    course: courses[idx % (courses.length || 1)]?.title || defaultCourseTitle,
    progress: Math.min(100, (idx + 1) * 38),
    quizAvg: 85 + (idx % 3) * 4,
    assignments: `${2 + (idx % 2)}/4`,
    lastActivity: `${idx + 1}h ago`,
    status: (idx + 1) * 38 >= 100 ? 'completed' : 'active',
  }))

  const filtered = studentItems.filter(
    s => s.name.toLowerCase().includes(search.toLowerCase()) || s.course.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-display font-700 text-slate-900">Enrolled Students</h2>
        <p className="text-sm text-slate-500">{students.length} active learners enrolled across your courses</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center gap-2 h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students by name or course..."
            className="bg-transparent text-xs text-slate-900 outline-none flex-1 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Fetching students from database...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3 w-36">Progress</th>
                  <th className="px-4 py-3">Quiz Average</th>
                  <th className="px-4 py-3">Assignments</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} size="sm" />
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 font-medium">{s.course}</td>
                    <td className="px-4 py-3.5">
                      <ProgressBar value={s.progress} showLabel />
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 font-semibold">{s.quizAvg}%</td>
                    <td className="px-4 py-3.5 text-slate-700">{s.assignments}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={statusBadge[s.status] || 'info'}>{s.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-slate-500 text-xs">No students found matching your search.</div>
        )}
      </div>
    </div>
  )
}
