import React from 'react'
import { Download, TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Button from '../../components/ui/Button'

const userGrowth = [
  { m: 'Apr', students: 8400, instructors: 42 }, { m: 'May', students: 9700, instructors: 48 },
  { m: 'Jun', students: 11200, instructors: 51 }, { m: 'Jul', students: 12800, instructors: 55 },
  { m: 'Aug', students: 13500, instructors: 59 }, { m: 'Sep', students: 14280, instructors: 63 },
]

const completionRates = [
  { name: 'React Fundamentals', rate: 87, students: 1240 },
  { name: 'Data Science',       rate: 91, students: 870  },
  { name: 'UX Design Mastery',  rate: 79, students: 980  },
  { name: 'Advanced Node.js',   rate: 73, students: 650  },
  { name: 'ML Basics',          rate: 68, students: 510  },
]

const catDist = [
  { name: 'Development', value: 42, fill: '#3B82F6' },
  { name: 'Design',      value: 28, fill: '#8B5CF6' },
  { name: 'Data & AI',   value: 18, fill: '#10B981' },
  { name: 'Business',    value: 12, fill: '#F59E0B' },
]

const kpis = [
  { label: 'Average completion time',      value: '4.2 weeks', trend: -0.8, unit: 'wk vs last qtr', good: true  },
  { label: 'Student satisfaction (NPS)',   value: '78',        trend: +6,   unit: 'pts vs last qtr', good: true  },
  { label: 'Average quiz pass rate',       value: '76.4%',     trend: +3.1, unit: '% vs last qtr',  good: true  },
  { label: 'Instructor response time',     value: '< 4 hrs',   trend: -1.2, unit: 'hr vs last qtr', good: true  },
  { label: 'Certificate issuance rate',    value: '68.9%',     trend: +5.4, unit: '% vs last qtr',  good: true  },
  { label: 'Monthly revenue',              value: '$48,320',   trend: +22.1, unit: '% vs last qtr', good: true  },
]

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-semibold text-slate-800">{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  ) : null

export default function AdminReports() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">Platform performance — September 2026</p>
        </div>
        <div className="flex gap-2">
          <select className="h-9 px-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 6 months</option><option>Last 3 months</option><option>This year</option>
          </select>
          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={() => window.print()}>Export PDF</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-500 mb-1 leading-tight">{kpi.label}</p>
            <p className="text-xl font-display font-800 text-slate-900 mb-1">{kpi.value}</p>
            <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.good ? 'text-emerald-600' : 'text-red-500'}`}>
              {kpi.good ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.trend > 0 ? '+' : ''}{kpi.trend} {kpi.unit}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* User growth */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Total User Growth</h3>
              <p className="text-xs text-slate-400">Students and instructors — last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" />Students</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Instructors</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={userGrowth} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="students"    stroke="#3B82F6" strokeWidth={2.5} dot={false} name="Students" />
              <Line type="monotone" dataKey="instructors" stroke="#10B981" strokeWidth={2}   dot={false} name="Instructors" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Course completion */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">Course Completion Rates</h3>
            <p className="text-xs text-slate-400">Top courses — completion vs enrollment</p>
          </div>
          <div className="space-y-3">
            {completionRates.map(c => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-700">{c.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{c.students.toLocaleString()} students</span>
                    <span className="text-xs font-bold text-slate-900 w-8 text-right">{c.rate}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${c.rate}%`, background: c.rate >= 85 ? '#10B981' : c.rate >= 75 ? '#3B82F6' : '#F59E0B' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">Enrollments by Category</h3>
            <p className="text-xs text-slate-400">Distribution across all active courses</p>
          </div>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={catDist} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {catDist.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {catDist.map(c => (
                <div key={c.name} className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: c.fill }} />
                  <span className="text-sm text-slate-700 flex-1">{c.name}</span>
                  <span className="text-sm font-bold text-slate-900">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enrollments per month */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">Monthly Enrollments vs Completions</h3>
            <p className="text-xs text-slate-400">New enrollments and completed courses</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { m: 'Apr', enroll: 210, complete: 166 }, { m: 'May', enroll: 285, complete: 214 },
                { m: 'Jun', enroll: 340, complete: 280 }, { m: 'Jul', enroll: 398, complete: 331 },
                { m: 'Aug', enroll: 460, complete: 390 }, { m: 'Sep', enroll: 524, complete: 431 },
              ]}
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
              <Bar dataKey="enroll"   name="Enrolled"   fill="#BFDBFE" radius={[4, 4, 0, 0]} />
              <Bar dataKey="complete" name="Completed"  fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
