import { Users, BookOpen, GraduationCap, Award, Activity, Clock, ArrowUpRight } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'

const enrollTrend = [
  { m: 'Apr', n: 210, c: 182 },
  { m: 'May', n: 285, c: 234 },
  { m: 'Jun', n: 340, c: 290 },
  { m: 'Jul', n: 398, c: 352 },
  { m: 'Aug', n: 460, c: 401 },
  { m: 'Sep', n: 524, c: 458 },
]

const completionData = [
  { name: 'React Dev',   rate: 89 },
  { name: 'UX Design',   rate: 76 },
  { name: 'Data Sci',    rate: 94 },
  { name: 'Node.js',     rate: 68 },
  { name: 'ML Basics',   rate: 71 },
]

const activityData = [
  { day: 'Mon', logins: 820 }, { day: 'Tue', logins: 950 },
  { day: 'Wed', logins: 1100 }, { day: 'Thu', logins: 980 },
  { day: 'Fri', logins: 870 }, { day: 'Sat', logins: 540 },
  { day: 'Sun', logins: 620 },
]

const recentEnroll = [
  { student: 'Alex Johnson',  course: 'React Fundamentals',      time: '9 min ago',  status: 'active' },
  { student: 'Priya Sharma',  course: 'UX Design Mastery',       time: '34 min ago', status: 'active' },
  { student: 'Carlos Mendez', course: 'Data Science w/ Python',  time: '1 hr ago',   status: 'active' },
  { student: 'Emily Chen',    course: 'Advanced Node.js',        time: '2 hrs ago',  status: 'pending' },
  { student: 'James Okafor',  course: 'Machine Learning Basics', time: '3 hrs ago',  status: 'active' },
  { student: 'Sofia Martinez',course: 'React Fundamentals',      time: '5 hrs ago',  status: 'active' },
]

const topCourses = [
  { title: 'React Fundamentals',     instructor: 'Dr. Marcus Reid',  students: 1240, completion: 87, cat: 'Development' },
  { title: 'UX Design Mastery',      instructor: 'Sarah Kim',        students: 980,  completion: 79, cat: 'Design' },
  { title: 'Data Science w/ Python', instructor: 'Prof. Lin Zhang',  students: 870,  completion: 91, cat: 'Data' },
  { title: 'Advanced Node.js',       instructor: 'Tom Whitfield',    students: 650,  completion: 73, cat: 'Development' },
  { title: 'ML Basics',              instructor: 'Dr. Ana Ruiz',     students: 510,  completion: 68, cat: 'AI/ML' },
]

const catColors: Record<string, string> = {
  Development: 'default', Design: 'violet', Data: 'success', 'AI/ML': 'info',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-500">{p.name}:</span>
            <span className="font-semibold text-slate-800">{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">Platform Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">September 2026 — live snapshot</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-2">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-medium text-emerald-600">All systems operational</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value="14,280"
          change={8.2}
          icon={<Users className="w-5 h-5" />}
          accentBg="bg-blue-50" accentText="text-blue-600"
          footer={<span className="text-xs text-slate-400">9,840 students · 247 instructors</span>}
        />
        <StatCard
          title="Active Courses"
          value="347"
          change={12.4}
          icon={<BookOpen className="w-5 h-5" />}
          accentBg="bg-violet-50" accentText="text-violet-600"
          footer={<span className="text-xs text-slate-400">301 published · 46 drafts</span>}
        />
        <StatCard
          title="Total Enrollments"
          value="28,940"
          change={15.1}
          icon={<GraduationCap className="w-5 h-5" />}
          accentBg="bg-emerald-50" accentText="text-emerald-600"
          footer={<span className="text-xs text-slate-400">+2,380 this month</span>}
        />
        <StatCard
          title="Completion Rate"
          value="84.7%"
          change={3.8}
          icon={<Award className="w-5 h-5" />}
          accentBg="bg-amber-50" accentText="text-amber-600"
          footer={<span className="text-xs text-slate-400">24,483 completed courses</span>}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Enrollment trend */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Enrollment Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">New vs. continuing enrollments — last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" />New</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-violet-400" />Continuing</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={enrollTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCont" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="n" name="New" stroke="#3B82F6" strokeWidth={2.5} fill="url(#gNew)" dot={false} />
              <Area type="monotone" dataKey="c" name="Continuing" stroke="#8B5CF6" strokeWidth={2} fill="url(#gCont)" dot={false} strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily logins */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">Weekly Activity</h3>
            <p className="text-xs text-slate-400 mt-0.5">Daily active users this week</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={activityData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
              <Bar dataKey="logins" name="Logins" fill="#3B82F6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Recent enrollments */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Recent Enrollments</h3>
              <p className="text-xs text-slate-400">Live updates</p>
            </div>
            <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentEnroll.map((e, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <Avatar name={e.student} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{e.student}</p>
                  <p className="text-xs text-slate-400 truncate">{e.course}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-slate-400">{e.time}</span>
                  <Badge variant={e.status === 'active' ? 'success' : 'warning'} dot>{e.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top courses */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Top Performing Courses</h3>
              <p className="text-xs text-slate-400">Ranked by completion rate</p>
            </div>
            <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              All courses <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {topCourses.map((c, i) => (
              <div key={i} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-300 w-4 text-center">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-slate-900 truncate">{c.title}</p>
                      <Badge variant={catColors[c.cat] as any}>{c.cat}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{c.instructor} · {c.students.toLocaleString()} students</p>
                  </div>
                  <span className="text-sm font-bold text-slate-900 flex-shrink-0">{c.completion}%</span>
                </div>
                <ProgressBar
                  value={c.completion}
                  color={c.completion >= 85 ? 'bg-emerald-500' : c.completion >= 70 ? 'bg-blue-500' : 'bg-amber-400'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course completion horizontal bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Course Completion by Category</h3>
            <p className="text-xs text-slate-400 mt-0.5">Average completion rate across all active courses</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={completionData} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 4 }}>
            <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#F1F5F9" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }} axisLine={false} tickLine={false} width={90} />
            <Tooltip formatter={(v) => [`${v}%`, 'Completion Rate']} contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #E2E8F0' }} />
            <Bar dataKey="rate" radius={[0, 6, 6, 0]} label={{ position: 'right', formatter: (v: unknown) => `${v}%`, fontSize: 11, fill: '#64748B', fontWeight: 600 }}>
              {completionData.map((entry, i) => (
                <rect key={i} fill={entry.rate >= 85 ? '#10B981' : entry.rate >= 75 ? '#3B82F6' : '#F59E0B'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
