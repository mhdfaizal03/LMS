import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, Play, FileText, HelpCircle, X, Menu, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'

const curriculum = [
  { section: 'Getting Started', lessons: [
    { id: 1, title: 'Introduction to React and JSX', type: 'video', done: true },
    { id: 2, title: 'Setting Up Your Environment', type: 'video', done: true },
    { id: 3, title: 'Understanding Components', type: 'text', done: true },
    { id: 4, title: 'Section Quiz', type: 'quiz', done: false, current: false },
  ]},
  { section: 'React Hooks Deep Dive', lessons: [
    { id: 5, title: 'useState and useEffect', type: 'video', done: false, current: true },
    { id: 6, title: 'Custom Hooks and Patterns', type: 'video', done: false },
    { id: 7, title: 'Hooks Assignment', type: 'assignment', done: false },
  ]},
  { section: 'State Management', lessons: [
    { id: 8, title: 'Context API vs Redux', type: 'video', done: false },
    { id: 9, title: 'Global State Patterns', type: 'text', done: false },
  ]},
]

const typeIcon = (t: string, size = 'w-3.5 h-3.5') => {
  if (t === 'video') return <Play className={`${size} text-blue-500`} />
  if (t === 'text') return <FileText className={`${size} text-slate-400`} />
  return <HelpCircle className={`${size} text-violet-500`} />
}

export default function LearningPage() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completed, setCompleted] = useState(false)

  const allLessons = curriculum.flatMap(s => s.lessons)
  const doneCount = allLessons.filter(l => l.done).length
  const progress = Math.round((doneCount / allLessons.length) * 100)

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] bg-slate-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'} transition-all duration-200 bg-slate-800 flex flex-col border-r border-slate-700 flex-shrink-0`}>
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-semibold truncate">React Fundamentals</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <ProgressBar value={progress} color="bg-blue-500" showLabel />
          <p className="text-xs text-slate-400 mt-1">{doneCount} of {allLessons.length} lessons complete</p>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hidden py-2">
          {curriculum.map((section, si) => (
            <div key={si}>
              <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">{section.section}</p>
              {section.lessons.map(lesson => (
                <button key={lesson.id} className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-slate-700 ${lesson.current ? 'bg-slate-700 border-r-2 border-blue-500' : ''}`}>
                  {lesson.done ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-500 flex-shrink-0" />
                  )}
                  {typeIcon(lesson.type)}
                  <span className={`text-xs flex-1 truncate ${lesson.current ? 'text-white font-medium' : lesson.done ? 'text-slate-500' : 'text-slate-300'}`}>
                    {lesson.title}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white">
                <Menu className="w-5 h-5" />
              </button>
            )}
            <button onClick={() => navigate('/student')} className="text-slate-400 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs text-slate-400">React Fundamentals</p>
              <p className="text-sm text-white font-medium">useState and useEffect</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white" icon={<ChevronLeft className="w-4 h-4" />}>Prev</Button>
            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white" iconRight={<ChevronRight className="w-4 h-4" />}>Next</Button>
          </div>
        </div>

        {/* Video player */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="bg-black flex items-center justify-center" style={{ height: 'min(56vw, 450px)' }}>
            <div className="text-center">
              <button className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors mb-3">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </button>
              <p className="text-white/60 text-sm">useState and useEffect Fundamentals</p>
              <p className="text-white/40 text-xs">22:18</p>
            </div>
          </div>

          {/* Video controls */}
          <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-4 border-b border-slate-700">
            <div className="flex-1 h-1 bg-slate-600 rounded-full">
              <div className="w-1/3 h-full bg-blue-500 rounded-full" />
            </div>
            <span className="text-xs text-slate-400 tabular-nums">7:24 / 22:18</span>
            <select className="text-xs text-slate-400 bg-transparent outline-none">
              <option>1× speed</option><option>1.25×</option><option>1.5×</option><option>2×</option>
            </select>
          </div>

          {/* Lesson info */}
          <div className="bg-white flex-1 p-6">
            <h2 className="text-lg font-display font-700 text-slate-900 mb-2">useState and useEffect Fundamentals</h2>
            <p className="text-sm text-slate-500 mb-4">In this lesson you&apos;ll learn how React&apos;s two most essential hooks work, when to use each, and how they interact with the component lifecycle.</p>
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Key Concepts</p>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• useState initializes and updates local component state</li>
                <li>• useEffect synchronizes with external systems and side effects</li>
                <li>• The dependency array controls when effects re-run</li>
                <li>• Cleanup functions prevent memory leaks</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button
                variant={completed ? 'success' : 'primary'}
                icon={completed ? <CheckCircle className="w-4 h-4" /> : undefined}
                onClick={() => setCompleted(!completed)}
              >
                {completed ? 'Completed!' : 'Mark as Complete'}
              </Button>
              <Button variant="outline" iconRight={<ChevronRight className="w-4 h-4" />}>
                Next Lesson
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
