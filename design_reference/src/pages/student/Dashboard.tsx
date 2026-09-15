import { useNavigate } from 'react-router-dom'
import { Play, BookOpen, Clock, Award, ClipboardList, ChevronRight, CheckCircle } from 'lucide-react'
import ProgressBar from '../../components/ui/ProgressBar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const myCourses = [
  { id: 1, title: 'React Fundamentals', instructor: 'Dr. Marcus Reid', progress: 78, currentLesson: 'useEffect and Side Effects', thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=220&fit=crop&auto=format' },
  { id: 2, title: 'UX Design Mastery', instructor: 'Sarah Kim', progress: 45, currentLesson: 'User Research Methods', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=220&fit=crop&auto=format' },
  { id: 3, title: 'Data Science with Python', instructor: 'Prof. Lin Zhang', progress: 22, currentLesson: 'Pandas DataFrames', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=220&fit=crop&auto=format' },
]

const upcomingAssignments = [
  { title: 'React State Management Analysis', course: 'React Fundamentals', due: 'Sep 18, 2026', status: 'pending' },
  { title: 'User Journey Mapping', course: 'UX Design Mastery', due: 'Sep 20, 2026', status: 'pending' },
  { title: 'Data Visualization Project', course: 'Data Science with Python', due: 'Sep 25, 2026', status: 'not-started' },
]

const recentActivity = [
  { text: 'Completed lesson: React Hooks Overview', time: '2h ago' },
  { text: 'Scored 88% on Quiz: State Management Concepts', time: '5h ago' },
  { text: 'Started new lesson: useEffect Deep Dive', time: 'Yesterday' },
  { text: 'Enrolled in Data Science with Python', time: '3 days ago' },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const primary = myCourses[0]

  return (
    <div className="space-y-6">
      {/* Continue learning hero */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden relative">
        <img src={primary.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative px-6 py-6 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <p className="text-xs font-medium text-blue-400 uppercase tracking-wide mb-1">Continue Learning</p>
            <h2 className="text-xl font-display font-700 text-white mb-1">{primary.title}</h2>
            <p className="text-slate-400 text-sm mb-3">Next: {primary.currentLesson}</p>
            <div className="flex items-center gap-3 mb-4">
              <ProgressBar value={primary.progress} color="bg-blue-500" className="flex-1 max-w-xs" />
              <span className="text-sm text-blue-300 font-medium">{primary.progress}%</span>
            </div>
            <Button icon={<Play className="w-4 h-4 fill-white" />} onClick={() => navigate('/student/learn/1')}>
              Resume Lesson
            </Button>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-center px-4 border-r border-white/20">
              <p className="text-2xl font-display font-700 text-white">3</p>
              <p className="text-xs text-slate-400">Courses</p>
            </div>
            <div className="text-center px-4 border-r border-white/20">
              <p className="text-2xl font-display font-700 text-white">47</p>
              <p className="text-xs text-slate-400">Lessons done</p>
            </div>
            <div className="text-center px-4">
              <p className="text-2xl font-display font-700 text-white">2</p>
              <p className="text-xs text-slate-400">Certificates</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* My courses */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">My Courses</h3>
              <button onClick={() => navigate('/student/courses')} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Browse more <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {myCourses.map(c => (
                <div key={c.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 cursor-pointer" onClick={() => navigate('/student/learn/1')}>
                  <img src={c.thumbnail} alt={c.title} className="w-12 h-9 object-cover rounded-lg bg-slate-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{c.title}</p>
                    <p className="text-xs text-slate-500">{c.instructor}</p>
                    <ProgressBar value={c.progress} className="mt-2" showLabel />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Assignments */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Upcoming Assignments</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingAssignments.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <ClipboardList className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.course}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-500">Due {a.due}</p>
                    <Badge variant={a.status === 'pending' ? 'warning' : 'muted'} className="mt-0.5">{a.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Learning Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Hours this week', value: '12.5 hrs', icon: Clock },
                { label: 'Lessons completed', value: '47 lessons', icon: BookOpen },
                { label: 'Certificates earned', value: '2 certs', icon: Award },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-700">{a.text}</p>
                    <p className="text-xs text-slate-400">{a.time}</p>
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
