import { useState } from 'react'
import { Search, Star, Users, Clock, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const courses = [
  { id: 1, title: 'React Fundamentals', instructor: 'Dr. Marcus Reid', category: 'Development', level: 'Beginner', duration: '24 hrs', students: 1240, rating: 4.9, price: 'Free', thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=220&fit=crop&auto=format', enrolled: true },
  { id: 2, title: 'UX Design Mastery', instructor: 'Sarah Kim', category: 'Design', level: 'Intermediate', duration: '18 hrs', students: 980, rating: 4.8, price: '$49', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=220&fit=crop&auto=format', enrolled: true },
  { id: 3, title: 'Data Science with Python', instructor: 'Prof. Lin Zhang', category: 'Data', level: 'Intermediate', duration: '36 hrs', students: 870, rating: 4.7, price: 'Free', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=220&fit=crop&auto=format', enrolled: true },
  { id: 4, title: 'Advanced Node.js', instructor: 'Tom Whitfield', category: 'Development', level: 'Advanced', duration: '20 hrs', students: 650, rating: 4.6, price: '$39', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=220&fit=crop&auto=format', enrolled: false },
  { id: 5, title: 'Machine Learning Basics', instructor: 'Dr. Ana Ruiz', category: 'AI/ML', level: 'Intermediate', duration: '28 hrs', students: 510, rating: 4.8, price: '$59', thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=220&fit=crop&auto=format', enrolled: false },
  { id: 6, title: 'Product Management Fundamentals', instructor: 'Jessica Park', category: 'Business', level: 'Beginner', duration: '15 hrs', students: 720, rating: 4.5, price: 'Free', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=220&fit=crop&auto=format', enrolled: false },
]

const categories = ['All', 'Development', 'Design', 'Data', 'AI/ML', 'Business']
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

export default function BrowseCourses() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [level, setLevel] = useState('All Levels')
  const navigate = useNavigate()

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase())
    const matchCat = cat === 'All' || c.category === cat
    const matchLevel = level === 'All Levels' || c.level === level
    return matchSearch && matchCat && matchLevel
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Browse Courses</h2>
        <p className="text-sm text-slate-500">Discover new skills and advance your career</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 h-11 bg-white border border-slate-300 rounded-xl px-4">
        <Search className="w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses, instructors..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400" />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${cat === c ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'}`}
          >
            {c}
          </button>
        ))}
        <select value={level} onChange={e => setLevel(e.target.value)} className="h-8 border border-slate-200 rounded-lg px-2 text-sm text-slate-600 bg-white focus:outline-none flex-shrink-0">
          {levels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="text-sm text-slate-500">{filtered.length} courses found</div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all cursor-pointer" onClick={() => navigate(`/student/courses/${c.id}`)}>
            <div className="relative">
              <img src={c.thumbnail} alt={c.title} className="w-full h-44 object-cover bg-slate-100" />
              {c.enrolled && (
                <div className="absolute top-2 left-2">
                  <Badge variant="success">Enrolled</Badge>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${c.price === 'Free' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>{c.price}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="muted">{c.category}</Badge>
                <Badge variant="muted">{c.level}</Badge>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{c.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{c.instructor}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{c.rating}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{c.students.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{c.duration}</span>
              </div>
              {c.enrolled ? (
                <Button size="sm" variant="outline" className="w-full" iconRight={<ChevronRight className="w-3.5 h-3.5" />}
                  onClick={e => { e.stopPropagation(); navigate('/student/learn/1') }}>
                  Continue Learning
                </Button>
              ) : (
                <Button size="sm" className="w-full" onClick={e => { e.stopPropagation() }}>
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
