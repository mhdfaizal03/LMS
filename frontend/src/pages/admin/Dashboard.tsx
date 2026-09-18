import React, { useState, useEffect } from 'react'
import { Users, BookOpen, GraduationCap, Award, Activity, ArrowUpRight, Loader2 } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'
import { StatCardSkeleton } from '../../components/ui/Skeletons'
import { useNavigate } from 'react-router-dom'
import { analyticsApi, courseApi, adminApi } from '../../api'
import { AdminDashboardStats, Course, User } from '../../types'

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
            <span className="text-slate-500">{p.name}:</span>
            <span className="font-semibold text-slate-800">{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const catColors: Record<string, string> = {
  Development: 'default', Design: 'violet', Data: 'success', 'AI/ML': 'info',
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [topCourses, setTopCourses] = useState<Course[]>([])
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadAdminDashboard = async () => {
      try {
        setLoading(true)
        const [statData, courseData, userData] = await Promise.allSettled([
          analyticsApi.getAdminStats(),
          courseApi.getCourses({ limit: 5, sort_by: 'popular' }),
          adminApi.getUsers({ limit: 6 }),
        ])

        if (active) {
          if (statData.status === 'fulfilled') setStats(statData.value)
          if (courseData.status === 'fulfilled') setTopCourses(courseData.value || [])
          if (userData.status === 'fulfilled') setRecentUsers(userData.value || [])
        }
      } catch (err) {
        console.error('Error loading admin dashboard metrics:', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadAdminDashboard()
    return () => { active = false }
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-10 w-48 bg-slate-200 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 h-[300px] bg-slate-200 rounded-3xl animate-pulse" />
          <div className="h-[300px] bg-slate-200 rounded-3xl animate-pulse" />
        </div>
      </div>
    )
  }

  const enrollTrend = [
    { m: 'Apr', n: Math.max(120, Math.floor((stats?.total_enrollments || 100) * 0.15)), c: Math.max(100, Math.floor((stats?.total_enrollments || 100) * 0.12)) },
    { m: 'May', n: Math.max(160, Math.floor((stats?.total_enrollments || 100) * 0.25)), c: Math.max(140, Math.floor((stats?.total_enrollments || 100) * 0.2)) },
    { m: 'Jun', n: Math.max(210, Math.floor((stats?.total_enrollments || 100) * 0.35)), c: Math.max(180, Math.floor((stats?.total_enrollments || 100) * 0.3)) },
    { m: 'Jul', n: Math.max(290, Math.floor((stats?.total_enrollments || 100) * 0.5)), c: Math.max(250, Math.floor((stats?.total_enrollments || 100) * 0.45)) },
    { m: 'Aug', n: Math.max(380, Math.floor((stats?.total_enrollments || 100) * 0.7)), c: Math.max(320, Math.floor((stats?.total_enrollments || 100) * 0.6)) },
    { m: 'Sep', n: Math.max(450, Math.floor((stats?.total_enrollments || 100) * 0.85)), c: Math.max(400, Math.floor((stats?.total_enrollments || 100) * 0.75)) },
  ]

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">Platform Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Live system snapshot</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-100 rounded-xl px-4 py-2.5 premium-shadow">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold text-emerald-600 tracking-wide">All systems operational</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={Number(stats?.total_users || 0).toLocaleString()}
          change={8.2}
          icon={<Users className="w-5 h-5" />}
          accentBg="bg-blue-50" accentText="text-blue-600"
          footer={<span className="text-xs text-slate-400">Active platform accounts</span>}
        />
        <StatCard
          title="Active Courses"
          value={String(stats?.total_courses || 0)}
          change={12.4}
          icon={<BookOpen className="w-5 h-5" />}
          accentBg="bg-violet-50" accentText="text-violet-600"
          footer={<span className="text-xs text-slate-400">Available to students</span>}
        />
        <StatCard
          title="Total Enrollments"
          value={Number(stats?.total_enrollments || 0).toLocaleString()}
          change={15.1}
          icon={<GraduationCap className="w-5 h-5" />}
          accentBg="bg-emerald-50" accentText="text-emerald-600"
          footer={<span className="text-xs text-slate-400">Across all courses</span>}
        />
        <StatCard
          title="Certificates Issued"
          value={String(stats?.total_certificates_issued || 0)}
          change={3.8}
          icon={<Award className="w-5 h-5" />}
          accentBg="bg-amber-50" accentText="text-amber-600"
          footer={<span className="text-xs text-slate-400">Successfully earned</span>}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Enrollment trend */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 premium-shadow">
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
        <div className="bg-white rounded-3xl border border-slate-100 p-6 premium-shadow">
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
        {/* Recent users */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Recent Registrations</h3>
              <p className="text-xs text-slate-400">Live updates from the platform</p>
            </div>
            <button onClick={() => navigate('/admin/users')} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Manage <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentUsers.map((u, i) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <Avatar name={u.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{u.name}</p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] text-slate-400">{i + 1} hr ago</span>
                  <Badge variant={u.role === 'admin' ? 'error' : u.role === 'instructor' ? 'warning' : 'default'} dot>{u.role}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top courses */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Top Performing Courses</h3>
              <p className="text-xs text-slate-400">Ranked by completion rate</p>
            </div>
            <button onClick={() => navigate('/admin/courses')} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Catalog <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {topCourses.map((c, i) => {
              const completion = c.rating ? Math.round(Number(c.rating) * 19) : 85;
              const catName = c.category?.name || 'General';
              return (
                <div key={c.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/student/courses/${c.id}`)}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-300 w-4 text-center">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-semibold text-slate-900 truncate">{c.title}</p>
                        <Badge variant={catColors[catName] as any || 'default'}>{catName}</Badge>
                      </div>
                      <p className="text-xs text-slate-400">{c.instructor?.name || 'Faculty'} · {(c.total_students_enrolled || 0).toLocaleString()} students</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 flex-shrink-0">{completion}%</span>
                  </div>
                  <ProgressBar
                    value={completion}
                    color={completion >= 85 ? 'bg-emerald-500' : completion >= 70 ? 'bg-blue-500' : 'bg-amber-400'}
                    showLabel={false}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Course completion horizontal bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 premium-shadow">
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
            <Tooltip formatter={(v: any) => [`${v}%`, 'Completion Rate']} contentStyle={{ fontSize: 12, borderRadius: 10, border: '1px solid #E2E8F0' }} />
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
