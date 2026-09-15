import { useState } from 'react'
import { Plus, LayoutGrid, List, BookOpen, Users, Edit, Eye, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'

const courses = [
  { id: 1, title: 'React Fundamentals', description: 'Master React with hooks, context, and modern patterns.', students: 1240, sections: 8, lessons: 42, completion: 87, status: 'published', updated: 'Sep 8, 2026', thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=220&fit=crop&auto=format' },
  { id: 2, title: 'Advanced Node.js', description: 'Build scalable APIs with Node, Express, and PostgreSQL.', students: 650, sections: 6, lessons: 32, completion: 73, status: 'published', updated: 'Sep 5, 2026', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=220&fit=crop&auto=format' },
  { id: 3, title: 'Machine Learning Basics', description: 'Introduction to supervised and unsupervised learning.', students: 510, sections: 7, lessons: 38, completion: 68, status: 'published', updated: 'Sep 1, 2026', thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=220&fit=crop&auto=format' },
  { id: 4, title: 'Cloud Architecture with AWS', description: 'Design resilient cloud systems using AWS services.', students: 0, sections: 3, lessons: 14, completion: 0, status: 'draft', updated: 'Sep 10, 2026', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=220&fit=crop&auto=format' },
  { id: 5, title: 'TypeScript Deep Dive', description: 'Advanced TypeScript patterns and type system mastery.', students: 0, sections: 1, lessons: 5, completion: 0, status: 'draft', updated: 'Sep 12, 2026', thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=220&fit=crop&auto=format' },
]

const statusBadge: Record<string, 'success' | 'muted'> = { published: 'success', draft: 'muted' }

export default function InstructorCourses() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  const filtered = courses.filter(c => filter === 'all' || c.status === filter)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">My Courses</h2>
          <p className="text-sm text-slate-500">{courses.length} courses</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/instructor/courses/builder')}>Create Course</Button>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'published', 'draft'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 text-xs opacity-70">{f === 'all' ? courses.length : courses.filter(c => c.status === f).length}</span>
          </button>
        ))}
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all">
              <div className="relative">
                <img src={c.thumbnail} alt={c.title} className="w-full h-40 object-cover bg-slate-100" />
                <div className="absolute top-2 right-2">
                  <Badge variant={statusBadge[c.status]}>{c.status}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1">{c.title}</h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{c.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{c.students.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{c.lessons} lessons</span>
                </div>
                {c.status === 'published' && <ProgressBar value={c.completion} showLabel className="mb-3" />}
                <div className="flex items-center gap-2 pt-1">
                  <Button size="sm" variant="outline" icon={<Edit className="w-3.5 h-3.5" />} onClick={() => navigate('/instructor/courses/builder')}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" icon={<Eye className="w-3.5 h-3.5" />}>Preview</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {filtered.map(c => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
              <img src={c.thumbnail} alt={c.title} className="w-14 h-10 object-cover rounded-lg bg-slate-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900">{c.title}</p>
                  <Badge variant={statusBadge[c.status]}>{c.status}</Badge>
                </div>
                <p className="text-xs text-slate-500">{c.sections} sections · {c.lessons} lessons · {c.students.toLocaleString()} students</p>
              </div>
              <div className="hidden md:block w-32">
                {c.status === 'published' && <ProgressBar value={c.completion} showLabel />}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" icon={<Edit className="w-3.5 h-3.5" />} onClick={() => navigate('/instructor/courses/builder')}>Edit</Button>
                <button className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100"><MoreHorizontal className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
