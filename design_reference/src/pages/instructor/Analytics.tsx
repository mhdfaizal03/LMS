import { TrendingUp, TrendingDown, Users, BookOpen, Star, Award } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const enrollTrend = [
  { m: 'Apr', count: 42 }, { m: 'May', count: 58 }, { m: 'Jun', count: 71 },
  { m: 'Jul', count: 84 }, { m: 'Aug', count: 96 }, { m: 'Sep', count: 112 },
]
const quizScores = [
  { course: 'React Fund.',  avg: 81, pass: 88 },
  { course: 'Node.js',      avg: 74, pass: 72 },
  { course: 'TypeScript',   avg: 88, pass: 94 },
]
const engagementByDay = [
  { day: 'Mon', watch: 3.2 }, { day: 'Tue', watch: 4.1 }, { day: 'Wed', watch: 5.6 },
  { day: 'Thu', watch: 4.8 }, { day: 'Fri', watch: 3.9 }, { day: 'Sat', watch: 2.4 }, { day: 'Sun', watch: 1.8 },
]
const completionByModule = [
  { name: 'Getting Started', value: 96, fill: '#10B981' },
  { name: 'Hooks',           value: 82, fill: '#3B82F6' },
  { name: 'State Mgmt',      value: 71, fill: '#8B5CF6' },
  { name: 'Performance',     value: 58, fill: '#F59E0B' },
]

const kpis = [
  { label: 'Total Students',      value: '2,310', change: '+14%', good: true,  icon: <Users className="w-5 h-5" />,    color: 'text-blue-600',    bg: 'bg-blue-50'    },
  { label: 'Active Courses',      value: '5',     change: '+1',   good: true,  icon: <BookOpen className="w-5 h-5" />, color: 'text-violet-600',  bg: 'bg-violet-50'  },
  { label: 'Avg. Rating',         value: '4.7',   change: '+0.2', good: true,  icon: <Star className="w-5 h-5" />,     color: 'text-amber-600',   bg: 'bg-amber-50'   },
  { label: 'Certificates Issued', value: '184',   change: '+26',  good: true,  icon: <Award className="w-5 h-5" />,    color: 'text-emerald-600', bg: 'bg-emerald-50' },
]

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-semibold text-slate-800">{p.value}</span>
        </div>
      ))}
    </div>
  ) : null

export default function InstructorAnalytics() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <div>
        <h1 className="font-display text-xl font-800 text-slate-900">Instructor Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Performance overview for all your courses — September 2026</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${k.bg} flex items-center justify-center flex-shrink-0 ${k.color}`}>{k.icon}</div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">{k.label}</p>
              <p className="text-xl font-display font-800 text-slate-900 leading-none">{k.value}</p>
              <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${k.good ? 'text-emerald-600' : 'text-red-500'}`}>
                {k.good ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {k.change} this month
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Enrollment trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Enrollment Trend</h3>
          <p className="text-xs text-slate-400 mb-4">New students across all courses — 6 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={enrollTrend} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" name="Students" stroke="#3B82F6" strokeWidth={2.5} fill="url(#enrollGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quiz performance */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Quiz Performance by Course</h3>
              <p className="text-xs text-slate-400">Average score vs. pass rate</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" />Avg Score</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />Pass Rate</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={quizScores} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barGap={4}>
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="course" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
              <Bar dataKey="avg"  name="Avg Score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pass" name="Pass Rate" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly engagement */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Weekly Watch Time (hrs)</h3>
          <p className="text-xs text-slate-400 mb-4">Average hours students spend watching your content</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={engagementByDay} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="watch" name="Watch hrs" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3.5, fill: '#8B5CF6', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Module completion */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Module Completion Rates</h3>
          <p className="text-xs text-slate-400 mb-4">Percentage of students completing each module</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={completionByModule} cx="50%" cy="50%" innerRadius={44} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {completionByModule.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {completionByModule.map(m => (
                <div key={m.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: m.fill }} />
                      <span className="text-xs text-slate-700">{m.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">{m.value}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.fill }} />
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
