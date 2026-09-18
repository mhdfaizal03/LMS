import { useState } from 'react'
import { Plus, LayoutGrid, List, BookOpen, Users, Edit, Eye, MoreHorizontal, Star, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const courses = [
  { id: 1, title: 'React Fundamentals',    status: 'published', students: 1240, rating: 4.9, revenue: '$12,400', updated: 'Sep 12', progress: 100, category: 'Development' },
  { id: 2, title: 'Advanced Node.js',      status: 'published', students: 650,  rating: 4.6, revenue: '$6,500',  updated: 'Aug 29', progress: 100, category: 'Development' },
  { id: 3, title: 'TypeScript Mastery',    status: 'draft',     students: 0,    rating: null,revenue: '—',       updated: 'Sep 15', progress: 65,  category: 'Development' },
  { id: 4, title: 'React Native Basics',   status: 'draft',     students: 0,    rating: null,revenue: '—',       updated: 'Sep 16', progress: 30,  category: 'Mobile'      },
  { id: 5, title: 'GraphQL for Developers',status: 'published', students: 320,  rating: 4.8, revenue: '$3,200',  updated: 'Sep 1',  progress: 100, category: 'Backend'     },
]

const statusVariant: Record<string, 'success' | 'warning'> = { published: 'success', draft: 'warning' }

export default function InstructorCourses() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [tab, setTab] = useState('all')
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const navigate = useNavigate()

  const filtered = tab === 'all' ? courses : courses.filter(c => c.status === tab)

  return (
    <div className="space-y-5 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">My Courses</h1>
          <p className="text-sm text-slate-500 mt-0.5">{courses.filter(c => c.status === 'published').length} published · {courses.filter(c => c.status === 'draft').length} drafts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button onClick={() => setView('grid')} className={`p-2 transition-colors ${view === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView('list')} className={`p-2 transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}><List className="w-4 h-4" /></button>
          </div>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/instructor/courses/builder')}>New Course</Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1">
        {['all', 'published', 'draft'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
          >
            {t} ({t === 'all' ? courses.length : courses.filter(c => c.status === t).length})
          </button>
        ))}
      </div>

      {/* Grid view */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
              {/* Thumbnail */}
              <div className="h-36 bg-gradient-to-br from-blue-600 to-indigo-700 relative flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white/30" />
                <div className="absolute top-3 right-3"><Badge variant={statusVariant[c.status]}>{c.status}</Badge></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <button
                    onClick={() => navigate('/instructor/courses/builder')}
                    className="bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow"
                  >
                    <Edit className="w-3.5 h-3.5" />Edit Course
                  </button>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-slate-400 mb-1">{c.category}</p>
                <h3 className="font-semibold text-slate-900 mb-2 leading-snug">{c.title}</h3>

                {c.status === 'draft' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Completion</span><span>{c.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{c.students.toLocaleString()}</span>
                    {c.rating && <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{c.rating}</span>}
                  </div>
                  <span className="font-semibold text-emerald-600">{c.revenue}</span>
                </div>
              </div>
            </div>
          ))}

          {/* New course card */}
          <button
            onClick={() => navigate('/instructor/courses/builder')}
            className="h-[220px] rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all"
          >
            <Plus className="w-8 h-8" />
            <span className="text-sm font-semibold">Create New Course</span>
          </button>
        </div>
      ) : (
        /* List view */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-semibold">Course</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Students</th>
                <th className="text-right px-4 py-3 font-semibold">Rating</th>
                <th className="text-right px-4 py-3 font-semibold">Revenue</th>
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
                      <span className="font-semibold text-slate-900">{c.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><Badge variant={statusVariant[c.status]} dot>{c.status}</Badge></td>
                  <td className="px-4 py-3.5 text-right text-slate-700">{c.students.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right">
                    {c.rating ? <span className="flex items-center justify-end gap-1 font-semibold text-amber-600"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{c.rating}</span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-emerald-600">{c.revenue}</td>
                  <td className="px-4 py-3.5 text-right text-slate-400 text-xs">{c.updated}</td>
                  <td className="pr-4 py-3.5 relative">
                    <button onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenu === c.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-4 top-8 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-36">
                          {[{ icon: <Eye className="w-3.5 h-3.5" />, label: 'Preview' }, { icon: <Edit className="w-3.5 h-3.5" />, label: 'Edit' }, { icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Analytics' }].map(item => (
                            <button key={item.label} onClick={() => setOpenMenu(null)} className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                              <span className="text-slate-400">{item.icon}</span>{item.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
