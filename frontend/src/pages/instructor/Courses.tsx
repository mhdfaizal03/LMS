import React, { useState, useEffect } from 'react'
import { Plus, LayoutGrid, List, BookOpen, Users, Edit, Eye, MoreHorizontal, Star, TrendingUp, Loader2, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { CourseCardSkeleton, TableSkeleton } from '../../components/ui/Skeletons'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { resolveMediaUrl } from '../../utils/media'
import { courseApi } from '../../api'
import { Course } from '../../types'

const statusVariant: Record<string, 'success' | 'warning' | 'muted'> = {
  published: 'success', draft: 'warning', archived: 'muted',
}

export default function InstructorCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
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

  const handleDeleteConfirm = async () => {
    if (!deletingCourse) return
    try {
      setIsDeleting(true)
      await courseApi.deleteCourse(deletingCourse.id)
      setCourses(prev => prev.filter(c => c.id !== deletingCourse.id))
      setDeletingCourse(null)
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const filtered = filter === 'all' ? courses : courses.filter(c => c.status === filter)

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">My Courses</h1>
          <p className="text-sm text-slate-500 mt-0.5">{courses.filter(c => c.status === 'published').length} published · {courses.filter(c => c.status === 'draft').length} drafts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button onClick={() => setView('grid')} className={`p-2 transition-colors ${view === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView('list')} className={`p-2 transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}><List className="w-4 h-4" /></button>
          </div>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/instructor/courses/new')}>New Course</Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {['all', 'published', 'draft'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize shrink-0 ${filter === t ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 bg-white border border-slate-200'}`}
          >
            {t} ({t === 'all' ? courses.length : courses.filter(c => c.status === t).length})
          </button>
        ))}
      </div>

      {loading ? (
        view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => <CourseCardSkeleton key={i} />)}
          </div>
        ) : (
          <TableSkeleton rows={5} />
        )
      ) : filtered.length > 0 ? (
        view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between">
                <div>
                  {/* Thumbnail */}
                  <div className="h-40 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                    {c.thumbnail_url ? (
                      <img src={resolveMediaUrl(c.thumbnail_url)} alt={c.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-white/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3"><Badge variant={statusVariant[c.status || 'draft'] || 'muted'}>{c.status}</Badge></div>
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <button
                        onClick={() => navigate(`/instructor/courses/${c.id}/edit`)}
                        className="bg-white text-slate-900 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-lg hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />Edit
                      </button>
                      <button
                        onClick={() => navigate(`/student/courses/${c.id}`)}
                        className="bg-slate-900/90 text-white border border-white/20 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-lg hover:bg-black transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />Preview
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-slate-400 font-medium mb-1">{c.category?.name || 'General'}</p>
                    <h3 className="font-semibold text-slate-900 mb-2 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">{c.title}</h3>
                    
                    {c.status === 'draft' && (
                      <div className="mb-4 mt-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                          <span>Completion</span><span>65%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `65%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 mt-auto">
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-medium"><Users className="w-3.5 h-3.5 text-slate-400" />{(c.total_students_enrolled || 0).toLocaleString()}</span>
                      {c.rating ? (
                        <span className="flex items-center gap-1 font-medium text-slate-700"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{Number(c.rating).toFixed(1)}</span>
                      ) : null}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeletingCourse(c)
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* New course card */}
            <button
              onClick={() => navigate('/instructor/courses/new')}
              className="h-full min-h-[300px] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all bg-white"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold">Create New Course</span>
            </button>
          </div>
        ) : (
          /* List view */
          <div className="bg-white rounded-xl border border-slate-200 overflow-visible">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-5 py-3.5 font-semibold">Course</th>
                    <th className="text-left px-4 py-3.5 font-semibold">Status</th>
                    <th className="text-right px-4 py-3.5 font-semibold">Students</th>
                    <th className="text-right px-4 py-3.5 font-semibold">Rating</th>
                    <th className="text-right px-4 py-3.5 font-semibold">Category</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(c => (
                    <tr key={c.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {c.thumbnail_url ? (
                            <img src={resolveMediaUrl(c.thumbnail_url)} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <span className="font-semibold text-slate-900">{c.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant={statusVariant[c.status || 'draft'] || 'muted'} dot>{c.status}</Badge></td>
                      <td className="px-4 py-3 text-right text-slate-700 font-medium">{(c.total_students_enrolled || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        {c.rating ? <span className="flex items-center justify-end gap-1 font-semibold text-slate-700"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{Number(c.rating).toFixed(1)}</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500 text-xs font-medium">{c.category?.name || 'General'}</td>
                      <td className="pr-4 py-3 relative">
                        <button onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        {openMenu === c.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-8 top-8 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-40 transform origin-top-right">
                              <button onClick={() => { setOpenMenu(null); navigate(`/student/courses/${c.id}`) }} className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                <Eye className="w-4 h-4 text-slate-400" />Preview
                              </button>
                              <button onClick={() => { setOpenMenu(null); navigate(`/instructor/courses/${c.id}/edit`) }} className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                <Edit className="w-4 h-4 text-slate-400" />Edit Details
                              </button>
                              <div className="h-px bg-slate-100 my-1 mx-2" />
                              <button onClick={() => { setOpenMenu(null); setDeletingCourse(c) }} className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                <Trash2 className="w-4 h-4" />Delete Course
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 premium-shadow border-t">
          <EmptyState
            icon={BookOpen}
            title="No courses found"
            description={filter === 'all' ? "Start sharing your knowledge by creating your first course." : `You have no ${filter} courses right now.`}
            actionLabel="Create New Course"
            onAction={() => navigate('/instructor/courses/new')}
          />
        </div>
      )}

      {deletingCourse && (
        <ConfirmDialog
          isOpen={!!deletingCourse}
          onClose={() => setDeletingCourse(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Course"
          message={`Are you sure you want to permanently delete "${deletingCourse.title}"? This action cannot be undone.`}
          confirmText="Delete Course"
          isDestructive={true}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
