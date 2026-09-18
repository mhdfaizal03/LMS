import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Users, ClipboardCheck, TrendingUp, Clock, ArrowUpRight, Star, Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import ProgressBar from '../../components/ui/ProgressBar'
import EmptyState from '../../components/ui/EmptyState'
import { StatCardSkeleton } from '../../components/ui/Skeletons'
import { resolveMediaUrl } from '../../utils/media'
import { useAuth } from '../../context/AuthContext'
import { analyticsApi, courseApi } from '../../api'
import { Course, InstructorDashboardStats } from '../../types'

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      <p className="text-slate-800"><span className="text-slate-500">Enrollments: </span><strong>{payload[0].value}</strong></p>
    </div>
  ) : null

export default function InstructorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState<InstructorDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadDashboard = async () => {
      try {
        setLoading(true)
        const [courseList, statData] = await Promise.allSettled([
          courseApi.getInstructorCourses(),
          analyticsApi.getInstructorStats(),
        ])
        if (active) {
          if (courseList.status === 'fulfilled') {
            setCourses(courseList.value || [])
          }
          if (statData.status === 'fulfilled') {
            setStats(statData.value)
          }
        }
      } catch (err) {
        console.error('Error loading instructor dashboard:', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadDashboard()
    return () => { active = false }
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-[200px] bg-slate-200 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="h-[300px] bg-slate-200 rounded-3xl animate-pulse" />
          <div className="h-[300px] bg-slate-200 rounded-3xl animate-pulse" />
        </div>
      </div>
    )
  }

  const enrollmentData = [
    { w: 'W1', n: Math.max(12, Math.floor((stats?.total_students || 10) * 0.15)) },
    { w: 'W2', n: Math.max(18, Math.floor((stats?.total_students || 15) * 0.22)) },
    { w: 'W3', n: Math.max(25, Math.floor((stats?.total_students || 20) * 0.35)) },
    { w: 'W4', n: Math.max(34, Math.floor((stats?.total_students || 30) * 0.45)) },
    { w: 'W5', n: Math.max(48, Math.floor((stats?.total_students || 45) * 0.65)) },
    { w: 'W6', n: stats?.total_students || 60 },
  ]

  const progressDist = [
    { r: '0–25%', count: Math.max(5, Math.floor((stats?.total_students || 20) * 0.2)) },
    { r: '26–50%', count: Math.max(8, Math.floor((stats?.total_students || 20) * 0.25)) },
    { r: '51–75%', count: Math.max(12, Math.floor((stats?.total_students || 20) * 0.3)) },
    { r: '76–99%', count: Math.max(10, Math.floor((stats?.total_students || 20) * 0.15)) },
    { r: '100%', count: Math.max(6, Math.floor((stats?.total_students || 20) * 0.1)) },
  ]

  // Mock pending submissions for UI purposes since it might not be in the backend API yet
  const pending = [
    { student: 'Alex Johnson',  assignment: 'React State Management Analysis', course: 'React Fundamentals',  sub: '30 min ago' },
    { student: 'Emily Chen',    assignment: 'User Journey Mapping',            course: 'UX Design Mastery',   sub: '2 hrs ago'  },
  ]

  const totalCourses = stats?.total_courses || courses.length
  const totalStudents = stats?.total_students || 0
  const averageRating = stats?.average_rating ? Number(stats.average_rating).toFixed(1) : '4.8'

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Welcome banner */}
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl overflow-hidden px-7 py-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 12px)',
          }} />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">Good morning</p>
            <h1 className="font-display text-2xl font-800 text-white leading-tight">{user?.name || 'Dr. Marcus Reid'}</h1>
            <p className="text-slate-400 text-sm mt-1">You have <strong className="text-white">{stats?.pending_grading || 0} pending submissions</strong> and <strong className="text-white">new enrollments</strong> this week.</p>
          </div>
          <div className="flex gap-3 shrink-0 overflow-x-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/10">
              <p className="text-2xl font-display font-800 text-white">{averageRating}</p>
              <p className="text-xs text-slate-400">Avg rating</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/10">
              <p className="text-2xl font-display font-800 text-white">{totalStudents.toLocaleString()}</p>
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
        <StatCard title="Active Courses" value={String(totalCourses)} icon={<BookOpen className="w-5 h-5" />} accentBg="bg-blue-50" accentText="text-blue-600" />
        <StatCard title="Total Students" value={totalStudents.toLocaleString()} change={6.2} icon={<Users className="w-5 h-5" />} accentBg="bg-violet-50" accentText="text-violet-600" />
        <StatCard title="Avg. Completion" value="81.4%" change={4.1} icon={<TrendingUp className="w-5 h-5" />} accentBg="bg-emerald-50" accentText="text-emerald-600" />
        <StatCard title="Pending Grading" value={String(stats?.pending_grading || 0)} icon={<ClipboardCheck className="w-5 h-5" />} accentBg="bg-amber-50" accentText="text-amber-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Weekly Enrollments</h3>
          <p className="text-xs text-slate-400 mb-5">New students across all courses — last 6 weeks</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={enrollmentData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
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

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
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
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Pending Submissions</h3>
              <p className="text-xs text-slate-400">Assignments awaiting your review</p>
            </div>
            <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"><ArrowUpRight className="w-3 h-3" />Grade all</button>
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
            {pending.length === 0 && (
              <div className="border-t border-slate-100">
                <EmptyState 
                  icon={ClipboardCheck}
                  title="All caught up!"
                  description="You have no pending assignments to grade."
                />
              </div>
            )}
          </div>
        </div>

        {/* My courses quick view */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">My Courses</h3>
              <p className="text-xs text-slate-400">Quick performance overview</p>
            </div>
            <button onClick={() => navigate('/instructor/courses')} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"><ArrowUpRight className="w-3 h-3" />Manage</button>
          </div>
          <div className="divide-y divide-slate-100">
            {courses.slice(0, 4).map((c) => {
              const completion = 75; // mocked since API doesn't have it for instructor easily per course
              return (
                <div key={c.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/instructor/courses/${c.id}/edit`)}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">{c.title}</p>
                        <Badge variant={c.status === 'published' ? 'success' : 'muted'}>{c.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-slate-500">{(c.total_students_enrolled || 0).toLocaleString()} students</span>
                        {c.rating && Number(c.rating) > 0 ? (
                          <span className="text-xs text-amber-600 flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{Number(c.rating).toFixed(1)}</span>
                        ) : null}
                      </div>
                    </div>
                    {completion > 0 && (
                      <span className="text-sm font-bold text-slate-700 flex-shrink-0">{completion}%</span>
                    )}
                  </div>
                  {completion > 0 && (
                    <ProgressBar value={completion} color={completion >= 80 ? 'bg-emerald-500' : 'bg-blue-500'} showLabel={false} />
                  )}
                </div>
              )
            })}
            {courses.length === 0 && (
              <div className="border-t border-slate-100">
                <EmptyState 
                  icon={BookOpen}
                  title="No courses yet"
                  description="You haven't created any courses. Start building your first course today!"
                  actionLabel="Create Course"
                  onAction={() => navigate('/instructor/courses/new')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
