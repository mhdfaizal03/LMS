import { Users, BookOpen, GraduationCap, TrendingUp, Award, UserCheck } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'

const enrollmentData = [
  { month: 'Apr', enrollments: 210 }, { month: 'May', enrollments: 280 },
  { month: 'Jun', enrollments: 320 }, { month: 'Jul', enrollments: 390 },
  { month: 'Aug', enrollments: 430 }, { month: 'Sep', enrollments: 510 },
]

const coursePerf = [
  { name: 'React Dev', completions: 89 },
  { name: 'UX Design', completions: 76 },
  { name: 'Data Science', completions: 94 },
  { name: 'Node.js', completions: 68 },
  { name: 'Machine Learning', completions: 71 },
]

const recentEnrollments = [
  { student: 'Alex Johnson', course: 'React Fundamentals', date: 'Today, 9:14 AM', status: 'active' },
  { student: 'Priya Sharma', course: 'UX Design Mastery', date: 'Today, 8:30 AM', status: 'active' },
  { student: 'Carlos Mendez', course: 'Data Science with Python', date: 'Yesterday', status: 'active' },
  { student: 'Emily Chen', course: 'Advanced Node.js', date: 'Yesterday', status: 'pending' },
  { student: 'James Okafor', course: 'Machine Learning Basics', date: '2 days ago', status: 'active' },
]

const topCourses = [
  { title: 'React Fundamentals', instructor: 'Dr. Marcus Reid', students: 1240, completion: 87, category: 'Development' },
  { title: 'UX Design Mastery', instructor: 'Sarah Kim', students: 980, completion: 79, category: 'Design' },
  { title: 'Data Science with Python', instructor: 'Prof. Lin Zhang', students: 870, completion: 91, category: 'Data' },
  { title: 'Advanced Node.js', instructor: 'Tom Whitfield', students: 650, completion: 73, category: 'Development' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="14,280" change={8.2} icon={<Users className="w-5 h-5" />} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Active Courses" value="347" change={12.4} icon={<BookOpen className="w-5 h-5" />} iconBg="bg-violet-50" iconColor="text-violet-600" />
        <StatCard title="Total Enrollments" value="28,940" change={15.1} icon={<GraduationCap className="w-5 h-5" />} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="Completion Rate" value="84.7%" change={3.8} icon={<Award className="w-5 h-5" />} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Enrollment trend */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Enrollment Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly new enrollments — last 6 months</p>
            </div>
            <Badge variant="success">+18% this month</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={enrollmentData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="enrollments" stroke="#2563EB" strokeWidth={2} fill="url(#enrollGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Course completions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Course Completion</h3>
          <p className="text-xs text-slate-500 mb-5">Top courses by completion rate</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={coursePerf} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip formatter={(v) => [`${v}%`, 'Completion']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Bar dataKey="completions" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent enrollments */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Recent Enrollments</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentEnrollments.map((e, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={e.student} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{e.student}</p>
                  <p className="text-xs text-slate-500 truncate">{e.course}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-500">{e.date}</p>
                  <Badge variant={e.status === 'active' ? 'success' : 'warning'} className="mt-0.5">{e.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top courses */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Top Courses</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all</button>
          </div>
          <div className="divide-y divide-slate-100">
            {topCourses.map((c, i) => (
              <div key={i} className="px-5 py-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{c.title}</p>
                    <p className="text-xs text-slate-500">{c.instructor}</p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <Badge variant="muted">{c.category}</Badge>
                    <span className="text-xs text-slate-500">{c.students.toLocaleString()} students</span>
                  </div>
                </div>
                <ProgressBar value={c.completion} showLabel />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
