import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Users, Clock, BarChart2, Play, FileText, HelpCircle, CheckCircle, ChevronDown, Loader2, BookOpen, Sparkles, FileSpreadsheet } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { resolveMediaUrl } from '../../utils/media'
import { courseApi, enrollmentApi } from '../../api'
import { Course, Section, Lesson } from '../../types'

const typeIcon = (t: string) => {
  if (t === 'video') return <Play className="w-3.5 h-3.5 text-blue-500" />
  if (t === 'audio') return <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
  if (t === 'quiz') return <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
  if (t === 'assignment') return <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
  return <FileText className="w-3.5 h-3.5 text-slate-500" />
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [enrolling, setEnrolling] = useState<boolean>(false)
  const [openSection, setOpenSection] = useState<number>(0)

  useEffect(() => {
    let active = true
    const loadCourseData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const [courseData, myEnrollments] = await Promise.allSettled([
          courseApi.getCourseDetail(id),
          enrollmentApi.getMyCourses(),
        ])

        if (active) {
          if (courseData.status === 'fulfilled' && courseData.value) {
            setCourse(courseData.value)
            if (myEnrollments.status === 'fulfilled') {
              const enrolled = (myEnrollments.value || []).some(
                e => e.course_id === courseData.value.id
              )
              setIsEnrolled(enrolled)
            }
          }
        }
      } catch (err) {
        console.error('Failed to load course details:', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadCourseData()
    return () => { active = false }
  }, [id])

  const handleEnroll = async () => {
    if (!course) return
    try {
      setEnrolling(true)
      await enrollmentApi.enrollCourse(course.id)
      setIsEnrolled(true)
      navigate(`/student/learn/${course.id}`)
    } catch (err) {
      console.error('Enrollment error:', err)
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading course syllabus and details...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Course Not Found</h3>
        <p className="text-xs text-slate-500 mb-4">The course you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate('/student/courses')}>Back to Catalog</Button>
      </div>
    )
  }

  const sections: Section[] = course.sections || []
  const totalLessons = sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)
  const priceDisplay = course.is_free || !course.price || Number(course.price) === 0 ? 'Free' : `$${course.price}`

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-md">
        <div className="relative">
          {course.thumbnail_url ? (
            <img src={resolveMediaUrl(course.thumbnail_url)} alt={course.title} className="w-full h-56 object-cover opacity-25" />
          ) : (
            <div className="w-full h-56 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 opacity-90" />
          )}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">{course.category?.name || 'Curriculum'}</Badge>
              <Badge variant="muted">{course.difficulty_level || 'All Levels'}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-700 text-white mb-2 leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-300 text-sm">
              By {course.instructor?.name || 'Platform Instructor'} • Last updated {new Date(course.updated_at || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 bg-slate-900/90">
          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-300">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-white">{course.rating ? Number(course.rating).toFixed(1) : '4.9'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{course.total_students_enrolled || 0} students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{course.estimated_duration_hours ? `${course.estimated_duration_hours} hrs` : 'Self-paced'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-slate-400" />
              <span>{course.difficulty_level || 'All Levels'}</span>
            </div>
          </div>

          <div>
            {isEnrolled ? (
              <Button onClick={() => navigate(`/student/learn/${course.id}`)} icon={<Play className="w-4 h-4 fill-white" />}>
                Resume Learning
              </Button>
            ) : (
              <Button onClick={handleEnroll} disabled={enrolling}>
                {enrolling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Enrolling...
                  </>
                ) : (
                  `Enroll Now • ${priceDisplay}`
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* About Course */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h2 className="text-base font-semibold text-slate-900 mb-2">About This Course</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {course.description || 'Comprehensive curriculum engineered to deliver practical, job-ready mastery with hands-on labs and evaluations.'}
            </p>
          </div>

          {/* Curriculum */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Course Curriculum</h2>
                <p className="text-xs text-slate-500">{sections.length} sections • {totalLessons} lessons</p>
              </div>
            </div>

            {sections.length > 0 ? (
              sections.map((s, i) => (
                <div key={s.id || i} className="border-b border-slate-100 last:border-0">
                  <button
                    onClick={() => setOpenSection(openSection === i ? -1 : i)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-900">{s.title}</span>
                      {s.description && <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">{(s.lessons || []).length} lessons</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openSection === i ? '' : '-rotate-90'}`} />
                    </div>
                  </button>
                  {openSection === i && (
                    <div className="bg-slate-50 divide-y divide-slate-100">
                      {(s.lessons || []).map((l: Lesson, j: number) => (
                        <div key={l.id || j} className="flex items-center gap-3 px-5 py-3">
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                          {typeIcon(l.lesson_type || 'text')}
                          <span className="text-sm flex-1 text-slate-700 font-medium">{l.title}</span>
                          {l.duration_minutes && (
                            <span className="text-xs text-slate-400">{l.duration_minutes} min</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                Course curriculum is currently being structured. Check back shortly.
              </div>
            )}
          </div>
        </div>

        {/* Instructor & Meta Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Course Instructor</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-700 font-bold text-base">
                {course.instructor?.name ? course.instructor.name.substring(0, 2).toUpperCase() : 'IN'}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{course.instructor?.name || 'Lead Faculty'}</p>
                <p className="text-xs text-slate-500">{course.instructor?.expertise || 'Expert Instructor'}</p>
              </div>
            </div>
            {course.instructor?.bio && (
              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {course.instructor.bio}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Course Features</h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Direct Cloudinary Video & Audio Streaming
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Interactive Quizzes & Automated Grading
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Project Submissions with File Uploads
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Verifiable Certificate of Completion
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
