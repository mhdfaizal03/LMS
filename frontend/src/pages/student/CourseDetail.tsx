import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Star, Users, Clock, Play, FileText, HelpCircle, CheckCircle,
  ChevronDown, Loader2, BookOpen, Globe, BarChart2, Award, X
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import { UniversalPlayer } from '../../components/player/UniversalPlayer'
import { resolveMediaUrl } from '../../utils/media'
import { courseApi, enrollmentApi } from '../../api'
import { Course, Section } from '../../types'

const typeIcon = (t?: string) => {
  if (t === 'video' || t === 'audio') return <Play className="w-3.5 h-3.5 text-blue-500" />
  if (t === 'quiz') return <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
  return <FileText className="w-3.5 h-3.5 text-slate-400" />
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [enrolling, setEnrolling] = useState<boolean>(false)
  const [openSection, setOpenSection] = useState<number>(0)
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

  if (loading) {
    return (
      <div className="max-w-[1000px] mx-auto space-y-6 pb-12">
        <div className="h-[400px] bg-slate-200 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[300px] bg-slate-200 rounded-3xl animate-pulse" />
          <div className="h-[300px] bg-slate-200 rounded-3xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Course Not Found</h3>
        <p className="text-xs text-slate-500 mb-4">The course you requested is currently unavailable.</p>
        <Button onClick={() => navigate('/student/courses')}>Explore Catalog</Button>
      </div>
    )
  }

  const sections: Section[] = course.sections || []
  const allLessons = sections.flatMap(s => s.lessons || [])
  const doneLessons = isEnrolled ? allLessons.filter(l => l.is_completed).length : 0 // Assuming is_completed is available or mocked
  const totalLessons = allLessons.length
  
  const priceDisplay = course.is_free || !course.price || Number(course.price) === 0 ? 'Free' : `$${course.price}`
  const firstVideoLesson = allLessons.find(l => l.video_url)

  return (
    <div className="max-w-[1000px] mx-auto space-y-6 pb-12">

      {/* Hero */}
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
        {course.thumbnail_url ? (
          <img src={resolveMediaUrl(course.thumbnail_url)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-slate-800 opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/85 to-transparent" />
        
        <div className="relative px-6 py-8 md:px-8 md:py-10">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="default">{course.category?.name || 'General'}</Badge>
            <Badge variant="muted">{course.difficulty_level || 'All Levels'}</Badge>
            {isEnrolled && <Badge variant="success" dot>Enrolled</Badge>}
          </div>
          
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-800 text-white mb-2 leading-tight">
            {course.title}
          </h1>
          <p className="text-slate-300 text-sm mb-5 max-w-2xl line-clamp-2">
            {course.short_description || course.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-300 mb-6">
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><strong className="text-white">{course.rating ? Number(course.rating).toFixed(1) : '4.9'}</strong><span className="text-slate-400">({course.total_students_enrolled || 18})</span></span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{(course.total_students_enrolled || 0).toLocaleString()} students</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{course.estimated_duration_hours ? `${course.estimated_duration_hours} hours` : 'Self-paced'}</span>
            <span className="flex items-center gap-1.5"><BarChart2 className="w-4 h-4" />{course.difficulty_level || 'All Levels'}</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" />English</span>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {isEnrolled ? (
              <Button size="lg" icon={<Play className="w-4 h-4 fill-white" />} onClick={() => navigate(`/student/learn/${course.id}`)}>
                Continue Learning
              </Button>
            ) : (
              <Button size="lg" onClick={handleEnroll} disabled={enrolling} loading={enrolling}>
                {`Enroll Now • ${priceDisplay}`}
              </Button>
            )}

            {firstVideoLesson?.video_url && !isEnrolled && (
              <Button size="lg" variant="secondary" onClick={() => setShowTrailerModal(true)} icon={<Play className="w-4 h-4" />}>
                Preview Course
              </Button>
            )}

            {isEnrolled && (
              <div className="flex flex-col ml-2">
                <span className="text-xs text-slate-400">Your progress</span>
                <div className="flex items-center gap-2 mt-1">
                  <ProgressBar value={totalLessons > 0 ? (doneLessons / totalLessons) * 100 : 0} color="bg-blue-500" className="w-32" showLabel={false} />
                  <span className="text-sm font-semibold text-blue-300">{doneLessons}/{totalLessons}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* What you'll learn */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-display text-base font-700 text-slate-900 mb-4">Course Description</h2>
            <div className="text-sm text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
              {course.description}
            </div>
          </div>

          {/* Curriculum */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-700 text-slate-900">Course Curriculum</h2>
                <p className="text-xs text-slate-500 mt-1">{sections.length} sections · {totalLessons} lessons · {course.estimated_duration_hours || 0} total hours</p>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {sections.map((s, i) => (
                <div key={s.id || i}>
                  <button
                    onClick={() => setOpenSection(openSection === i ? -1 : i)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{s.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{(s.lessons || []).length} lessons</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openSection === i ? '' : '-rotate-90'}`} />
                  </button>
                  
                  {openSection === i && (
                    <div className="bg-slate-50/50 divide-y divide-slate-100 border-t border-slate-100">
                      {(s.lessons || []).map((l, j) => {
                        const isDone = false; // Add real status if available
                        return (
                          <div key={l.id || j} className="flex items-center gap-3 px-6 py-3">
                            {isEnrolled && (
                              isDone 
                                ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                : <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                            )}
                            {typeIcon(l.lesson_type)}
                            <span className={`text-sm flex-1 ${isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{l.title}</span>
                            {l.is_preview && <Badge variant="success">Preview</Badge>}
                            {l.duration_minutes && <span className="text-xs text-slate-400 tabular-nums">{l.duration_minutes}m</span>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-display text-sm font-700 text-slate-900 mb-4">Instructor</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-base flex-shrink-0">
                {course.instructor?.name?.charAt(0) || 'I'}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{course.instructor?.name || 'Instructor Name'}</p>
                <p className="text-xs text-slate-500">{course.instructor?.expertise || 'Expert Educator'}</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-4">
              {course.instructor?.bio || 'Experienced technology leader and passionate educator dedicated to mentoring next-generation professionals.'}
            </p>
            
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100"><p className="font-bold text-slate-900 mb-0.5">4.9</p><p className="text-slate-500 text-[10px] uppercase tracking-wide">Rating</p></div>
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100"><p className="font-bold text-slate-900 mb-0.5">14k+</p><p className="text-slate-500 text-[10px] uppercase tracking-wide">Students</p></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-display text-sm font-700 text-slate-900 mb-4">Course Includes</h3>
            <div className="space-y-3.5 text-sm text-slate-600">
              <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-slate-400" />{course.estimated_duration_hours || 0} hours of content</div>
              <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-slate-400" />{totalLessons} learning modules</div>
              <div className="flex items-center gap-3"><HelpCircle className="w-4 h-4 text-slate-400" />Quizzes & Assignments</div>
              <div className="flex items-center gap-3"><Award className="w-4 h-4 text-slate-400" />Certificate of completion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Video Preview Modal */}
      {showTrailerModal && firstVideoLesson?.video_url && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h4 className="text-sm font-bold text-slate-900">Course Preview: {firstVideoLesson.title}</h4>
              <button
                onClick={() => setShowTrailerModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-black">
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
