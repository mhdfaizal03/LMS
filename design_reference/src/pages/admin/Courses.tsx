import { useState } from 'react'
import { Search, Plus, MoreHorizontal, Eye, Archive, Trash2, Globe, BookOpen, Users, Star } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

const ALL_COURSES = [
  { id: 1, title: 'React Fundamentals',       category: 'Development', status: 'published', students: 1240, rating: 4.9, instructor: 'Dr. Marcus Reid',  updated: 'Sep 12, 2026' },
  { id: 2, title: 'UX Design Mastery',        category: 'Design',      status: 'published', students: 980,  rating: 4.7, instructor: 'Sarah Kim',        updated: 'Sep 8, 2026'  },
  { id: 3, title: 'Data Science Essentials',  category: 'Data & AI',   status: 'draft',     students: 0,    rating: null,instructor: 'Dr. Priya Nair',   updated: 'Sep 15, 2026' },
  { id: 4, title: 'Advanced Node.js',         category: 'Development', status: 'published', students: 650,  rating: 4.6, instructor: 'James Liu',        updated: 'Aug 29, 2026' },
  { id: 5, title: 'Python for ML',            category: 'Data & AI',   status: 'archived',  students: 512,  rating: 4.4, instructor: 'Dr. Priya Nair',   updated: 'Jul 14, 2026' },
  { id: 6, title: 'Product Management 101',   category: 'Business',    status: 'draft',     students: 0,    rating: null,instructor: 'Mia Torres',       updated: 'Sep 16, 2026' },
  { id: 7, title: 'Mobile Dev with Flutter',  category: 'Development', status: 'published', students: 420,  rating: 4.8, instructor: 'Kai Nakamura',    updated: 'Sep 1, 2026'  },
]

const statusVariant: Record<string, 'success' | 'muted' | 'warning'> = {
  published: 'success', draft: 'warning', archived: 'muted',
}

const catColor: Record<string, string> = {
  Development: 'bg-blue-50 text-blue-700 border-blue-200',
  Design:      'bg-violet-50 text-violet-700 border-violet-200',
  'Data & AI': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Business:    'bg-amber-50 text-amber-700 border-amber-200',
}

export default function AdminCourses() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<typeof ALL_COURSES[0] | null>(null)
  const [courses, setCourses] = useState(ALL_COURSES)

  const filtered = courses.filter(c => {
    const matchStatus = filter === 'all' || c.status === filter
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const confirmDelete = () => {
    if (deleteTarget) setCourses(cs => cs.filter(c => c.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

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
        <Button icon={<Plus className="w-4 h-4" />}>New Course</Button>
      </div>

      {/* Filters + Search */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
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
              placeholder="Search courses or instructors…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 h-9 w-64 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-semibold">Course</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Instructor</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Students</th>
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
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{c.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${catColor[c.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>{c.category}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{c.instructor}</td>
                  <td className="px-4 py-3.5"><Badge variant={statusVariant[c.status]} dot>{c.status}</Badge></td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-slate-700">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {c.students.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {c.rating ? (
                      <div className="flex items-center justify-end gap-1 font-semibold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{c.rating}
                      </div>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-right text-slate-400 text-xs">{c.updated}</td>
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
                          {[
                            { icon: <Eye className="w-3.5 h-3.5" />, label: 'View Course' },
                            { icon: <Globe className="w-3.5 h-3.5" />, label: c.status === 'published' ? 'Unpublish' : 'Publish' },
                            { icon: <Archive className="w-3.5 h-3.5" />, label: 'Archive' },
                          ].map(item => (
                            <button key={item.label} onClick={() => setOpenMenu(null)} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                              <span className="text-slate-400">{item.icon}</span>{item.label}
                            </button>
                          ))}
                          <div className="border-t border-slate-100 mt-1 pt-1">
                            <button onClick={() => { setDeleteTarget(c); setOpenMenu(null) }} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
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
                <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-400 text-sm">No courses match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Course" size="sm">
        <p className="text-sm text-slate-600 mb-1">Are you sure you want to delete <strong className="text-slate-900">{deleteTarget?.title}</strong>?</p>
        <p className="text-xs text-slate-400 mb-5">This action cannot be undone. All enrollment data will be permanently removed.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>Delete Course</Button>
        </div>
      </Modal>
    </div>
  )
}
