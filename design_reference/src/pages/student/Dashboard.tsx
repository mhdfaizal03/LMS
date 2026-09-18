import { useNavigate } from 'react-router-dom'
import { Play, BookOpen, Clock, Award, ClipboardList, ChevronRight, CheckCircle, Flame, Target } from 'lucide-react'
import ProgressBar from '../../components/ui/ProgressBar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const myCourses = [
  { id: 1, title: 'React Fundamentals',      instructor: 'Dr. Marcus Reid', progress: 78, total: 42, done: 33, thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&h=340&fit=crop&auto=format' },
  { id: 2, title: 'UX Design Mastery',       instructor: 'Sarah Kim',       progress: 45, total: 38, done: 17, thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop&auto=format' },
  { id: 3, title: 'Data Science with Python',instructor: 'Prof. Lin Zhang', progress: 22, total: 54, done: 12, thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&auto=format' },
]

const assignments = [
  { title: 'React State Management Analysis', course: 'React Fundamentals',      due: 'Sep 18', urgent: true  },
  { title: 'User Journey Mapping',            course: 'UX Design Mastery',       due: 'Sep 20', urgent: false },
  { title: 'Data Visualization Project',      course: 'Data Science w/ Python',  due: 'Sep 25', urgent: false },
]

const activity = [
  { icon: '✅', text: 'Completed: React Hooks Overview',              time: '2 hrs ago'  },
  { icon: '📊', text: 'Scored 88% on State Management Quiz',         time: '5 hrs ago'  },
  { icon: '▶️', text: 'Started: useEffect Deep Dive',                time: 'Yesterday'  },
  { icon: '🎓', text: 'Enrolled in Data Science with Python',        time: '3 days ago' },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const primary = myCourses[0]

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Hero — continue learning */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900" style={{ minHeight: 200 }}>
        <img
          src={primary.thumbnail}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.22 }}
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        <div className="relative px-8 py-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
              <Play className="w-3 h-3 fill-blue-400" /> Continue Learning
            </span>
            <h1 className="font-display text-2xl font-800 text-white leading-tight mb-1">{primary.title}</h1>
            <p className="text-slate-400 text-sm mb-4">{primary.instructor} · Lesson {primary.done + 1} of {primary.total}</p>
            <div className="flex items-center gap-3 mb-5 max-w-xs">
              <ProgressBar value={primary.progress} color="bg-blue-500" size="md" />
              <span className="text-blue-300 text-sm font-bold">{primary.progress}%</span>
            </div>
            <Button icon={<Play className="w-4 h-4 fill-white" />} size="lg" onClick={() => navigate('/student/learn/1')}>
              Resume Lesson
            </Button>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3 flex-shrink-0">
            {[
              { icon: <BookOpen className="w-5 h-5" />, val: '3', sub: 'Active courses', color: 'text-blue-400' },
              { icon: <Flame className="w-5 h-5" />,    val: '14', sub: 'Day streak',    color: 'text-orange-400' },
              { icon: <Award className="w-5 h-5" />,    val: '2',  sub: 'Certificates',  color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.sub} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10 text-center min-w-20">
                <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
                <p className="text-white font-display font-800 text-xl leading-none">{s.val}</p>
                <p className="text-slate-400 text-xs mt-1 leading-tight">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: My courses + assignments */}
        <div className="xl:col-span-2 space-y-5">

          {/* My courses */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">My Courses</h3>
              <button onClick={() => navigate('/student/courses')} className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                Browse more <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {myCourses.map(c => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                  onClick={() => navigate('/student/learn/1')}
                >
                  <div className="relative w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                    <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{c.title}</p>
                    <p className="text-xs text-slate-400">{c.instructor} · {c.done}/{c.total} lessons</p>
                    <ProgressBar value={c.progress} className="mt-2" showLabel />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming assignments */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Upcoming Assignments</h3>
              <Badge variant="warning" dot>{assignments.filter(a => a.urgent).length} due soon</Badge>
            </div>
            <div className="divide-y divide-slate-100">
              {assignments.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.urgent ? 'bg-red-50' : 'bg-slate-100'}`}>
                    <ClipboardList className={`w-4 h-4 ${a.urgent ? 'text-red-500' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400">{a.course}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold ${a.urgent ? 'text-red-600' : 'text-slate-500'}`}>Due {a.due}</span>
                    {a.urgent && <Badge variant="error" dot>Urgent</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: stats + activity */}
        <div className="space-y-5">

          {/* Learning goal */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">Weekly Goal</h3>
            </div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-display font-800 text-slate-900">12.5</span>
              <span className="text-sm text-slate-500 mb-1">/ 15 hrs</span>
            </div>
            <ProgressBar value={12.5} max={15} size="md" showLabel />
            <p className="text-xs text-slate-400 mt-2">2.5 hours left to reach your weekly goal</p>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Learning Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Hours this week', value: '12.5h', icon: <Clock className="w-4 h-4" />, bg: 'bg-blue-50', ic: 'text-blue-600' },
                { label: 'Lessons done',    value: '47',   icon: <BookOpen className="w-4 h-4" />, bg: 'bg-violet-50', ic: 'text-violet-600' },
                { label: 'Quiz avg score',  value: '84%',  icon: <Target className="w-4 h-4" />, bg: 'bg-emerald-50', ic: 'text-emerald-600' },
                { label: 'Certificates',    value: '2',    icon: <Award className="w-4 h-4" />, bg: 'bg-amber-50', ic: 'text-amber-600' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                  <div className={s.ic}>{s.icon}</div>
                  <p className="text-lg font-display font-800 text-slate-900 mt-1 leading-none">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-base leading-none mt-0.5 flex-shrink-0">{a.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-slate-700 leading-snug">{a.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
