import { BookOpen, Users, ClipboardCheck, TrendingUp, Clock, ArrowUpRight, Star } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'

const weeklyEnroll = [
  { w: 'W1', n: 24 }, { w: 'W2', n: 31 }, { w: 'W3', n: 28 },
  { w: 'W4', n: 42 }, { w: 'W5', n: 38 }, { w: 'W6', n: 54 },
]

const progressDist = [
  { r: '0–25%', count: 120 }, { r: '26–50%', count: 95 },
  { r: '51–75%', count: 78 },  { r: '76–99%', count: 64 }, { r: '100%', count: 112 },
]

const pending = [
  { student: 'Alex Johnson',  assignment: 'React State Management Analysis', course: 'React Fundamentals',  sub: '30 min ago' },
  { student: 'Emily Chen',    assignment: 'User Journey Mapping',            course: 'UX Design Mastery',   sub: '2 hrs ago'  },
  { student: 'James Okafor',  assignment: 'Neural Network Implementation',   course: 'ML Basics',           sub: 'Yesterday'  },
]

const myCourses = [
  { title: 'React Fundamentals',     students: 1240, completion: 87, rating: 4.9, status: 'published' },
  { title: 'Advanced Node.js',       students: 650,  completion: 73, rating: 4.7, status: 'published' },
  { title: 'Machine Learning Basics',students: 510,  completion: 68, rating: 4.6, status: 'published' },
  { title: 'Cloud Architecture',     students: 0,    completion: 0,  rating: 0,   status: 'draft' },
]

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-slate-800"><span className="text-slate-500">Enrollments: </span><strong>{payload[0].value}</strong></p>
    </div>
  ) : null

export default function InstructorDashboard() {
  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Welcome banner */}
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl overflow-hidden px-7 py-6">
        <div className="absolute inset-0 hero-mesh pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">Good morning</p>
            <h1 className="font-display text-2xl font-800 text-white leading-tight">Dr. Marcus Reid</h1>
            <p className="text-slate-400 text-sm mt-1">You have <strong className="text-white">3 pending submissions</strong> and <strong className="text-white">54 new enrollments</strong> this week.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/10">
              <p className="text-2xl font-display font-800 text-white">4.8</p>
              <p className="text-xs text-slate-400">Avg rating</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/10">
              <p className="text-2xl font-display font-800 text-white">3,470</p>
              <p className="text-xs text-slate-400">Students</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/10">
              <p className="text-2xl font-display font-800 text-white">81%</p>
              <p className="text-xs text-slate-400">Avg completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Active Courses" value="5" icon={<BookOpen className="w-5 h-5" />} accentBg="bg-blue-50" accentText="text-blue-600" />
        <StatCard title="Total Students" value="3,470" change={6.2} icon={<Users className="w-5 h-5" />} accentBg="bg-violet-50" accentText="text-violet-600" />
        <StatCard title="Avg. Completion" value="81.4%" change={4.1} icon={<TrendingUp className="w-5 h-5" />} accentBg="bg-emerald-50" accentText="text-emerald-600" />
        <StatCard title="Pending Grading" value="12" icon={<ClipboardCheck className="w-5 h-5" />} accentBg="bg-amber-50" accentText="text-amber-600" footer={<span className="text-xs text-amber-500 font-medium">3 overdue</span>} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Weekly Enrollments</h3>
          <p className="text-xs text-slate-400 mb-5">New students across all courses — last 6 weeks</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyEnroll} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="igBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" />
              <XAxis dataKey="w" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="n" stroke="#3B82F6" strokeWidth={2.5} fill="url(#igBlue)" dot={{ r: 3, fill: '#3B82F6', strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Student Progress Distribution</h3>
          <p className="text-xs text-slate-400 mb-5">All enrolled students by completion bracket</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={progressDist} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="r" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #E2E8F0' }} />
              <Bar dataKey="count" name="Students" fill="#8B5CF6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Pending submissions */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Pending Submissions</h3>
              <p className="text-xs text-slate-400">Assignments awaiting your review</p>
            </div>
            <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"><ArrowUpRight className="w-3 h-3" />Grade all</button>
          </div>
          <div className="divide-y divide-slate-100">
            {pending.map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <Avatar name={s.student} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{s.assignment}</p>
                  <p className="text-xs text-slate-400">{s.student} · {s.course}</p>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{s.sub}</span>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors">Grade</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My courses quick view */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">My Courses</h3>
              <p className="text-xs text-slate-400">Quick performance overview</p>
            </div>
            <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"><ArrowUpRight className="w-3 h-3" />Manage</button>
          </div>
          <div className="divide-y divide-slate-100">
            {myCourses.map((c, i) => (
              <div key={i} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{c.title}</p>
                      <Badge variant={c.status === 'published' ? 'success' : 'muted'}>{c.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-500">{c.students.toLocaleString()} students</span>
                      {c.rating > 0 && (
                        <span className="text-xs text-amber-600 flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{c.rating}</span>
                      )}
                    </div>
                  </div>
                  {c.completion > 0 && (
                    <span className="text-sm font-bold text-slate-700 flex-shrink-0">{c.completion}%</span>
                  )}
                </div>
                {c.completion > 0 && (
                  <ProgressBar value={c.completion} color={c.completion >= 80 ? 'bg-emerald-500' : 'bg-blue-500'} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
