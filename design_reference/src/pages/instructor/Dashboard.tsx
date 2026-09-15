import { BookOpen, Users, ClipboardCheck, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'

const enrollmentData = [
  { week: 'W1', enrollments: 24 }, { week: 'W2', enrollments: 31 },
  { week: 'W3', enrollments: 28 }, { week: 'W4', enrollments: 42 },
  { week: 'W5', enrollments: 38 }, { week: 'W6', enrollments: 51 },
]

const progressData = [
  { range: '0-25%', count: 120 }, { range: '26-50%', count: 95 },
  { range: '51-75%', count: 78 }, { range: '76-99%', count: 64 }, { range: '100%', count: 112 },
]

const recentSubmissions = [
  { student: 'Alex Johnson', assignment: 'React State Management Analysis', course: 'React Fundamentals', submitted: '30m ago', status: 'pending' },
  { student: 'Emily Chen', assignment: 'User Journey Mapping', course: 'UX Design Mastery', submitted: '2h ago', status: 'pending' },
  { student: 'Carlos Mendez', assignment: 'Neural Network Implementation', course: 'ML Basics', submitted: 'Yesterday', status: 'graded' },
  { student: 'Priya Sharma', assignment: 'API Design Documentation', course: 'Advanced Node.js', submitted: 'Yesterday', status: 'graded' },
]

export default function InstructorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-700 text-slate-900">Good morning, Dr. Reid 👋</h2>
        <p className="text-sm text-slate-500 mt-0.5">Here&apos;s what&apos;s happening with your courses today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Courses" value="5" icon={<BookOpen className="w-5 h-5" />} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Total Students" value="3,470" change={6.2} icon={<Users className="w-5 h-5" />} iconBg="bg-violet-50" iconColor="text-violet-600" />
        <StatCard title="Avg. Completion" value="81.4%" change={4.1} icon={<TrendingUp className="w-5 h-5" />} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="Pending Grading" value="12" icon={<ClipboardCheck className="w-5 h-5" />} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Weekly Enrollments</h3>
          <p className="text-xs text-slate-500 mb-5">New students across all courses</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={enrollmentData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="iGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="enrollments" stroke="#7C3AED" strokeWidth={2} fill="url(#iGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Student Progress Distribution</h3>
          <p className="text-xs text-slate-500 mb-5">Across all enrolled students</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={progressData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent Submissions</h3>
            <p className="text-xs text-slate-500">Assignments awaiting your review</p>
          </div>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Go to Grading</button>
        </div>
        <div className="divide-y divide-slate-100">
          {recentSubmissions.map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3">
              <Avatar name={s.student} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{s.assignment}</p>
                <p className="text-xs text-slate-500">{s.student} · {s.course}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-slate-400">{s.submitted}</span>
                <Badge variant={s.status === 'pending' ? 'warning' : 'success'}>{s.status}</Badge>
                {s.status === 'pending' && (
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Grade</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My courses quick view */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">My Courses</h3>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all courses</button>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { title: 'React Fundamentals', students: 1240, completion: 87, status: 'published' },
            { title: 'Advanced Node.js', students: 650, completion: 73, status: 'published' },
            { title: 'Machine Learning Basics', students: 510, completion: 68, status: 'published' },
          ].map((c, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-900">{c.title}</p>
                  <Badge variant="success">{c.status}</Badge>
                </div>
                <ProgressBar value={c.completion} showLabel />
              </div>
              <p className="text-xs text-slate-500 flex-shrink-0">{c.students.toLocaleString()} students</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
