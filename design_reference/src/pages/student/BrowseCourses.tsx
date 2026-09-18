import { useState } from 'react'
import { Search, Star, Users, Clock, BarChart2, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const courses = [
  { id: 1, title: 'React Fundamentals',             instructor: 'Dr. Marcus Reid', category: 'Development', level: 'Beginner',     duration: '24 hrs', students: 1240, rating: 4.9, reviews: 340, price: 'Free',  thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=480&h=270&fit=crop&auto=format', enrolled: true  },
  { id: 2, title: 'UX Design Mastery',              instructor: 'Sarah Kim',        category: 'Design',       level: 'Intermediate', duration: '18 hrs', students: 980,  rating: 4.8, reviews: 212, price: '$49',   thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=480&h=270&fit=crop&auto=format', enrolled: true  },
  { id: 3, title: 'Data Science with Python',       instructor: 'Prof. Lin Zhang',  category: 'Data',         level: 'Intermediate', duration: '36 hrs', students: 870,  rating: 4.7, reviews: 185, price: 'Free',  thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&h=270&fit=crop&auto=format', enrolled: true  },
  { id: 4, title: 'Advanced Node.js',               instructor: 'Tom Whitfield',    category: 'Development', level: 'Advanced',     duration: '20 hrs', students: 650,  rating: 4.6, reviews: 134, price: '$39',   thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=480&h=270&fit=crop&auto=format', enrolled: false },
  { id: 5, title: 'Machine Learning Basics',        instructor: 'Dr. Ana Ruiz',     category: 'AI/ML',        level: 'Intermediate', duration: '28 hrs', students: 510,  rating: 4.8, reviews: 98,  price: '$59',   thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=480&h=270&fit=crop&auto=format', enrolled: false },
  { id: 6, title: 'Product Management Essentials',  instructor: 'Jessica Park',     category: 'Business',     level: 'Beginner',     duration: '15 hrs', students: 720,  rating: 4.5, reviews: 167, price: 'Free',  thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=480&h=270&fit=crop&auto=format', enrolled: false },
  { id: 7, title: 'TypeScript Deep Dive',           instructor: 'Dr. Marcus Reid',  category: 'Development', level: 'Advanced',     duration: '22 hrs', students: 430,  rating: 4.9, reviews: 76,  price: '$45',   thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=480&h=270&fit=crop&auto=format', enrolled: false },
  { id: 8, title: 'Cloud Architecture with AWS',    instructor: 'Mark Stevens',     category: 'DevOps',       level: 'Advanced',     duration: '30 hrs', students: 380,  rating: 4.7, reviews: 89,  price: '$79',   thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=480&h=270&fit=crop&auto=format', enrolled: false },
]

const categories = ['All', 'Development', 'Design', 'Data', 'AI/ML', 'Business', 'DevOps']
const levels     = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const catVariant: Record<string, any> = { Development: 'default', Design: 'violet', Data: 'success', 'AI/ML': 'info', Business: 'warning', DevOps: 'muted' }

export default function BrowseCourses() {
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState('All')
  const [level, setLevel]     = useState('All Levels')
  const [showFree, setShowFree] = useState(false)
  const navigate = useNavigate()

  const filtered = courses.filter(c => {
    const q = search.toLowerCase()
    return (
      (c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q)) &&
      (cat === 'All'        || c.category === cat) &&
      (level === 'All Levels' || c.level === level) &&
      (!showFree            || c.price === 'Free')
    )
  })

  return (
    <div className="space-y-6 max-w-[1400px]">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">Browse Courses</h1>
          <p className="text-sm text-slate-500 mt-0.5">Discover new skills and advance your career</p>
        </div>
        <Badge variant="muted" className="mt-1">{filtered.length} courses</Badge>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 h-11 bg-white border border-slate-300 rounded-xl px-4 shadow-sm hover:border-slate-400 transition-colors">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses and instructors…" className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400" />
          <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${cat === c ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'}`}>
              {c}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <select value={level} onChange={e => setLevel(e.target.value)} className="h-8 px-3 border border-slate-200 rounded-xl text-xs text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-semibold">
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <label className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer select-none">
              <input type="checkbox" checked={showFree} onChange={e => setShowFree(e.target.checked)} className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              Free only
            </label>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filtered.map(c => (
          <article
            key={c.id}
            onClick={() => navigate(`/student/courses/${c.id}`)}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group"
          >
            <div className="relative overflow-hidden" style={{ height: 160 }}>
              <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 bg-slate-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {c.enrolled && (
                <div className="absolute top-2.5 left-2.5">
                  <Badge variant="success" dot>Enrolled</Badge>
                </div>
              )}
              <div className="absolute top-2.5 right-2.5">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${c.price === 'Free' ? 'bg-emerald-500 text-white' : 'bg-slate-900/90 text-white backdrop-blur-sm'}`}>
                  {c.price}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Badge variant={catVariant[c.category]}>{c.category}</Badge>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">{c.level}</span>
              </div>
              <h3 className="font-semibold text-slate-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors">{c.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{c.instructor}</p>

              <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-700">{c.rating}</span>
                  <span className="text-slate-400">({c.reviews})</span>
                </span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.students.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration}</span>
              </div>

              {c.enrolled ? (
                <button
                  onClick={e => { e.stopPropagation(); navigate('/student/learn/1') }}
                  className="w-full h-8 border border-blue-300 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                >
                  Continue Learning <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={e => e.stopPropagation()}
                  className="w-full h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Enroll Now
                </button>
              )}
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
            <BarChart2 className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-medium text-slate-600">No courses found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
