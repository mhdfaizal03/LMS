import { Download } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Button from '../../components/ui/Button'

const userGrowth = [
  { month: 'Apr', students: 850, instructors: 42 },
  { month: 'May', students: 970, instructors: 48 },
  { month: 'Jun', students: 1120, instructors: 51 },
  { month: 'Jul', students: 1340, instructors: 55 },
  { month: 'Aug', students: 1490, instructors: 58 },
  { month: 'Sep', students: 1680, instructors: 63 },
]

const courseCompletion = [
  { name: 'React Fundamentals', rate: 87 },
  { name: 'UX Design', rate: 79 },
  { name: 'Data Science', rate: 91 },
  { name: 'Node.js', rate: 73 },
  { name: 'ML Basics', rate: 68 },
]

const categoryData = [
  { name: 'Development', value: 42, fill: '#2563EB' },
  { name: 'Design', value: 28, fill: '#7C3AED' },
  { name: 'Data & AI', value: 18, fill: '#059669' },
  { name: 'Business', value: 12, fill: '#D97706' },
]

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Platform Reports</h2>
          <p className="text-sm text-slate-500">Analytics overview — September 2026</p>
        </div>
        <Button variant="outline" icon={<Download className="w-4 h-4" />}>Export Report</Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">User Growth</h3>
          <p className="text-xs text-slate-500 mb-5">New students and instructors per month</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={userGrowth} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Line type="monotone" dataKey="students" stroke="#2563EB" strokeWidth={2} dot={false} name="Students" />
              <Line type="monotone" dataKey="instructors" stroke="#10B981" strokeWidth={2} dot={false} name="Instructors" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Course Completion Rates</h3>
          <p className="text-xs text-slate-500 mb-5">By course — last 30 days</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={courseCompletion} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={110} />
              <Tooltip formatter={(v) => [`${v}%`, 'Completion Rate']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Bar dataKey="rate" fill="#2563EB" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Enrollments by Category</h3>
          <p className="text-xs text-slate-500 mb-5">Distribution of enrollments across departments</p>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {categoryData.map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: c.fill }} />
                  <span className="text-sm text-slate-700 flex-1">{c.name}</span>
                  <span className="text-sm font-medium text-slate-900">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Key Performance Indicators</h3>
          <div className="space-y-4">
            {[
              { label: 'Average course completion time', value: '4.2 weeks', change: '-0.8 weeks vs last quarter' },
              { label: 'Student satisfaction score', value: '4.8 / 5.0', change: '+0.2 vs last quarter' },
              { label: 'Average quiz pass rate', value: '76.4%', change: '+3.1% vs last quarter' },
              { label: 'Instructor response time', value: '< 4 hours', change: 'On target' },
              { label: 'Certificate issuance rate', value: '68.9%', change: '+5.4% vs last quarter' },
            ].map((kpi, i) => (
              <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm text-slate-700">{kpi.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{kpi.change}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900 flex-shrink-0">{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
