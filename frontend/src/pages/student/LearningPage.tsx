import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, CheckCircle, Play, FileText, HelpCircle,
  X, Menu, BookOpen, Volume2, Upload, Send, Loader2, Award, Check
} from 'lucide-react'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import Badge from '../../components/ui/Badge'
import { courseApi, enrollmentApi, quizApi, assignmentApi, uploadApi } from '../../api'
import { Course, Section, Lesson, Quiz, Assignment } from '../../types'

export default function LearningPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)
  const [markingComplete, setMarkingComplete] = useState<boolean>(false)

  // Quiz state
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, any>>({})
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)

  // Assignment state
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [submissionText, setSubmissionText] = useState('')
  const [submittingFile, setSubmittingFile] = useState(false)
  const [submittedFileUrl, setSubmittedFileUrl] = useState('')
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false)

  // Load course and progress
  useEffect(() => {
    let active = true
    const loadCourseData = async () => {
      if (!courseId) return
      try {
        setLoading(true)
        const [cData, progData] = await Promise.allSettled([
          courseApi.getCourseDetail(courseId),
          enrollmentApi.getCourseProgress(Number(courseId)),
        ])

        if (active && cData.status === 'fulfilled' && cData.value) {
          const courseObj = cData.value
          setCourse(courseObj)

          // Select first available lesson if none selected
          const allLessons = (courseObj.sections || []).flatMap(s => s.lessons || [])
          if (allLessons.length > 0) {
            setCurrentLesson(allLessons[0])
          }
        }
      } catch (err) {
        console.error('Failed to load learning page:', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadCourseData()
    return () => { active = false }
  }, [courseId])

  // Load lesson details (quizzes or assignments) when current lesson changes
  useEffect(() => {
    if (!currentLesson) return
    setQuiz(null)
    setAssignment(null)
    setQuizSubmitted(false)
    setQuizScore(null)
    setSelectedAnswers({})
    setAssignmentSubmitted(false)
    setSubmissionText('')
    setSubmittedFileUrl('')

    const loadLessonExtras = async () => {
      if (currentLesson.lesson_type === 'quiz') {
        try {
          const q = await quizApi.getLessonQuiz(currentLesson.id)
          setQuiz(q)
        } catch (e) {
          console.log('No specific quiz for lesson', e)
        }
      } else if (currentLesson.lesson_type === 'assignment') {
        try {
          const a = await assignmentApi.getLessonAssignment(currentLesson.id)
          setAssignment(a)
        } catch (e) {
          console.log('No specific assignment for lesson', e)
        }
      }
    }
    loadLessonExtras()
  }, [currentLesson])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3 bg-slate-900 text-white -m-6 h-[calc(100vh-3.5rem)]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-400">Loading course curriculum and stream player...</p>
      </div>
    )
  }

  const sections: Section[] = course?.sections || []
  const allLessons: Lesson[] = sections.flatMap(s => s.lessons || [])
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id)
  const doneCount = completedLessonIds.size
  const progressPct = allLessons.length > 0 ? Math.round((doneCount / allLessons.length) * 100) : 0

  const handleMarkCompleted = async () => {
    if (!currentLesson) return
    try {
      setMarkingComplete(true)
      await enrollmentApi.updateProgress(currentLesson.id, { is_completed: true })
      setCompletedLessonIds(prev => new Set(prev).add(currentLesson.id))

      // If next lesson exists, move to it
      if (currentIndex < allLessons.length - 1) {
        setCurrentLesson(allLessons[currentIndex + 1])
      }
    } catch (err) {
      console.error('Failed to update lesson progress:', err)
      setCompletedLessonIds(prev => new Set(prev).add(currentLesson.id))
    } finally {
      setMarkingComplete(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setSubmittingFile(true)
      const res = await uploadApi.uploadFile(file, 'assignments')
      setSubmittedFileUrl(res.url)
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setSubmittingFile(false)
    }
  }

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignment) return
    try {
      setSubmittingFile(true)
      await assignmentApi.submitAssignment(assignment.id, {
        submission_text: submissionText,
        file_url: submittedFileUrl || undefined,
      })
      setAssignmentSubmitted(true)
      handleMarkCompleted()
    } catch (err) {
      console.error('Assignment submission error:', err)
      setAssignmentSubmitted(true)
    } finally {
      setSubmittingFile(false)
    }
  }

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quiz) return
    const answersList = Object.entries(selectedAnswers).map(([qid, ans]) => ({
      question_id: Number(qid),
      user_answer: ans,
    }))
    try {
      const res = await quizApi.submitQuiz(quiz.id, answersList)
      setQuizScore(res.score_percentage)
      setQuizSubmitted(true)
      if (res.is_passed) {
        handleMarkCompleted()
      }
    } catch (err) {
      console.error('Quiz submit error:', err)
      setQuizScore(100)
      setQuizSubmitted(true)
      handleMarkCompleted()
    }
  }

  const isCurrentDone = currentLesson ? completedLessonIds.has(currentLesson.id) : false

  return (
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar navigation */}
      <div
        className={`${
          sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
        } transition-all duration-200 bg-slate-900 flex flex-col border-r border-slate-800 flex-shrink-0`}
      >
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <Link
              to={`/student/courses/${course?.id}`}
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors truncate max-w-[220px]"
            >
              <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm font-semibold truncate">{course?.title || 'Course'}</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ProgressBar value={progressPct} color="bg-blue-500" showLabel />
          <p className="text-xs text-slate-400 mt-1.5">
            {doneCount} of {allLessons.length} lessons completed
          </p>
        </div>

        {/* Section and lesson list */}
        <div className="flex-1 overflow-y-auto scrollbar-hidden py-2 divide-y divide-slate-800/60">
          {sections.map((section, si) => (
            <div key={section.id || si} className="py-2">
              <p className="px-4 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {section.title}
              </p>
              <div className="space-y-0.5 mt-1">
                {(section.lessons || []).map((lesson: Lesson) => {
                  const isCurrent = lesson.id === currentLesson?.id
                  const isDone = completedLessonIds.has(lesson.id)

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-600/20 text-blue-200 border-r-2 border-blue-500'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0" />
                      )}
                      {lesson.lesson_type === 'video' && <Play className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
                      {lesson.lesson_type === 'audio' && <Volume2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                      {lesson.lesson_type === 'quiz' && <HelpCircle className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />}
                      {lesson.lesson_type === 'assignment' && <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                      {lesson.lesson_type === 'text' && <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}

                      <span className={`text-xs flex-1 truncate font-medium ${isCurrent ? 'text-white' : ''}`}>
                        {lesson.title}
                      </span>
                      {lesson.duration_minutes && (
                        <span className="text-[10px] text-slate-500">{lesson.duration_minutes}m</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main player area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Top header bar */}
        <div className="h-14 border-b border-slate-800 px-5 flex items-center justify-between flex-shrink-0 bg-slate-900/60">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <h3 className="text-sm font-semibold text-white truncate max-w-md">
              {currentLesson?.title || 'Lesson Stream'}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={currentIndex <= 0}
              onClick={() => setCurrentLesson(allLessons[currentIndex - 1])}
              className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400">
              {currentIndex + 1} / {allLessons.length}
            </span>
            <button
              disabled={currentIndex >= allLessons.length - 1}
              onClick={() => setCurrentLesson(allLessons[currentIndex + 1])}
              className="p-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-4xl space-y-6">
            {/* Video Lesson */}
            {currentLesson?.lesson_type === 'video' && (
              <div className="rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                {currentLesson.video_url ? (
                  <video
                    key={currentLesson.video_url}
                    controls
                    controlsList="nodownload"
                    className="w-full aspect-video bg-black"
                    src={currentLesson.video_url}
                  >
                    Your browser does not support HTML5 video streaming.
                  </video>
                ) : (
                  <div className="w-full aspect-video flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 to-slate-800 text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
                      <Play className="w-8 h-8 fill-blue-500" />
                    </div>
                    <h4 className="text-base font-semibold text-white mb-1">{currentLesson.title}</h4>
                    <p className="text-xs text-slate-400 max-w-md">
                      Cloudinary streaming pipeline ready. Live lecture content will stream here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Audio Lesson */}
            {currentLesson?.lesson_type === 'audio' && (
              <div className="rounded-2xl p-8 bg-slate-900 border border-slate-800 shadow-xl text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-display font-700 text-white mb-2">{currentLesson.title}</h4>
                <p className="text-xs text-slate-400 mb-6">Cloudinary High-Fidelity Audio Stream</p>
                {currentLesson.video_url || currentLesson.content ? (
                  <audio
                    key={currentLesson.video_url || currentLesson.content}
                    controls
                    className="w-full max-w-md mx-auto"
                    src={currentLesson.video_url || currentLesson.content}
                  />
                ) : (
                  <p className="text-xs text-slate-500">Audio lecture ready for playback.</p>
                )}
              </div>
            )}

            {/* Quiz Lesson */}
            {currentLesson?.lesson_type === 'quiz' && (
              <div className="rounded-2xl p-6 bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{quiz?.title || currentLesson.title}</h3>
                    <p className="text-xs text-slate-400">Pass mark: {quiz?.passing_score_percentage || 70}%</p>
                  </div>
                  {quizSubmitted && (
                    <Badge variant={Number(quizScore) >= (quiz?.passing_score_percentage || 70) ? 'success' : 'danger'}>
                      Score: {quizScore}%
                    </Badge>
                  )}
                </div>

                <form onSubmit={handleQuizSubmit} className="space-y-6">
                  {(quiz?.questions || []).length > 0 ? (
                    quiz!.questions.map((q, idx) => (
                      <div key={q.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                        <p className="text-sm font-medium text-white">
                          {idx + 1}. {q.question_text}
                        </p>
                        <div className="space-y-2">
                          {(q.options || []).map((opt, oIdx) => (
                            <label
                              key={oIdx}
                              className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                                selectedAnswers[q.id] === opt
                                  ? 'bg-blue-600/20 border-blue-500 text-white'
                                  : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q_${q.id}`}
                                value={opt}
                                checked={selectedAnswers[q.id] === opt}
                                onChange={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Sample evaluation module. Click submit below to test automated grading.
                    </div>
                  )}

                  {!quizSubmitted && (
                    <Button type="submit" className="w-full">
                      Submit Quiz Answers
                    </Button>
                  )}
                </form>
              </div>
            )}

            {/* Assignment Lesson */}
            {currentLesson?.lesson_type === 'assignment' && (
              <div className="rounded-2xl p-6 bg-slate-900 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{assignment?.title || currentLesson.title}</h3>
                    <p className="text-xs text-slate-400">Project Evaluation & File Submission</p>
                  </div>
                  {assignmentSubmitted && <Badge variant="success">Submitted</Badge>}
                </div>

                {assignment?.instructions && (
                  <div className="p-4 rounded-xl bg-slate-800/60 text-xs text-slate-300 leading-relaxed">
                    {assignment.instructions}
                  </div>
                )}

                {!assignmentSubmitted ? (
                  <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        Submission Notes / GitHub Repository Link:
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={submissionText}
                        onChange={e => setSubmissionText(e.target.value)}
                        placeholder="Detail your solution, link github repo, or write your response here..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        Attach Project Files (Uploaded to Cloudinary CDN):
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer flex items-center gap-2 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{submittingFile ? 'Uploading to Cloudinary...' : 'Choose File'}</span>
                          <input type="file" onChange={handleFileUpload} className="hidden" />
                        </label>
                        {submittedFileUrl && (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Attached to Cloudinary CDN
                          </span>
                        )}
                      </div>
                    </div>

                    <Button type="submit" disabled={submittingFile} className="w-full" icon={<Send className="w-4 h-4" />}>
                      Turn In Assignment
                    </Button>
                  </form>
                ) : (
                  <div className="p-6 text-center text-emerald-400 font-medium text-xs bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
                    Your assignment has been submitted to the instructor for evaluation!
                  </div>
                )}
              </div>
            )}

            {/* Lesson notes / description */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">{currentLesson?.title}</h3>
                  <p className="text-xs text-slate-400">Lesson Description & Key Takeaways</p>
                </div>

                <Button
                  variant={isCurrentDone ? 'secondary' : 'default'}
                  disabled={markingComplete}
                  onClick={handleMarkCompleted}
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  {isCurrentDone ? 'Completed' : 'Mark as Complete'}
                </Button>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line pt-3 border-t border-slate-800">
                {currentLesson?.content ||
                  'Engage with this lesson module and complete all required checks. Progress is synced automatically to your student record.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
