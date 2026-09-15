import { useState } from 'react'
import { Search, Plus, MoreHorizontal, Eye, Archive, Trash2, Globe } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import Modal from '../../components/ui/Modal'

const courses = [
  { id: 1, title: 'React Fundamentals', instructor: 'Dr. Marcus Reid', category: 'Development', students: 1240, status: 'published', completion: 87, created: 'Jan 10, 2024' },
  { id: 2, title: 'UX Design Mastery', instructor: 'Sarah Kim', category: 'Design', students: 980, status: 'published', completion: 79, created: 'Feb 14, 2024' },
  { id: 3, title: 'Data Science with Python', instructor: 'Prof. Lin Zhang', category: 'Data', students: 870, status: 'published', completion: 91, created: 'Mar 2, 2024' },
  { id: 4, title: 'Advanced Node.js', instructor: 'Tom Whitfield', category: 'Development', students: 650, status: 'published', completion: 73, created: 'Apr 20, 2024' },
  { id: 5, title: 'Machine Learning Basics', instructor: 'Dr. Ana Ruiz', category: 'AI/ML', students: 510, status: 'published', completion: 68, created: 'May 5, 2024' },
  { id: 6, title: 'Cloud Architecture', instructor: 'Mark Stevens', category: 'DevOps', students: 0, status: 'draft', completion: 0, created: 'Sep 1, 2024' },
  { id: 7, title: 'Product Management Fundamentals', instructor: 'Jessica Park', category: 'Business', students: 0, status: 'review', completion: 0, created: 'Aug 28, 2024' },
]

const statusBadge: Record<string, 'success' | 'muted' | 'warning'> = {
  published: 'success', draft: 'muted', review: 'warning'
}

export default function AdminCourses() {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [deleteModal, setDeleteModal] = useState<number | null>(null)

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || c.category === catFilter
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchCat && matchStatus
  })

  const categories = [...new Set(courses.map(c => c.category))]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">All Courses</h2>
          <p className="text-sm text-slate-500">{courses.length} total courses</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>New Course</Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 h-9 bg-slate-50 border border-slate-200 rounded-lg px-3 flex-1 min-w-40">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="h-9 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 border border-slate-200 rounded-lg px-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="review">In Review</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Course</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Students</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-40">Completion</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(course => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{course.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{course.instructor}</p>
                  </td>
                  <td className="px-4 py-4"><Badge variant="muted">{course.category}</Badge></td>
                  <td className="px-4 py-4 text-slate-700">{course.students.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <ProgressBar value={course.completion} showLabel />
                  </td>
                  <td className="px-4 py-4"><Badge variant={statusBadge[course.status]}>{course.status}</Badge></td>
                  <td className="px-4 py-4 text-slate-500 text-xs">{course.created}</td>
                  <td className="px-4 py-4">
                    <div className="relative">
                      <button onClick={() => setOpenMenu(openMenu === course.id ? null : course.id)} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenu === course.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                          <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left">
                            <Eye className="w-3.5 h-3.5" /> View course
                          </button>
                          {course.status !== 'published' && (
                            <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left">
                              <Globe className="w-3.5 h-3.5" /> Publish
                            </button>
                          )}
                          <button className="w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left">
                            <Archive className="w-3.5 h-3.5" /> Archive
                          </button>
                          <hr className="my-1 border-slate-100" />
                          <button onClick={() => { setDeleteModal(course.id); setOpenMenu(null) }} className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 text-left">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing {filtered.length} of {courses.length} courses</p>
          <div className="flex gap-1">
            {[1, 2].map(p => (
              <button key={p} className={`w-7 h-7 rounded-md text-xs font-medium ${p === 1 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <Modal open={deleteModal !== null} onClose={() => setDeleteModal(null)} title="Delete Course" size="sm">
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">Are you sure you want to delete this course? All enrollments, progress, and content will be permanently removed.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => setDeleteModal(null)}>Delete Course</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
