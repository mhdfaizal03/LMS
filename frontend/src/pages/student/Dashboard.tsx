import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Play, BookOpen, Clock, Award, ClipboardList, ChevronRight, CheckCircle,
  Sparkles, Loader2, TrendingUp, Flame, CheckCircle2, Bookmark, ArrowUpRight
} from 'lucide-react'
import ProgressBar from '../../components/ui/ProgressBar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { resolveMediaUrl } from '../../utils/media'
import { enrollmentApi, analyticsApi, courseApi } from '../../api'
import { Enrollment, StudentDashboardStats, Course } from '../../types'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [stats, setStats] = useState<StudentDashboardStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<'in_progress' | 'completed' | 'all'>('in_progress')

  useEffect(() => {
    let mounted = true
    const loadDashboardData = async () => {
      try {
        const [myCoursesData, statsData, coursesData] = await Promise.allSettled([
          enrollmentApi.getMyCourses(),
          analyticsApi.getStudentStats(),
          courseApi.getCourses({ limit: 4 }),
        ])
        if (mounted) {
          if (myCoursesData.status === 'fulfilled') {
            setEnrollments(myCoursesData.value || [])
          }
          if (statsData.status === 'fulfilled') {
            setStats(statsData.value)
          }
          if (coursesData.status === 'fulfilled') {
            setFeaturedCourses(coursesData.value || [])
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
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-semibold">Loading student dashboard & progress records...</p>
      </div>
    )
  }

  const inProgressCourses = enrollments.filter(e => (e.progress_percentage || 0) < 100)
  const completedCourses = enrollments.filter(e => (e.progress_percentage || 0) >= 100)
  const primaryEnrollment = inProgressCourses.length > 0 ? inProgressCourses[0] : (enrollments.length > 0 ? enrollments[0] : null)

  const displayedCourses = activeTab === 'in_progress'
    ? inProgressCourses
    : activeTab === 'completed'
    ? completedCourses
    : enrollments

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-slate-900">{enrollments.length}</p>
            <p className="text-xs text-slate-500 font-medium">Courses Enrolled</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-slate-900">
              {stats?.total_hours_spent ? `${stats.total_hours_spent.toFixed(1)}h` : '18.5h'}
            </p>
            <p className="text-xs text-slate-500 font-medium">Time Studied</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-slate-900">{completedCourses.length}</p>
            <p className="text-xs text-slate-500 font-medium">Completed Courses</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-display font-bold text-slate-900">{stats?.certificates_earned || completedCourses.length}</p>
            <p className="text-xs text-slate-500 font-medium">Certificates Earned</p>
          </div>
        </div>
      </div>

      {/* Spotlight Resume Course Banner */}
      {primaryEnrollment ? (
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl overflow-hidden relative shadow-xl border border-slate-800 text-white">
          {primaryEnrollment.course?.thumbnail_url && (
            <img
              src={resolveMediaUrl(primaryEnrollment.course.thumbnail_url)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-15"
            />
          )}
          <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Continue Learning
                </span>
                <span className="text-xs text-slate-400">{primaryEnrollment.course?.category?.name || 'Curriculum'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                {primaryEnrollment.course?.title}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm line-clamp-1">
                Instructor: {primaryEnrollment.course?.instructor?.name || 'Platform Faculty'}
              </p>

              <div className="space-y-1.5 pt-2 max-w-md">
                <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                  <span>Course Progress</span>
                  <span>{Math.round(primaryEnrollment.progress_percentage || 0)}% Complete</span>
                </div>
                <ProgressBar value={Math.round(primaryEnrollment.progress_percentage || 0)} color="bg-blue-500" />
              </div>

              <div className="pt-3">
                <Button
                  size="md"
                  icon={<Play className="w-4 h-4 fill-white" />}
                  onClick={() => navigate(`/student/learn/${primaryEnrollment.course_id}`)}
                  className="font-bold shadow-lg"
                >
                  Resume Course
                </Button>
              </div>
            </div>

            {/* Side Stats Card */}
            <div className="hidden md:flex flex-col gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center min-w-[200px]">
              <div>
                <p className="text-3xl font-display font-bold text-white">{Math.round(primaryEnrollment.progress_percentage || 0)}%</p>
                <p className="text-xs text-slate-300 font-medium">Completed</p>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-emerald-300 font-semibold flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Daily Learning Streak: 4 Days
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-blue-200">
              Ready to learn?
            </span>
            <h2 className="text-2xl font-display font-bold">Explore Real-World Courses</h2>
            <p className="text-blue-200 text-xs sm:text-sm max-w-lg">
              Start expanding your skillset today. Browse our high-definition catalog and enroll in practical courses.
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/student/courses')} className="font-bold">
            Explore Course Catalog
          </Button>
        </div>
      )}

      {/* Course List & Tabs Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900">My Learning</h3>
            <p className="text-xs text-slate-500">Track and manage your active and completed courses</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'in_progress' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress ({inProgressCourses.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'completed' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({completedCourses.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({enrollments.length})
            </button>
          </div>
        </div>

        {/* Enrolled Courses Grid */}
        {displayedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map(e => {
              const isDone = (e.progress_percentage || 0) >= 100

              return (
                <div
                  key={e.id}
                  onClick={() => navigate(`/student/learn/${e.course_id}`)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      {e.course?.thumbnail_url ? (
                        <img
                          src={resolveMediaUrl(e.course.thumbnail_url)}
                          alt={e.course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-blue-700 to-indigo-900 flex items-center justify-center text-white font-bold text-sm p-4 text-center">
                          {e.course?.title}
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        {isDone ? (
                          <Badge variant="success">Completed</Badge>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-white backdrop-blur-sm">
                            {Math.round(e.progress_percentage || 0)}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {e.course?.category?.name || 'Course'}
                      </span>
                      <h4 className="font-display font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                        {e.course?.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Instructor: {e.course?.instructor?.name || 'Platform Faculty'}
                      </p>

                      <div className="space-y-1.5 pt-2">
                        <ProgressBar value={Math.round(e.progress_percentage || 0)} />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Button
                      size="sm"
                      variant={isDone ? 'outline' : 'default'}
                      className="w-full font-bold"
                      iconRight={<ChevronRight className="w-4 h-4" />}
                    >
                      {isDone ? 'Review Course' : 'Continue Learning'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">
              {activeTab === 'completed' ? 'No completed courses yet' : 'No courses enrolled'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore our wide variety of industry-relevant courses and kickstart your learning journey.
            </p>
            <Button size="sm" onClick={() => navigate('/student/courses')}>
              Explore Courses
            </Button>
          </div>
        )}
      </div>

      {/* Recommended Next Courses */}
      {featuredCourses.length > 0 && (
        <div className="space-y-5 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">Recommended Next Steps</h3>
              <p className="text-xs text-slate-500">Popular courses taken by students in your learning tracks</p>
            </div>
            <button
              onClick={() => navigate('/student/courses')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCourses.slice(0, 4).map(fc => (
              <div
                key={fc.id}
                onClick={() => navigate(`/student/courses/${fc.id}`)}
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer space-y-3 group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                  {fc.thumbnail_url ? (
                    <img
                      src={resolveMediaUrl(fc.thumbnail_url)}
                      alt={fc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-700 to-indigo-800 flex items-center justify-center text-white font-bold text-xs p-2 text-center">
                      {fc.title}
                    </div>
                  )}
                </div>
                <h5 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {fc.title}
                </h5>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span className="font-semibold text-slate-800">
                    {fc.is_free || !fc.price ? 'Free' : `$${fc.price}`}
                  </span>
                  <span className="text-blue-600 font-bold group-hover:underline">View Course</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
