import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, Play, FileText, HelpCircle, X, Menu, BookOpen, Volume2, Maximize2, Settings, SkipBack, SkipForward, Pause } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ui/ProgressBar'
import Button from '../../components/ui/Button'

const curriculum = [
  { section: 'Getting Started', lessons: [
    { id: 1, title: 'Introduction to React and JSX',      type: 'video', duration: '14:32', done: true },
    { id: 2, title: 'Setting Up Your Environment',        type: 'video', duration: '8:45',  done: true },
    { id: 3, title: 'Understanding Components',           type: 'text',  duration: '—',     done: true },
    { id: 4, title: 'Section 1 Quiz',                     type: 'quiz',  duration: '—',     done: false },
  ]},
  { section: 'React Hooks Deep Dive', lessons: [
    { id: 5, title: 'useState and useEffect Fundamentals',type: 'video', duration: '22:18', done: false, current: true },
    { id: 6, title: 'Custom Hooks and Patterns',          type: 'video', duration: '18:40', done: false },
    { id: 7, title: 'Hooks Best Practices Assignment',    type: 'assignment', duration: '—', done: false },
  ]},
  { section: 'State Management', lessons: [
    { id: 8, title: 'Context API vs Redux',               type: 'video', duration: '26:12', done: false },
    { id: 9, title: 'Global State Design Patterns',       type: 'text',  duration: '—',     done: false },
  ]},
]

const typeIcon = (t: string) => {
  if (t === 'video')      return <Play className="w-3 h-3" />
  if (t === 'text')       return <FileText className="w-3 h-3" />
  if (t === 'quiz')       return <HelpCircle className="w-3 h-3" />
  return                         <FileText className="w-3 h-3" />
}

const all = curriculum.flatMap(s => s.lessons)
const done = all.filter(l => l.done).length

