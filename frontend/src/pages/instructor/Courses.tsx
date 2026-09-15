import { useState, useEffect } from 'react'
import { Plus, LayoutGrid, List, BookOpen, Users, Edit, Eye, Trash2, Loader2, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { courseApi } from '../../api'
import { Course } from '../../types'

const statusBadge: Record<string, 'success' | 'warning' | 'muted'> = {
  published: 'success',
  draft: 'warning',
  archived: 'muted',
}

export default function InstructorCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const navigate = useNavigate()

  const loadCourses = async () => {
    try {
      setLoading(true)
      const data = await courseApi.getInstructorCourses()
      setCourses(data || [])
    } catch (err) {
      console.error('Error fetching instructor courses:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleDelete = async (courseId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this course and its curriculum?')) return
    try {
      setDeletingId(courseId)
      await courseApi.deleteCourse(courseId)
      setCourses(prev => prev.filter(c => c.id !== courseId))
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = courses.filter(c => filter === 'all' || c.status === filter)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-display font-700 text-slate-900">Manage Courses</h2>
          <p className="text-sm text-slate-500">{courses.length} courses published or drafted</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                view === 'grid' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                view === 'list' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/instructor/courses/new')}>
            Create Course
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'published', 'draft'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === f ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 text-xs opacity-80">
              {f === 'all' ? courses.length : courses.filter(c => c.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Fetching courses from database...</p>
        </div>
      ) : filtered.length > 0 ? (
        view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(c => (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative bg-slate-100">
                    {c.thumbnail_url ? (
                      <img src={c.thumbnail_url} alt={c.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-r from-blue-700 to-indigo-800 flex items-center justify-center text-white font-bold text-sm">
                        {c.title}
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant={statusBadge[c.status] || 'muted'}>{c.status}</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">{c.title}</h3>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{c.short_description || c.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {c.total_students_enrolled || 0} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {c.rating ? Number(c.rating).toFixed(1) : '5.0'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Edit className="w-3.5 h-3.5" />}
                      onClick={() => navigate(`/instructor/courses/${c.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => navigate(`/student/courses/${c.id}`)}
                    >
                      View
                    </Button>
                  </div>
                  <button
                    onClick={e => handleDelete(c.id, e)}
                    disabled={deletingId === c.id}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
            {filtered.map(c => (
              <div key={c.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                {c.thumbnail_url ? (
                  <img src={c.thumbnail_url} alt={c.title} className="w-14 h-10 object-cover rounded-lg bg-slate-100 flex-shrink-0" />
                ) : (
                  <div className="w-14 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-blue-700 text-xs">
                    LMS
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 text-sm truncate">{c.title}</p>
                    <Badge variant={statusBadge[c.status] || 'muted'}>{c.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {c.category?.name || 'Category'} • {c.total_students_enrolled || 0} students enrolled
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Edit className="w-3.5 h-3.5" />}
                    onClick={() => navigate(`/instructor/courses/${c.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => navigate(`/student/courses/${c.id}`)}
                  >
                    Preview
                  </Button>
                  <button
                    onClick={e => handleDelete(c.id, e)}
                    disabled={deletingId === c.id}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">No courses found</h3>
          <p className="text-xs text-slate-500 mb-4">Start by creating and structuring your course curriculum.</p>
          <Button onClick={() => navigate('/instructor/courses/new')}>Create New Course</Button>
        </div>
      )}
    </div>
  )
}
