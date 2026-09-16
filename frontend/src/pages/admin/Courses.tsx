import { useState, useEffect } from 'react'
import { Search, Plus, Trash2, Eye, Globe, Loader2, BookOpen } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { courseApi } from '../../api'
import { Course, Category } from '../../types'
import { useNavigate } from 'react-router-dom'

const statusBadge: Record<string, 'success' | 'warning' | 'muted'> = {
  published: 'success',
  draft: 'warning',
  archived: 'muted',
}

export default function AdminCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const [coursesData, catsData] = await Promise.allSettled([
        courseApi.getCourses({
          search: search.trim() || undefined,
          category_id: catFilter !== 'all' ? Number(catFilter) : undefined,
        }),
        courseApi.getCategories(),
      ])

      if (coursesData.status === 'fulfilled') {
        setCourses(coursesData.value || [])
      }
      if (catsData.status === 'fulfilled') {
        setCategories(catsData.value || [])
      }
    } catch (err) {
      console.error('Failed to load admin courses:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadData, 200)
    return () => clearTimeout(timer)
  }, [search, catFilter, statusFilter])

  const handleTogglePublish = async (course: Course) => {
    try {
      const newStatus = course.status === 'published' ? 'draft' : 'published'
      const updated = await courseApi.updateCourse(course.id, { status: newStatus })
      setCourses(prev => prev.map(c => (c.id === course.id ? { ...c, status: updated.status } : c)))
    } catch (err) {
      console.error('Publish error:', err)
    }
  }

  const handleDelete = async (courseId: number) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return
    try {
      await courseApi.deleteCourse(courseId)
      setCourses(prev => prev.filter(c => c.id !== courseId))
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const filtered = courses.filter(c => statusFilter === 'all' || c.status === statusFilter)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-display font-700 text-slate-900">Platform Courses</h2>
          <p className="text-sm text-slate-500">{courses.length} courses cataloged in database</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/instructor/courses/new')}>
          Create Course
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap gap-3">
        <div className="flex items-center gap-2 h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or instructor..."
            className="bg-transparent text-xs text-slate-900 outline-none flex-1 placeholder:text-slate-400"
          />
        </div>
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="h-10 border border-slate-200 rounded-lg px-3 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-10 border border-slate-200 rounded-lg px-3 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading courses from database...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Enrolled</th>
                  <th className="px-5 py-3">Difficulty</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(course => (
                  <tr key={course.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-12 h-8 object-cover rounded-md bg-slate-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-8 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px] flex-shrink-0">
                          LMS
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{course.title}</p>
                        <p className="text-slate-500 text-xs">By {course.instructor?.name || 'Instructor'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="muted">{course.category?.name || 'General'}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-semibold">
                      {(course.total_students_enrolled || 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{course.difficulty_level || 'All Levels'}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusBadge[course.status || 'draft'] || 'muted'}>{course.status || 'draft'}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTogglePublish(course)}
                          icon={<Globe className="w-3.5 h-3.5" />}
                        >
                          {course.status === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/student/courses/${course.id}`)}
                          icon={<Eye className="w-3.5 h-3.5" />}
                        >
                          View
                        </Button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-slate-500 text-xs">No courses found matching filters.</div>
        )}
      </div>
    </div>
  )
}