export default function LearningPage() {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [progress] = useState(34)  // video play progress %

  return (
    <div className="-m-6 h-[calc(100vh-3.5rem)] flex bg-[#0D1117]">

      {/* Curriculum sidebar */}
      <div
        className="flex-shrink-0 flex flex-col transition-all duration-200 overflow-hidden"
        style={{ width: sidebar ? 280 : 0, borderRight: sidebar ? '1px solid rgba(255,255,255,0.06)' : 'none', background: '#161B22' }}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-sm font-semibold text-white truncate">React Fundamentals</span>
          </div>
          <button onClick={() => setSidebar(false)} className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">{done} of {all.length} lessons</span>
            <span className="text-blue-400 font-semibold">{Math.round((done / all.length) * 100)}%</span>
          </div>
          <ProgressBar value={done} max={all.length} color="bg-blue-500" size="md" />
        </div>

        {/* Lesson list */}
        <div className="flex-1 overflow-y-auto scrollbar-none py-2">
          {curriculum.map((section, si) => (
            <div key={si}>
              <p className="px-4 pt-3 pb-1.5 text-xs font-bold uppercase tracking-widest text-slate-600">{section.section}</p>
              {section.lessons.map(lesson => (
                <button
                  key={lesson.id}
                  className={[
                    'w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors',
                    lesson.current ? 'bg-blue-600/15 border-r-2 border-blue-500' : 'hover:bg-white/5',
                  ].join(' ')}
                >
                  <div className="flex-shrink-0">
                    {lesson.done
                      ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                      : <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${lesson.current ? 'border-blue-500 bg-blue-600/20' : 'border-slate-600'}`}>
                          {lesson.current && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                        </div>
                    }
                  </div>
                  <span className={`text-xs flex-shrink-0 ${lesson.type === 'video' ? 'text-blue-400' : lesson.type === 'quiz' ? 'text-violet-400' : 'text-slate-500'}`}>
                    {typeIcon(lesson.type)}
                  </span>
                  <span className={`text-xs flex-1 truncate leading-snug ${lesson.current ? 'text-white font-semibold' : lesson.done ? 'text-slate-500' : 'text-slate-300'}`}>
                    {lesson.title}
                  </span>
                  {lesson.duration !== '—' && <span className="text-xs text-slate-600 flex-shrink-0">{lesson.duration}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top navigation */}
        <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ background: '#161B22', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            {!sidebar && (
              <button onClick={() => setSidebar(true)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <Menu className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => navigate('/student')} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div className="hidden md:flex flex-col">
              <span className="text-xs text-slate-500">React Fundamentals · Section 2</span>
              <span className="text-sm font-semibold text-white leading-tight">useState and useEffect Fundamentals</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10" icon={<ChevronLeft className="w-3.5 h-3.5" />}>Prev</Button>
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10" iconRight={<ChevronRight className="w-3.5 h-3.5" />}>Next</Button>
          </div>
        </div>

        {/* Video area */}
        <div className="flex-shrink-0 bg-black flex items-center justify-center relative" style={{ height: 'clamp(180px, 42vw, 440px)' }}>
          {/* Thumbnail / playing state */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!playing ? (
              <div className="text-center">
                <button
                  onClick={() => setPlaying(true)}
                  className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 border border-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 mb-3 backdrop-blur-sm"
                >
                  <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                </button>
                <p className="text-white/70 text-sm font-medium">useState and useEffect Fundamentals</p>
                <p className="text-white/40 text-xs mt-0.5">22:18</p>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => setPlaying(false)}
                  className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
                >
                  <Pause className="w-7 h-7 text-white fill-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Video controls */}
        <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2" style={{ background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button className="text-slate-400 hover:text-white transition-colors"><SkipBack className="w-4 h-4" /></button>
          <button onClick={() => setPlaying(!playing)} className="text-white transition-colors">
            {playing ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
          </button>
          <button className="text-slate-400 hover:text-white transition-colors"><SkipForward className="w-4 h-4" /></button>
          <span className="text-xs text-slate-500 font-mono tabular-nums">7:24</span>
          <div className="flex-1 relative group">
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden cursor-pointer">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="absolute inset-y-0 -top-1 -bottom-1 flex items-center pointer-events-none" style={{ left: `${progress}%` }}>
              <div className="w-3 h-3 bg-blue-500 rounded-full shadow -translate-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">22:18</span>
          <button className="text-slate-400 hover:text-white transition-colors"><Volume2 className="w-4 h-4" /></button>
          <select className="bg-transparent text-xs text-slate-400 hover:text-white border-0 outline-none cursor-pointer appearance-none pr-1">
            <option>1×</option><option>1.25×</option><option>1.5×</option><option>2×</option>
          </select>
          <button className="text-slate-400 hover:text-white transition-colors"><Settings className="w-4 h-4" /></button>
          <button className="text-slate-400 hover:text-white transition-colors"><Maximize2 className="w-4 h-4" /></button>
        </div>

        {/* Lesson content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto px-8 py-8">
            <h2 className="font-display text-xl font-800 text-slate-900 mb-1">useState and useEffect Fundamentals</h2>
            <p className="text-sm text-slate-500 mb-6">React Fundamentals · Section 2 · Lesson 5 of 9</p>

            <p className="text-slate-700 text-sm leading-relaxed mb-5">
              In this lesson you&apos;ll master the two most fundamental React hooks. Understanding how <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono text-xs">useState</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono text-xs">useEffect</code> work — and more importantly, how they interact with React&apos;s rendering cycle — is the foundation of writing effective React applications.
            </p>

            <div className="bg-slate-900 rounded-xl overflow-hidden mb-5">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50">
                <span className="text-xs text-slate-500 font-mono">example.jsx</span>
                <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Copy</button>
              </div>
              <pre className="px-4 py-4 text-xs text-slate-300 leading-relaxed overflow-x-auto font-mono">
{`function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchUser(userId).then(data => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]); // re-runs when userId changes

  if (loading) return <Skeleton />;
  return <div>{user.name}</div>;
}`}
              </pre>
            </div>

            <h3 className="font-semibold text-slate-900 mb-3">Key Takeaways</h3>
            <ul className="space-y-2.5 mb-6">
              {[
                'useState initializes local state and returns the current value plus a setter',
                'useEffect runs after render, synchronizing your component with external systems',
                'The dependency array controls when the effect re-runs — empty means once on mount',
                'Always return a cleanup function to prevent memory leaks with subscriptions or timers',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>

            <div className="flex gap-3 pt-2">
              <Button
                variant={completed ? 'success' : 'primary'}
                icon={completed ? <CheckCircle className="w-4 h-4" /> : undefined}
                onClick={() => setCompleted(!completed)}
              >
                {completed ? 'Marked Complete' : 'Mark as Complete'}
              </Button>
              <Button variant="outline" iconRight={<ChevronRight className="w-4 h-4" />}>Next Lesson</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
