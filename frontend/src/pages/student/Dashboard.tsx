import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, BookOpen, Clock, Award, ClipboardList, ChevronRight, CheckCircle, Flame, Target, Loader2 } from 'lucide-react'
import ProgressBar from '../../components/ui/ProgressBar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { StatCardSkeleton } from '../../components/ui/Skeletons'
import { enrollmentApi, analyticsApi, courseApi } from '../../api'
import { Enrollment, StudentDashboardStats, Course } from '../../types'
import { resolveMediaUrl } from '../../utils/media'

const assignmentsMock = [
  { title: 'React State Management Analysis', course: 'React Fundamentals',      due: 'Sep 18', urgent: true  },
  { title: 'User Journey Mapping',            course: 'UX Design Mastery',       due: 'Sep 20', urgent: false },
  { title: 'Data Visualization Project',      course: 'Data Science w/ Python',  due: 'Sep 25', urgent: false },
]

const activityMock = [
  { icon: '✅', text: 'Completed: React Hooks Overview',              time: '2 hrs ago'  },
  { icon: '📊', text: 'Scored 88% on State Management Quiz',         time: '5 hrs ago'  },
  { icon: '▶️', text: 'Started: useEffect Deep Dive',                time: 'Yesterday'  },
  { icon: '🎓', text: 'Enrolled in Data Science with Python',        time: '3 days ago' },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [stats, setStats] = useState<StudentDashboardStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true
    const loadDashboardData = async () => {
      try {
        const [myCoursesData, statsData] = await Promise.allSettled([
          enrollmentApi.getMyCourses(),
          analyticsApi.getStudentStats(),
        ])
        if (mounted) {
          if (myCoursesData.status === 'fulfilled') {
            setEnrollments(myCoursesData.value || [])
          }
          if (statsData.status === 'fulfilled') {
            setStats(statsData.value)
          }
        }
      } catch (err) {
        console.error('Error fetching student dashboard data:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadDashboardData()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-[200px] bg-slate-200 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="h-[300px] bg-slate-200 rounded-3xl animate-pulse" />
            <div className="h-[250px] bg-slate-200 rounded-3xl animate-pulse" />
          </div>
          <div className="space-y-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        </div>
      </div>
    )
  }

  const inProgressCourses = enrollments.filter(e => (e.progress_percentage || 0) < 100)
  const primaryEnrollment = inProgressCourses.length > 0 ? inProgressCourses[0] : (enrollments.length > 0 ? enrollments[0] : null)

  const hoursStudied = stats?.total_hours_spent || 12.5
  const certificates = stats?.certificates_earned || 2
  const completedCount = enrollments.filter(e => (e.progress_percentage || 0) >= 100).length

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Hero — continue learning */}
      {primaryEnrollment ? (
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 premium-shadow" style={{ minHeight: 200 }}>
          {primaryEnrollment.course?.thumbnail_url && (
            <img
              src={resolveMediaUrl(primaryEnrollment.course.thumbnail_url)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.22 }}
            />
          )}
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-slate-900/80 to-transparent" />
          <div className="relative px-8 py-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
                <Play className="w-3 h-3 fill-blue-400" /> Continue Learning
              </span>
              <h1 className="font-display text-2xl font-bold text-white leading-tight mb-1">{primaryEnrollment.course?.title}</h1>
              <p className="text-slate-400 text-sm mb-4">{primaryEnrollment.course?.instructor?.name || 'Instructor'} · {primaryEnrollment.course?.category?.name}</p>
              <div className="flex items-center gap-3 mb-5 max-w-xs">
                <ProgressBar value={Math.round(primaryEnrollment.progress_percentage || 0)} color="bg-blue-500" size="md" />
                <span className="text-blue-300 text-sm font-bold">{Math.round(primaryEnrollment.progress_percentage || 0)}%</span>
              </div>
              <Button icon={<Play className="w-4 h-4 fill-white" />} size="lg" onClick={() => navigate(`/student/learn/${primaryEnrollment.course_id}`)}>
                Resume Lesson
              </Button>
            </div>

            {/* Quick stats */}
            <div className="flex gap-3 flex-shrink-0">
              {[
                { icon: <BookOpen className="w-5 h-5" />, val: inProgressCourses.length.toString(), sub: 'Active courses', color: 'text-blue-400' },
                { icon: <Flame className="w-5 h-5" />,    val: '14', sub: 'Day streak',    color: 'text-orange-400' },
                { icon: <Award className="w-5 h-5" />,    val: certificates.toString(),  sub: 'Certificates',  color: 'text-emerald-400' },
              ].map(s => (
                <div key={s.sub} className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10 text-center min-w-20 transition-all hover:bg-white/20">
                  <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
                  <p className="text-white font-display font-bold text-xl leading-none">{s.val}</p>
                  <p className="text-slate-400 text-xs mt-1 leading-tight">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 flex items-center justify-between premium-shadow">
           <div>
             <h2 className="text-2xl font-display font-bold text-white mb-2">Welcome to your learning journey!</h2>
             <p className="text-blue-200 text-sm">Explore the catalog and enroll in your first course.</p>
           </div>
           <Button onClick={() => navigate('/student/courses')} variant="primary" className="bg-white text-blue-900 hover:bg-blue-50">
             Browse Courses
           </Button>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: My courses + assignments */}
        <div className="xl:col-span-2 space-y-5">

          {/* My courses */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">My Courses</h3>
              <button onClick={() => navigate('/student/courses')} className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                Browse more <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {enrollments.slice(0, 4).map(e => (
                <div
                  key={e.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                  onClick={() => navigate(`/student/learn/${e.course_id}`)}
                >
                  <div className="relative w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                    {e.course?.thumbnail_url ? (
                      <img src={resolveMediaUrl(e.course.thumbnail_url)} alt={e.course?.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center"><BookOpen className="w-4 h-4 text-slate-400" /></div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{e.course?.title}</p>
                    <p className="text-xs text-slate-400">{e.course?.instructor?.name || 'Instructor'} · {Math.round(e.progress_percentage || 0)}% complete</p>
                    <ProgressBar value={Math.round(e.progress_percentage || 0)} className="mt-2" showLabel={false} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
              {enrollments.length === 0 && (
                <EmptyState 
                  icon={BookOpen}
                  title="No courses yet"
                  description="You haven't enrolled in any courses. Browse the catalog to start learning!"
                  actionLabel="Browse Catalog"
                  onAction={() => navigate('/student/courses')}
                />
              )}
            </div>
          </div>

          {/* Upcoming assignments */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow mt-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Upcoming Assignments</h3>
              <Badge variant="warning" dot>{assignmentsMock.filter(a => a.urgent).length} due soon</Badge>
            </div>
            <div className="divide-y divide-slate-100">
              {assignmentsMock.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${a.urgent ? 'bg-red-50' : 'bg-slate-100'}`}>
                    <ClipboardList className={`w-4 h-4 ${a.urgent ? 'text-red-500' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400">{a.course}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold ${a.urgent ? 'text-red-600' : 'text-slate-500'}`}>Due {a.due}</span>
                    {a.urgent && <Badge variant="error" dot>Urgent</Badge>}
                  </div>
                </div>
              ))}
              {assignmentsMock.length === 0 && (
                <EmptyState 
                  icon={CheckCircle}
                  title="All caught up!"
                  description="You have no pending assignments due soon."
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: stats + activity */}
        <div className="space-y-5">

          {/* Learning goal */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 premium-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">Weekly Goal</h3>
            </div>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-display font-bold text-slate-900">{hoursStudied.toFixed(1)}</span>
              <span className="text-sm text-slate-500 mb-1">/ 15 hrs</span>
            </div>
            <ProgressBar value={hoursStudied} max={15} size="md" showLabel={false} />
            <p className="text-xs text-slate-400 mt-2">{(15 - hoursStudied).toFixed(1)} hours left to reach your weekly goal</p>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 premium-shadow">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Learning Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Hours this week', value: `${hoursStudied.toFixed(1)}h`, icon: <Clock className="w-4 h-4" />, bg: 'bg-blue-50', ic: 'text-blue-600' },
                { label: 'Courses done',    value: completedCount.toString(),   icon: <BookOpen className="w-4 h-4" />, bg: 'bg-violet-50', ic: 'text-violet-600' },
                { label: 'Quiz avg score',  value: '84%',  icon: <Target className="w-4 h-4" />, bg: 'bg-emerald-50', ic: 'text-emerald-600' },
                { label: 'Certificates',    value: certificates.toString(),    icon: <Award className="w-4 h-4" />, bg: 'bg-amber-50', ic: 'text-amber-600' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-3`}>
                  <div className={s.ic}>{s.icon}</div>
                  <p className="text-lg font-display font-bold text-slate-900 mt-1 leading-none">{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 premium-shadow">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activityMock.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-base leading-none mt-0.5 flex-shrink-0">{a.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-slate-700 leading-snug">{a.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
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
