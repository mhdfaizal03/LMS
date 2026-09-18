import React, { useState, useEffect } from 'react'
import { Search, Plus, MoreHorizontal, Eye, Archive, Trash2, Globe, BookOpen, Users, Star, Loader2 } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import { TableSkeleton } from '../../components/ui/Skeletons'
import { useNavigate } from 'react-router-dom'
import { resolveMediaUrl } from '../../utils/media'
import { courseApi } from '../../api'
import { Course, Category } from '../../types'

const statusVariant: Record<string, 'success' | 'warning' | 'muted'> = {
  published: 'success', draft: 'warning', archived: 'muted',
}

const catColor: Record<string, string> = {
  Development: 'bg-blue-50 text-blue-700 border-blue-200',
  Design:      'bg-violet-50 text-violet-700 border-violet-200',
  'Data & AI': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Business:    'bg-amber-50 text-amber-700 border-amber-200',
}

export default function AdminCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [coursesData, catsData] = await Promise.allSettled([
        courseApi.getCourses({
          search: search.trim() || undefined,
        }),
        courseApi.getCategories(),
      ])

      if (coursesData.status === 'fulfilled') setCourses(coursesData.value || [])
      if (catsData.status === 'fulfilled') setCategories(catsData.value || [])
    } catch (err) {
      console.error('Failed to load admin courses:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadData, 200)
    return () => clearTimeout(timer)
  }, [search])

  const handleTogglePublish = async (course: Course) => {
    try {
      const newStatus = course.status === 'published' ? 'draft' : 'published'
      const updated = await courseApi.updateCourse(course.id, { status: newStatus })
      setCourses(prev => prev.map(c => (c.id === course.id ? { ...c, status: updated.status } : c)))
    } catch (err) {
      console.error('Publish error:', err)
    } finally {
      setOpenMenu(null)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      setIsDeleting(true)
      await courseApi.deleteCourse(deleteTarget.id)
      setCourses(prev => prev.filter(c => c.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const filtered = courses.filter(c => {
    const matchStatus = filter === 'all' || c.status === filter
    return matchStatus
  })

  const counts = {
    all: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    archived: courses.filter(c => c.status === 'archived').length,
  }

  return (
    <div className="space-y-5 max-w-[1300px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">Courses</h1>
          <p className="text-sm text-slate-500 mt-0.5">{courses.length} courses across all categories</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/instructor/courses/new')}>New Course</Button>
      </div>

      {/* Filters + Search */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow">
        <div className="flex items-center justify-between gap-4 px-4 pt-4 pb-0">
          <div className="flex gap-1">
            {(['all', 'published', 'draft', 'archived'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${filter === f ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
              >
                {f} <span className={`text-xs ml-1 ${filter === f ? 'text-blue-200' : 'text-slate-400'}`}>({counts[f]})</span>
              </button>
            ))}
          </div>
          <div className="relative mb-0.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              placeholder="Search courses or instructors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 h-9 w-64 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-3 min-h-[400px]">
          {loading ? (
            <TableSkeleton rows={6} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-5 py-3 font-semibold whitespace-nowrap">Course</th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Category</th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Instructor</th>
                    <th className="text-left px-4 py-3 font-semibold whitespace-nowrap">Status</th>
                    <th className="text-right px-4 py-3 font-semibold whitespace-nowrap">Students</th>
                  <th className="text-right px-4 py-3 font-semibold">Rating</th>
                  <th className="text-right px-4 py-3 font-semibold">Updated</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(c => (
                  <tr key={c.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {c.thumbnail_url ? (
                          <img src={resolveMediaUrl(c.thumbnail_url)} alt={c.title} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{c.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${catColor[c.category?.name || 'General'] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {c.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{c.instructor?.name || 'Academic Faculty'}</td>
                    <td className="px-4 py-3.5"><Badge variant={statusVariant[c.status || 'draft'] || 'muted'} dot>{c.status || 'draft'}</Badge></td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-slate-700">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {(c.total_students_enrolled || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {c.rating ? (
                        <div className="flex items-center justify-end gap-1 font-semibold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{c.rating}
                        </div>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-400 text-xs">{new Date(c.updated_at || Date.now()).toLocaleDateString()}</td>
                    <td className="pr-4 py-3.5 relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenu === c.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                          <div className="absolute right-4 top-8 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-40">
                            <button onClick={() => { navigate(`/student/courses/${c.id}`); setOpenMenu(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />View Course
                            </button>
                            <button onClick={() => handleTogglePublish(c)} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                              <Globe className="w-3.5 h-3.5 text-slate-400" />{c.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>
                            <div className="border-t border-slate-100 mt-1 pt-1">
                              <button onClick={() => { setDeleteTarget(c); setOpenMenu(null); }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />Delete
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-0">
                      <div className="border-t border-slate-100">
                        <EmptyState 
                          icon={BookOpen}
                          title="No courses found"
                          description="We couldn't find any courses matching your current filters."
                          actionLabel="Clear Filters"
                          onAction={() => {
                            setSearch('')
                            setFilter('all')
                          }}
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

      {/* Delete modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Course">
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-1">Are you sure you want to delete <strong className="text-slate-900">{deleteTarget?.title}</strong>?</p>
          <p className="text-xs text-slate-400 mb-5">This action cannot be undone. All enrollment data will be permanently removed.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={confirmDelete} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete Course'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
