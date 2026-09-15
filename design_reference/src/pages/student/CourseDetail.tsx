import { useNavigate } from 'react-router-dom'
import { Star, Users, Clock, BarChart2, Play, FileText, HelpCircle, CheckCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const curriculum = [
  {
    title: 'Getting Started', lessons: [
      { title: 'Introduction to React and JSX', type: 'video', duration: '14:32', done: true },
      { title: 'Setting Up Your Environment', type: 'video', duration: '8:45', done: true },
      { title: 'Understanding Components', type: 'text', duration: '—', done: true },
      { title: 'Section Quiz', type: 'quiz', duration: '—', done: false },
    ]
  },
  {
    title: 'React Hooks Deep Dive', lessons: [
      { title: 'useState and useEffect', type: 'video', duration: '22:18', done: false },
      { title: 'Custom Hooks and Patterns', type: 'video', duration: '18:40', done: false },
      { title: 'Hooks Assignment', type: 'assignment', duration: '—', done: false },
    ]
  },
  {
    title: 'State Management', lessons: [
      { title: 'Context API vs Redux', type: 'video', duration: '26:12', done: false },
      { title: 'Global State Patterns', type: 'text', duration: '—', done: false },
    ]
  },
]

const typeIcon = (t: string) => {
  if (t === 'video') return <Play className="w-3.5 h-3.5 text-blue-500" />
  if (t === 'text') return <FileText className="w-3.5 h-3.5 text-slate-500" />
  return <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
}

export default function CourseDetail() {
  const navigate = useNavigate()
  const [openSection, setOpenSection] = useState(0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden">
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=300&fit=crop&auto=format" alt="" className="w-full h-48 object-cover opacity-30" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <Badge variant="default" className="mb-2 self-start">Development</Badge>
            <h1 className="text-2xl font-display font-700 text-white mb-1">React Fundamentals</h1>
            <p className="text-slate-300 text-sm">Dr. Marcus Reid · Last updated Sep 2026</p>
          </div>
        </div>
        <div className="px-6 py-4 flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-1.5 text-sm text-slate-300"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="font-semibold text-white">4.9</span><span className="text-slate-400">(340 ratings)</span></div>
          <div className="flex items-center gap-1.5 text-sm text-slate-300"><Users className="w-4 h-4" />1,240 students</div>
          <div className="flex items-center gap-1.5 text-sm text-slate-300"><Clock className="w-4 h-4" />24 hours</div>
          <div className="flex items-center gap-1.5 text-sm text-slate-300"><BarChart2 className="w-4 h-4" />Beginner</div>
          <div className="ml-auto">
            <Button onClick={() => navigate('/student/learn/1')} icon={<Play className="w-4 h-4 fill-white" />}>
              Continue Learning
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* What you'll learn */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">What You&apos;ll Learn</h2>
            <div className="grid grid-cols-2 gap-2">
              {['Build modern React apps with hooks', 'Manage state with Context API', 'Create reusable components', 'Handle forms and validation', 'Fetch data from REST APIs', 'Write clean, maintainable code', 'Deploy React apps to production', 'Debug using React DevTools'].map(l => (
                <div key={l} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{l}
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Course Curriculum</h2>
              <p className="text-xs text-slate-500">3 sections · 9 lessons · 24 hours total</p>
            </div>
            {curriculum.map((s, i) => (
              <div key={i} className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => setOpenSection(openSection === i ? -1 : i)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 text-left"
                >
                  <span className="text-sm font-medium text-slate-900">{s.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{s.lessons.length} lessons</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openSection === i ? '' : '-rotate-90'}`} />
                  </div>
                </button>
                {openSection === i && (
                  <div className="bg-slate-50 divide-y divide-slate-100">
                    {s.lessons.map((l, j) => (
                      <div key={j} className="flex items-center gap-3 px-5 py-2.5">
                        {l.done ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />}
                        {typeIcon(l.type)}
                        <span className={`text-sm flex-1 ${l.done ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{l.title}</span>
                        {l.duration !== '—' && <span className="text-xs text-slate-400">{l.duration}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instructor */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Instructor</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-lg">MR</div>
              <div>
                <p className="font-semibold text-slate-900">Dr. Marcus Reid</p>
                <p className="text-xs text-slate-500">Senior React Engineer</p>
              </div>
            </div>
            <div className="flex gap-3 text-xs text-slate-500">
              <span>⭐ 4.9 rating</span>
              <span>3,470 students</span>
              <span>5 courses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
