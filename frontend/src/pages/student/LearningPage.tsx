import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, CheckCircle, Play, FileText, HelpCircle,
  X, Menu, BookOpen, Volume2, Upload, Send, Loader2, Award, Check,
  MessageSquare, Download, Paperclip, Sparkles, BookCheck, Clock
} from 'lucide-react'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import Badge from '../../components/ui/Badge'
import { UniversalPlayer } from '../../components/player/UniversalPlayer'
import { courseApi, enrollmentApi, quizApi, assignmentApi, uploadApi } from '../../api'
import { Course, Section, Lesson, Quiz, Assignment } from '../../types'

export default function LearningPage() {
  const { courseId, id } = useParams<{ courseId?: string; id?: string }>()
  const activeCourseId = courseId || id
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)
  const [markingComplete, setMarkingComplete] = useState<boolean>(false)

  // Tabs state
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'resources' | 'qa'>('overview')
  const [studentNotes, setStudentNotes] = useState<string>('')
  const [qaQuestions, setQaQuestions] = useState<Array<{ id: number; author: string; text: string; time: string; replies: number }>>([
    { id: 1, author: 'Alex Johnson', text: 'Can this architecture pattern scale with heavy load?', time: '2 hours ago', replies: 1 },
    { id: 2, author: 'Dev Sarah', text: 'Where can I find the starter configuration file for this module?', time: '1 day ago', replies: 2 }
  ])
  const [newQuestionText, setNewQuestionText] = useState('')

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
      if (!activeCourseId) return
      try {
        setLoading(true)
        const [cData, progData] = await Promise.allSettled([
          courseApi.getCourseDetail(activeCourseId),
          enrollmentApi.getCourseProgress(Number(activeCourseId)),
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
  }, [activeCourseId])

  // Load student notes from localStorage per lesson
  useEffect(() => {
    if (currentLesson && activeCourseId) {
      const saved = localStorage.getItem(`notes_${activeCourseId}_${currentLesson.id}`) || ''
      setStudentNotes(saved)
    }
  }, [currentLesson, activeCourseId])

  const handleSaveNotes = (val: string) => {
    setStudentNotes(val)
    if (currentLesson && activeCourseId) {
      localStorage.setItem(`notes_${activeCourseId}_${currentLesson.id}`, val)
    }
  }

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
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3 bg-slate-950 text-white -m-6 h-[calc(100vh-3.5rem)]">
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
  const isAllComplete = progressPct === 100 || (allLessons.length > 0 && doneCount >= allLessons.length)

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

  const handleVideoEnded = () => {
    if (currentLesson && !completedLessonIds.has(currentLesson.id)) {
      handleMarkCompleted()
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
      alert('Failed to upload assignment file.')
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
      setQuizScore(res.score_percentage ?? res.percentage ?? 0)
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

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestionText.trim()) return
    setQaQuestions(prev => [
      { id: Date.now(), author: 'You', text: newQuestionText.trim(), time: 'Just now', replies: 0 },
      ...prev
    ])
    setNewQuestionText('')
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
              <span className="text-sm font-semibold truncate">{course?.title || 'Course Curriculum'}</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ProgressBar value={progressPct} color="bg-blue-500" showLabel />
          <div className="flex items-center justify-between mt-1.5 text-xs text-slate-400">
            <span>{doneCount} of {allLessons.length} completed</span>
            {isAllComplete && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Completed
              </span>
            )}
          </div>
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

        {/* Certificate claim banner in sidebar if completed */}
        {isAllComplete && (
          <div className="p-4 bg-gradient-to-tr from-emerald-950 to-teal-900 border-t border-emerald-800/60">
            <Link
              to="/student/certificates"
              className="flex items-center gap-2 text-xs font-bold text-emerald-300 hover:text-white transition-colors"
            >
              <Award className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>Claim Course Certificate</span>
            </Link>
          </div>
        )}
      </div>

      {/* Main player & content area */}
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
              {currentLesson?.title || 'Lesson Player'}
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
            {/* Completion Banner if all complete */}
            {isAllComplete && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-900 border border-emerald-500/30 flex items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Course 100% Completed!</h4>
                    <p className="text-xs text-emerald-300/80">You have completed all curriculum modules.</p>
                  </div>
                </div>
                <Link to="/student/certificates">
                  <Button size="sm" icon={<Award className="w-4 h-4" />}>
                    View Certificate
                  </Button>
                </Link>
              </div>
            )}

            {/* Video / Audio Lesson via Universal Player */}
            {(currentLesson?.lesson_type === 'video' || currentLesson?.lesson_type === 'audio') && (
              <UniversalPlayer
                url={currentLesson.video_url || currentLesson.content}
                title={currentLesson.title}
                poster={course?.thumbnail_url}
                onEnded={handleVideoEnded}
              />
            )}

            {/* Dedicated Article / Text Lesson Reading Workstation */}
            {currentLesson?.lesson_type === 'text' && (
              <div className="rounded-3xl p-8 bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 font-bold text-[10px] uppercase tracking-wider">
                        Article Module
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {currentLesson.duration_minutes || Math.max(2, Math.ceil((currentLesson.content?.length || 500) / 400))} min read
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">{currentLesson.title}</h2>
                  </div>

                  <Button
                    variant={isCurrentDone ? 'secondary' : 'default'}
                    disabled={markingComplete}
                    onClick={handleMarkCompleted}
                    icon={<CheckCircle className="w-4 h-4" />}
                  >
                    {isCurrentDone ? 'Completed' : 'Mark as Read'}
                  </Button>
                </div>

                <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4">
                  {currentLesson.content ? (
                    <div className="bg-slate-950/60 rounded-2xl p-6 border border-slate-800/80 font-sans whitespace-pre-line leading-7 text-slate-200">
                      {currentLesson.content}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                      <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2 opacity-80" />
                      <p className="text-xs">Reading notes and architectural guide for this module.</p>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/30 flex items-center justify-between">
                  <span className="text-xs text-blue-300">Finished reviewing this article?</span>
                  <button
                    onClick={handleMarkCompleted}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Complete & Next Lesson</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Lesson */}
            {currentLesson?.lesson_type === 'quiz' && (
              <div className="rounded-3xl p-8 bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-1 rounded-md bg-violet-500/20 text-violet-400 font-bold text-[10px] uppercase tracking-wider">
                        Interactive Knowledge Check
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{quiz?.title || currentLesson.title}</h3>
                    <p className="text-xs text-slate-400">Passing requirement: {quiz?.passing_score_percentage || (quiz as any)?.passing_score || 70}%</p>
                  </div>
                  {quizSubmitted && (
                    <Badge variant={Number(quizScore) >= (quiz?.passing_score_percentage || (quiz as any)?.passing_score || 70) ? 'success' : 'danger'}>
                      Score: {quizScore}% {Number(quizScore) >= (quiz?.passing_score_percentage || (quiz as any)?.passing_score || 70) ? '(Passed)' : '(Retake Available)'}
                    </Badge>
                  )}
                </div>

                <form onSubmit={handleQuizSubmit} className="space-y-6">
                  {(quiz?.questions || []).length > 0 ? (
                    quiz!.questions.map((q, idx) => (
                      <div key={q.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-white leading-snug">
                            <span className="text-blue-400 font-bold mr-1.5">{idx + 1}.</span> {q.question_text}
                          </p>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
                            {q.marks || 1} pt
                          </span>
                        </div>
                        <div className="space-y-2 pt-1">
                          {(Array.isArray(q.options) ? q.options : []).map((opt: any, oIdx: number) => {
                            const optText = typeof opt === 'string' ? opt : (opt?.text || String(opt));
                            const optVal = typeof opt === 'string' ? opt : (opt?.id || opt?.text || String(opt));
                            const isChecked = selectedAnswers[q.id] === optVal;
                            return (
                              <label
                                key={oIdx}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                  isChecked
                                    ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500/50'
                                    : 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`q_${q.id}`}
                                  value={optVal}
                                  checked={isChecked}
                                  onChange={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: optVal }))}
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="font-medium leading-relaxed">{optText}</span>
                              </label>
                            );
                          })}
                        </div>

                        {quizSubmitted && q.explanation && (
                          <div className="mt-2 p-3 rounded-xl bg-slate-900/80 border border-slate-700/50 text-[11px] text-slate-300">
                            <strong className="text-blue-400">Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-2xl border border-slate-800">
                      Standard module evaluation. Click submit below to record your quiz completion.
                    </div>
                  )}

                  {!quizSubmitted ? (
                    <Button type="submit" className="w-full py-3">
                      Submit Quiz Answers
                    </Button>
                  ) : (
                    <div className="flex gap-3 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedAnswers({});
                        }}
                      >
                        Retake Quiz
                      </Button>
                      <Button
                        type="button"
                        onClick={handleMarkCompleted}
                        icon={<ChevronRight className="w-4 h-4" />}
                      >
                        Proceed to Next Module
                      </Button>
                    </div>
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
                    <p className="text-xs text-slate-400">Practical Assessment & File Submission</p>
                  </div>
                  {assignmentSubmitted && <Badge variant="success">Submitted for Grading</Badge>}
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
                        placeholder="Detail your solution, link your project or repo..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1.5">
                        Attach Project Files (Uploaded to Cloudinary CDN / Storage):
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer flex items-center gap-2 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{submittingFile ? 'Uploading...' : 'Choose File'}</span>
                          <input type="file" onChange={handleFileUpload} className="hidden" />
                        </label>
                        {submittedFileUrl && (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> File attached
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
                    Your assignment has been submitted! Your instructor will review and provide a score.
                  </div>
                )}
              </div>
            )}

            {/* Tabbed Interactive Panel: Overview, Notes, Resources, Q&A */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {/* Tab navigation */}
              <div className="flex items-center border-b border-slate-800 px-4 bg-slate-900/70">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Overview & Description
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'notes'
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  My Notes
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'resources'
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Resources & Downloads
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'qa'
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Discussion & Q&A ({qaQuestions.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-white">{currentLesson?.title}</h3>
                        <p className="text-xs text-slate-400">Module details and learning outcomes</p>
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
                        'Engage with this lesson module and complete all required activities. Progress is saved automatically.'}
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">
                        Personal Study Notes (Auto-saved to your browser)
                      </label>
                      <span className="text-[10px] text-slate-500">Synced locally</span>
                    </div>
                    <textarea
                      rows={6}
                      value={studentNotes}
                      onChange={e => handleSaveNotes(e.target.value)}
                      placeholder="Write your personal timestamped notes, code snippets, or key takeaways here..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans leading-relaxed"
                    />
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">Attached course materials and lesson attachments:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Paperclip className="w-4 h-4 text-blue-400" />
                          <div>
                            <p className="text-xs font-semibold text-white">Lesson Lecture Slides & Cheatsheet</p>
                            <p className="text-[10px] text-slate-400">PDF • 2.4 MB</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" icon={<Download className="w-3.5 h-3.5" />}>
                          Download
                        </Button>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Paperclip className="w-4 h-4 text-emerald-400" />
                          <div>
                            <p className="text-xs font-semibold text-white">Starter Code & Project Architecture</p>
                            <p className="text-[10px] text-slate-400">ZIP • 5.1 MB</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" icon={<Download className="w-3.5 h-3.5" />}>
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'qa' && (
                  <div className="space-y-4">
                    <form onSubmit={handleAddQuestion} className="flex gap-2">
                      <input
                        type="text"
                        value={newQuestionText}
                        onChange={e => setNewQuestionText(e.target.value)}
                        placeholder="Ask a question about this lesson..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button type="submit" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                        Ask
                      </Button>
                    </form>

                    <div className="space-y-3 pt-2">
                      {qaQuestions.map(q => (
                        <div key={q.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-blue-400">{q.author}</span>
                            <span className="text-slate-500">{q.time}</span>
                          </div>
                          <p className="text-xs text-slate-200">{q.text}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{q.replies} instructor / peer replies</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
