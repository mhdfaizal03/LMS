import { useNavigate } from 'react-router-dom'
import { Star, Users, Clock, BarChart2, Play, FileText, HelpCircle, CheckCircle, ChevronDown, Award, Globe } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'

const curriculum = [
  { title: 'Getting Started', lessons: [
    { title: 'Introduction to React and JSX',      type: 'video', duration: '14:32', free: true,  done: true  },
    { title: 'Setting Up Your Environment',        type: 'video', duration: '8:45',  free: true,  done: true  },
    { title: 'Understanding Components and Props', type: 'text',  duration: '—',     free: false, done: true  },
    { title: 'Section 1 Quiz',                     type: 'quiz',  duration: '—',     free: false, done: false },
  ]},
  { title: 'React Hooks Deep Dive', lessons: [
    { title: 'useState and useEffect Fundamentals',type: 'video', duration: '22:18', free: false, done: false },
    { title: 'Custom Hooks and Patterns',          type: 'video', duration: '18:40', free: false, done: false },
    { title: 'Hooks Best Practices Assignment',    type: 'assignment', duration: '—', free: false, done: false },
  ]},
  { title: 'State Management', lessons: [
    { title: 'Context API vs Redux Toolkit',       type: 'video', duration: '26:12', free: false, done: false },
    { title: 'Global State Design Patterns',       type: 'text',  duration: '—',     free: false, done: false },
  ]},
]

const allLessons = curriculum.flatMap(s => s.lessons)
const doneLessons = allLessons.filter(l => l.done).length

const typeIcon = (t: string) => {
  if (t === 'video') return <Play className="w-3.5 h-3.5 text-blue-500" />
  if (t === 'quiz')  return <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
  return                    <FileText className="w-3.5 h-3.5 text-slate-400" />
}

export default function CourseDetail() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(0)

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">

      {/* Hero */}
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden">
        <img src="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1000&h=340&fit=crop&auto=format" alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-transparent" />
        <div className="relative px-8 py-9">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="default">Development</Badge>
            <Badge variant="muted">Beginner</Badge>
            <Badge variant="success" dot>Enrolled</Badge>
          </div>
          <h1 className="font-display text-3xl font-800 text-white mb-2 leading-tight">React Fundamentals</h1>
          <p className="text-slate-300 text-sm mb-5">Master modern React — hooks, context, state management, and production patterns.</p>
          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-300 mb-6">
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><strong className="text-white">4.9</strong><span className="text-slate-400">(340)</span></span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />1,240 students</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />24 hours</span>
            <span className="flex items-center gap-1.5"><BarChart2 className="w-4 h-4" />Beginner</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" />English</span>
          </div>
          <div className="flex items-center gap-4">
            <Button size="lg" icon={<Play className="w-4 h-4 fill-white" />} onClick={() => navigate('/student/learn/1')}>
              Continue Learning
            </Button>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">Your progress</span>
              <div className="flex items-center gap-2 mt-1">
                <ProgressBar value={doneLessons} max={allLessons.length} color="bg-blue-500" className="w-32" />
                <span className="text-sm font-semibold text-blue-300">{doneLessons}/{allLessons.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* What you'll learn */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-display text-base font-700 text-slate-900 mb-4">What You&apos;ll Learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'Build modern React apps with hooks & context',
                'Manage complex state with patterns that scale',
                'Create fully reusable, composable components',
                'Handle forms, validation, and async data',
                'Fetch data from REST and GraphQL APIs',
                'Write clean, testable, maintainable code',
                'Deploy React apps using Vite and Vercel',
                'Debug effectively with React DevTools',
              ].map(l => (
                <div key={l} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{l}
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-display text-base font-700 text-slate-900">Course Curriculum</h2>
              <p className="text-xs text-slate-400">{curriculum.length} sections · {allLessons.length} lessons · 24 total hours</p>
            </div>
            {curriculum.map((s, i) => (
              <div key={i} className="border-b border-slate-100 last:border-0">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{s.title}</p>
                    <p className="text-xs text-slate-400">{s.lessons.length} lessons · {s.lessons.filter(l => l.done).length} completed</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open === i ? '' : '-rotate-90'}`} />
                </button>
                {open === i && (
                  <div className="bg-slate-50 divide-y divide-slate-100">
                    {s.lessons.map((l, j) => (
                      <div key={j} className="flex items-center gap-3 px-5 py-2.5">
                        {l.done
                          ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          : <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                        }
                        {typeIcon(l.type)}
                        <span className={`text-sm flex-1 ${l.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{l.title}</span>
                        {l.free && <Badge variant="success">Free preview</Badge>}
                        {l.duration !== '—' && <span className="text-xs text-slate-400 tabular-nums">{l.duration}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-display text-sm font-700 text-slate-900 mb-4">Instructor</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">MR</div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Dr. Marcus Reid</p>
                <p className="text-xs text-slate-500">Senior React Engineer</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 rounded-lg p-2"><p className="font-bold text-slate-900">4.9</p><p className="text-slate-400">Rating</p></div>
              <div className="bg-slate-50 rounded-lg p-2"><p className="font-bold text-slate-900">3,470</p><p className="text-slate-400">Students</p></div>
              <div className="bg-slate-50 rounded-lg p-2"><p className="font-bold text-slate-900">5</p><p className="text-slate-400">Courses</p></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-display text-sm font-700 text-slate-900 mb-3">Course Includes</h3>
            <div className="space-y-2.5 text-sm text-slate-600">
              {[
                { icon: <Clock className="w-4 h-4 text-slate-400" />, text: '24 hours of video content' },
                { icon: <FileText className="w-4 h-4 text-slate-400" />, text: '12 text-based lessons' },
                { icon: <HelpCircle className="w-4 h-4 text-slate-400" />, text: '6 quizzes with instant feedback' },
                { icon: <Award className="w-4 h-4 text-slate-400" />, text: 'Certificate of completion' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">{item.icon}{item.text}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
