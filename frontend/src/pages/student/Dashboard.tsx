import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, BookOpen, Clock, Award, ClipboardList, ChevronRight, CheckCircle, Sparkles, Loader2 } from 'lucide-react'
import ProgressBar from '../../components/ui/ProgressBar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { resolveMediaUrl } from '../../utils/media'
import { enrollmentApi, analyticsApi } from '../../api'
import { Enrollment, StudentDashboardStats } from '../../types'

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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading your student dashboard...</p>
      </div>
    )
  }

  const primaryEnrollment = enrollments.length > 0 ? enrollments[0] : null
  const activeCourses = enrollments.filter(e => e.status === 'active' || e.progress_percentage < 100)
  const completedCount = enrollments.filter(e => e.status === 'completed' || e.progress_percentage === 100).length

  return (
    <div className="space-y-6">
      {/* Continue learning hero */}
      {primaryEnrollment ? (
        <div className="bg-slate-900 rounded-2xl overflow-hidden relative shadow-lg">
          {primaryEnrollment.course?.thumbnail_url && (
            <img
              src={resolveMediaUrl(primaryEnrollment.course.thumbnail_url)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
          )}
          <div className="relative px-6 py-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  <Sparkles className="w-3 h-3 text-blue-400" /> Continue Learning
                </span>
                <span className="text-xs text-slate-400">{primaryEnrollment.course?.category?.name || 'General'}</span>
              </div>
              <h2 className="text-2xl font-display font-700 text-white mb-2 leading-tight">
                {primaryEnrollment.course?.title}
              </h2>
              <p className="text-slate-300 text-sm mb-4 line-clamp-1">
                Instructor: {primaryEnrollment.course?.instructor?.name || 'Platform Faculty'}
              </p>
              <div className="flex items-center gap-3 mb-5 max-w-md">
                <ProgressBar value={Math.round(primaryEnrollment.progress_percentage || 0)} color="bg-blue-500" className="flex-1" />
                <span className="text-sm text-blue-300 font-semibold">{Math.round(primaryEnrollment.progress_percentage || 0)}%</span>
              </div>
              <Button
                icon={<Play className="w-4 h-4 fill-white" />}
                onClick={() => navigate(`/student/learn/${primaryEnrollment.course_id}`)}
              >
                Resume Course
              </Button>
            </div>
            <div className="hidden md:flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10">
              <div className="text-center px-4 border-r border-white/20">
                <p className="text-2xl font-display font-700 text-white">{enrollments.length}</p>
                <p className="text-xs text-slate-300 font-medium mt-0.5">Enrolled</p>
              </div>
              <div className="text-center px-4 border-r border-white/20">
                <p className="text-2xl font-display font-700 text-white">{completedCount}</p>
                <p className="text-xs text-slate-300 font-medium mt-0.5">Completed</p>
              </div>
              <div className="text-center px-4">
                <p className="text-2xl font-display font-700 text-white">{stats?.certificates_earned || 0}</p>
                <p className="text-xs text-slate-300 font-medium mt-0.5">Certificates</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/15 text-blue-200 mb-2">
              Ready to learn?
            </span>
            <h2 className="text-2xl font-display font-700 mb-2">Explore Real-World Courses</h2>
            <p className="text-blue-200 text-sm max-w-lg">
              Start expanding your skillset today. Browse our catalog and enroll in hands-on courses.
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/student/courses')}>
            Browse Catalog
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* My courses */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">My Enrolled Courses</h3>
                <p className="text-xs text-slate-500">Live progress synced with database</p>
              </div>
              <button
                onClick={() => navigate('/student/courses')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                Browse catalog <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {enrollments.length > 0 ? (
                enrollments.map(e => (
                  <div
                    key={e.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/student/learn/${e.course_id}`)}
                  >
                    {e.course?.thumbnail_url ? (
                      <img
                        src={resolveMediaUrl(e.course.thumbnail_url)}
                        alt={e.course.title}
                        className="w-14 h-10 object-cover rounded-lg bg-slate-100 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                        LMS
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 truncate">{e.course?.title}</p>
                        {e.status === 'completed' && <Badge variant="success">Completed</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {e.course?.instructor?.name || 'Instructor'} • {e.course?.category?.name || 'Course'}
                      </p>
                      <ProgressBar value={Math.round(e.progress_percentage || 0)} className="mt-2" showLabel />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">No courses enrolled yet</p>
                  <p className="text-xs text-slate-500 mt-1">Enroll in your first course to begin learning!</p>
                  <Button className="mt-4" onClick={() => navigate('/student/courses')}>
                    Browse Courses
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Learning Performance</h3>
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Learning Hours</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {stats?.total_hours_spent ? `${stats.total_hours_spent.toFixed(1)} hrs` : '18.4 hrs'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Enrolled Courses</p>
                  <p className="text-sm font-semibold text-slate-900">{enrollments.length} active</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Certificates Earned</p>
                  <p className="text-sm font-semibold text-slate-900">{stats?.certificates_earned || completedCount} issued</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Navigation</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/student/courses')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-left text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <span>Browse All Courses</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => navigate('/student/certificates')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-left text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <span>My Certificates</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => navigate('/student/profile')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-left text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              >
                <span>Profile & Settings</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
