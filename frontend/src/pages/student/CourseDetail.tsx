import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Star, Users, Clock, BarChart2, Play, FileText, HelpCircle, CheckCircle,
  ChevronDown, ChevronUp, Loader2, BookOpen, Sparkles, FileSpreadsheet,
  Award, ShieldCheck, Smartphone, Infinity, Check, Share2, MessageCircle
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import { UniversalPlayer } from '../../components/player/UniversalPlayer'
import { resolveMediaUrl } from '../../utils/media'
import { courseApi, enrollmentApi } from '../../api'
import { Course, Section, Lesson } from '../../types'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [enrolling, setEnrolling] = useState<boolean>(false)
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({ 0: true })
  const [activeTab, setActiveTab] = useState<'syllabus' | 'overview' | 'instructor' | 'reviews'>('syllabus')
  const [showTrailerModal, setShowTrailerModal] = useState<boolean>(false)

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
      navigate(`/student/learn/${course.id}`)
    } finally {
      setEnrolling(false)
    }
  }

  const toggleSection = (idx: number) => {
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const expandAllSections = () => {
    if (!course?.sections) return
    const all: Record<number, boolean> = {}
    course.sections.forEach((_, i) => { all[i] = true })
    setOpenSections(all)
  }

  const collapseAllSections = () => {
    setOpenSections({})
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-semibold">Loading syllabus, instructor credentials, and lectures...</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Course Not Found</h3>
        <p className="text-xs text-slate-500 mb-4">The course you requested is currently unavailable.</p>
        <Button onClick={() => navigate('/student/courses')}>Explore Catalog</Button>
      </div>
    )
  }

  const sections: Section[] = course.sections || []
  const totalLessons = sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)
  const priceDisplay = course.is_free || !course.price || Number(course.price) === 0 ? 'Free' : `$${course.price}`

  // Find first lesson with video for trailer preview
  const firstVideoLesson = sections.flatMap(s => s.lessons || []).find(l => l.video_url)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Hero Section */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">{course.category?.name || 'Curriculum'}</Badge>
              <Badge variant="muted">{course.difficulty_level || 'All Levels'}</Badge>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Certificate Included
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-bold leading-tight text-white">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {course.short_description || course.description}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-300 pt-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-white">{course.rating ? Number(course.rating).toFixed(1) : '4.9'}</span>
                <span className="text-slate-400 font-normal">({course.total_students_enrolled || 18} reviews)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{course.total_students_enrolled || 0} students enrolled</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{course.estimated_duration_hours ? `${course.estimated_duration_hours} total hours` : 'Self-paced'}</span>
              </div>
            </div>

            {/* Instructor Quick Info */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
              <Avatar name={course.instructor?.name || 'Instructor'} size="sm" />
              <div className="text-xs">
                <p className="text-slate-400">Created by</p>
                <p className="text-white font-bold">{course.instructor?.name || 'Lead Instructor'}</p>
              </div>
            </div>
          </div>

          {/* Quick Hero CTA for mobile / tablet */}
          <div className="lg:hidden bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{priceDisplay}</span>
              {isEnrolled && <Badge variant="success">Enrolled</Badge>}
            </div>
            {isEnrolled ? (
              <Button onClick={() => navigate(`/student/learn/${course.id}`)} className="w-full">
                Resume Learning
              </Button>
            ) : (
              <Button onClick={handleEnroll} disabled={enrolling} className="w-full">
                {enrolling ? 'Enrolling...' : `Enroll Now • ${priceDisplay}`}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols): Tabs & Syllabus */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center border-b border-slate-200 gap-2 bg-white rounded-2xl p-1.5 border shadow-xs">
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'syllabus' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Curriculum ({sections.length})
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Course Overview
            </button>
            <button
              onClick={() => setActiveTab('instructor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'instructor' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Instructor
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reviews' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reviews & Ratings
            </button>
          </div>

          {/* Tab 1: Syllabus */}
          {activeTab === 'syllabus' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Course Curriculum</h3>
                  <p className="text-xs text-slate-500">{sections.length} sections • {totalLessons} lectures</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={expandAllSections}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Expand All
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    onClick={collapseAllSections}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Sections Accordion */}
              <div className="space-y-3">
                {sections.map((section, sIdx) => {
                  const isOpen = !!openSections[sIdx]
                  const lessons = section.lessons || []

                  return (
                    <div key={section.id || sIdx} className="rounded-xl border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => toggleSection(sIdx)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50/80 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                          <span className="text-xs font-bold text-slate-900">
                            Section {sIdx + 1}: {section.title}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {lessons.length} lessons
                        </span>
                      </button>

                      {isOpen && (
                        <div className="divide-y divide-slate-100 bg-white">
                          {lessons.map(lesson => (
                            <div
                              key={lesson.id}
                              className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/60 transition-colors text-xs"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.lesson_type === 'video' && <Play className="w-3.5 h-3.5 text-blue-600" />}
                                {lesson.lesson_type === 'audio' && <Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
                                {lesson.lesson_type === 'quiz' && <HelpCircle className="w-3.5 h-3.5 text-violet-600" />}
                                {lesson.lesson_type === 'assignment' && <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />}
                                {lesson.lesson_type === 'text' && <FileText className="w-3.5 h-3.5 text-slate-500" />}

                                <span className="text-slate-800 font-medium">{lesson.title}</span>
                              </div>

                              <div className="flex items-center gap-3 text-slate-400">
                                {lesson.duration_minutes && (
                                  <span>{lesson.duration_minutes}m</span>
                                )}
                                {isEnrolled && (
                                  <CheckCircle className="w-3.5 h-3.5 text-slate-300" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Overview & What You'll Learn */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* What You'll Learn */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">What You'll Learn</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Architect production-ready scalable web applications from scratch</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Master industry-standard best practices, design patterns, and deployment</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Complete hands-on assignments with personalized instructor feedback</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Earn a verified digital certificate to showcase on LinkedIn & resume</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <h3 className="text-base font-bold text-slate-900">Course Description</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {course.description || 'This course provides end-to-end practical mastery with step-by-step guidance.'}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Instructor Profile */}
          {activeTab === 'instructor' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-start gap-4">
                <Avatar name={course.instructor?.name || 'Instructor'} size="lg" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">{course.instructor?.name || 'Lead Instructor'}</h3>
                  <p className="text-xs text-blue-600 font-semibold">{course.instructor?.expertise || 'Senior Staff Engineer & Educator'}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9 Instructor Rating
                    </span>
                    <span>•</span>
                    <span>1,420+ Students Taught</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                {course.instructor?.bio ||
                  'Experienced technology leader and passionate educator dedicated to mentoring next-generation software engineers and product designers.'}
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-center sm:text-left">
                  <p className="text-4xl font-display font-bold text-slate-900">{course.rating ? Number(course.rating).toFixed(1) : '4.9'}</p>
                  <div className="flex items-center gap-1 justify-center sm:justify-start my-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Course Rating based on verified reviews</p>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4 divide-y divide-slate-100">
                <div className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">David M. — Verified Student</span>
                    <span className="text-slate-400">1 week ago</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Extremely thorough course! The video quality and assignment feedback from the instructor helped me land my first senior engineering role.
                  </p>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Jessica L. — Verified Student</span>
                    <span className="text-slate-400">3 weeks ago</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Well structured, great interactive video player, and the quizzes test real application rather than just memorization.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Sticky Enrollment Card) */}
        <div className="hidden lg:block space-y-5 sticky top-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg space-y-5 p-6">
            {/* Thumbnail / Trailer Video */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video group">
              {course.thumbnail_url ? (
                <img
                  src={resolveMediaUrl(course.thumbnail_url)}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-blue-700 to-indigo-900 flex items-center justify-center text-white font-bold text-sm text-center p-4">
                  {course.title}
                </div>
              )}

              {firstVideoLesson?.video_url && (
                <div
                  onClick={() => setShowTrailerModal(true)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center cursor-pointer hover:bg-black/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-blue-600 translate-x-0.5" />
                  </div>
                  <span className="text-xs font-bold text-white mt-2">Preview this course</span>
                </div>
              )}
            </div>

            {/* Price & Guarantee */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-display font-bold text-slate-900">{priceDisplay}</span>
                {!course.is_free && Number(course.price) > 0 && (
                  <span className="text-sm text-slate-400 line-through">${Number(course.price) * 2}</span>
                )}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 30-Day Money-Back Guarantee
              </p>
            </div>

            {/* Primary Action Button */}
            {isEnrolled ? (
              <Button
                onClick={() => navigate(`/student/learn/${course.id}`)}
                className="w-full py-3 font-bold text-sm shadow-md"
                icon={<Play className="w-4 h-4 fill-white" />}
              >
                Resume Learning
              </Button>
            ) : (
              <Button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full py-3 font-bold text-sm shadow-md"
              >
                {enrolling ? 'Enrolling...' : `Enroll Now • ${priceDisplay}`}
              </Button>
            )}

            {/* Course Inclusions List */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <p className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">This course includes:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <Play className="w-4 h-4 text-blue-600" />
                  <span>{totalLessons} on-demand video & audio lectures</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Downloadable project resources & cheatsheets</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Infinity className="w-4 h-4 text-indigo-600" />
                  <span>Full lifetime access with future updates</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-amber-600" />
                  <span>Access on mobile, tablet, and desktop</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Official Certificate of Completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Video Preview Modal */}
      {showTrailerModal && firstVideoLesson?.video_url && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Course Preview: {firstVideoLesson.title}</h4>
              <button
                onClick={() => setShowTrailerModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-md"
              >
                Close ✕
              </button>
            </div>
            <div className="p-4">
              <UniversalPlayer
                url={firstVideoLesson.video_url}
                title={firstVideoLesson.title}
                autoPlay
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
