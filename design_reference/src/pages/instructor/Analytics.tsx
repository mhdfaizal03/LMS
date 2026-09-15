import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const enrollData = [
  { month: 'Apr', count: 42 }, { month: 'May', count: 58 }, { month: 'Jun', count: 71 },
  { month: 'Jul', count: 84 }, { month: 'Aug', count: 96 }, { month: 'Sep', count: 112 },
]
const quizData = [
  { name: 'React Fundamentals', avg: 81 },
  { name: 'Advanced Node.js', avg: 76 },
  { name: 'ML Basics', avg: 72 },
]

export default function InstructorAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Course Analytics</h2>
        <p className="text-sm text-slate-500">Performance metrics across all your courses</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: '3,470' },
          { label: 'Avg. Completion', value: '81.4%' },
          { label: 'Quiz Pass Rate', value: '76.3%' },
          { label: 'Avg. Rating', value: '4.8 / 5' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-2xl font-display font-700 text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-5">Enrollment Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={enrollData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} fill="url(#aGrad)" name="New enrollments" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-5">Average Quiz Scores by Course</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={quizData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={130} />
              <Tooltip formatter={(v) => [`${v}%`, 'Avg Score']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
              <Bar dataKey="avg" fill="#7C3AED" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
