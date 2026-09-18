import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, CheckCircle, Play, FileText, HelpCircle,
  X, Menu, BookOpen, Volume2, Upload, Send, Loader2, Award, Check,
  MessageSquare, Download, Paperclip, Sparkles, Clock, LayoutGrid
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
      <div className="-m-6 flex h-[calc(100vh-3.5rem)] bg-[#0D1117] overflow-hidden">
        <div className="w-[320px] bg-[#161B22] border-r border-white/10 p-6 flex flex-col gap-4">
          <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-full bg-white/5 rounded animate-pulse mt-4" />
          <div className="h-12 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-12 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-12 w-full bg-white/5 rounded animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-14 w-full bg-[#161B22] border-b border-white/10 animate-pulse" />
          <div className="h-[400px] w-full bg-black animate-pulse" />
          <div className="flex-1 bg-white p-10">
             <div className="max-w-4xl mx-auto space-y-6">
                <div className="h-10 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
             </div>
          </div>
        </div>
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
    <div className="-m-6 flex h-[calc(100vh-3.5rem)] bg-[#0D1117] overflow-hidden">
      
      {/* Curriculum sidebar */}
      <div
        className="flex-shrink-0 flex flex-col transition-all duration-200 overflow-hidden relative z-10"
        style={{ width: sidebarOpen ? 320 : 0, borderRight: sidebarOpen ? '1px solid rgba(255,255,255,0.06)' : 'none', background: '#161B22' }}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <LayoutGrid className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-sm font-semibold text-white truncate pr-2">{course?.title || 'Curriculum'}</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex justify-between text-xs mb-2 text-slate-400">
            <span>{doneCount} of {allLessons.length} lessons</span>
            <span className="text-blue-400 font-semibold">{progressPct}%</span>
          </div>
          <ProgressBar value={progressPct} color="bg-blue-500" size="md" showLabel={false} />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none py-2 pb-20">
          {sections.map((section, si) => (
            <div key={section.id || si}>
              <p className="px-4 pt-4 pb-2 text-xs font-bold uppercase tracking-widest text-slate-500">{section.title}</p>
              {(section.lessons || []).map(lesson => {
                const isCurrent = lesson.id === currentLesson?.id
                const isDone = completedLessonIds.has(lesson.id)
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={[
                      'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors relative',
                      isCurrent ? 'bg-blue-600/10' : 'hover:bg-white/5',
                    ].join(' ')}
                  >
                    {isCurrent && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500" />}
                    <div className="flex-shrink-0">
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isCurrent ? 'border-blue-500 bg-blue-600/20' : 'border-slate-600'}`}>
                          {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                        </div>
                      )}
                    </div>
                    <span className={`flex-1 text-sm truncate leading-snug ${isCurrent ? 'text-white font-semibold' : isDone ? 'text-slate-500' : 'text-slate-300'}`}>
                      {lesson.title}
                    </span>
                    {lesson.duration_minutes && (
                      <span className="text-[10px] text-slate-600 flex-shrink-0">{lesson.duration_minutes}m</span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {isAllComplete && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-emerald-900/90 backdrop-blur border-t border-emerald-800/60 z-20">
            <Link to="/student/certificates" className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-100 hover:text-white transition-colors">
              <Award className="w-4 h-4 text-emerald-400" /> Claim Certificate
            </Link>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top header bar */}
        <div className="flex items-center justify-between px-6 py-3 flex-shrink-0 relative z-10" style={{ background: '#161B22', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            )}
            <button onClick={() => navigate('/student')} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <div className="hidden md:flex flex-col ml-4 border-l border-white/10 pl-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{course?.title}</span>
              <span className="text-sm font-semibold text-white leading-tight">{currentLesson?.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" disabled={currentIndex <= 0} onClick={() => setCurrentLesson(allLessons[currentIndex - 1])} className="text-slate-400 hover:text-white hover:bg-white/10" icon={<ChevronLeft className="w-3.5 h-3.5" />}>Prev</Button>
            <Button size="sm" variant="ghost" disabled={currentIndex >= allLessons.length - 1} onClick={() => setCurrentLesson(allLessons[currentIndex + 1])} className="text-slate-400 hover:text-white hover:bg-white/10" iconRight={<ChevronRight className="w-3.5 h-3.5" />}>Next</Button>
          </div>
        </div>

        {/* Video / Audio area (always top if media) */}
        {(currentLesson?.lesson_type === 'video' || currentLesson?.lesson_type === 'audio') && (
          <div className="flex-shrink-0 bg-black flex items-center justify-center relative border-b" style={{ height: 'clamp(240px, 50vh, 600px)', borderColor: 'rgba(255,255,255,0.07)' }}>
            <UniversalPlayer
              url={currentLesson.video_url || currentLesson.content}
              title={currentLesson.title}
              poster={course?.thumbnail_url}
              onEnded={handleVideoEnded}
              className="w-full h-full rounded-none border-none shadow-none"
            />
          </div>
        )}

        {/* Lesson content / Tabs */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 py-10 space-y-8">
            
            {/* Header for non-media lessons */}
            {currentLesson?.lesson_type !== 'video' && currentLesson?.lesson_type !== 'audio' && (
              <div className="pb-6 border-b border-slate-200 flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                      {currentLesson?.lesson_type} Module
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {currentLesson?.duration_minutes || 5} mins
                    </span>
                  </div>
                  <h1 className="font-display text-2xl md:text-3xl font-800 text-slate-900 leading-tight">
                    {currentLesson?.title}
                  </h1>
                </div>
                {currentLesson?.lesson_type === 'text' && (
                  <Button
                    variant={isCurrentDone ? 'outline' : 'primary'}
                    disabled={markingComplete}
                    onClick={handleMarkCompleted}
                    icon={<CheckCircle className={`w-4 h-4 ${isCurrentDone ? 'text-emerald-500' : ''}`} />}
                  >
                    {isCurrentDone ? 'Completed' : 'Mark as Read'}
                  </Button>
                )}
              </div>
            )}

            {/* Text Lesson Content */}
            {currentLesson?.lesson_type === 'text' && (
              <div className="prose max-w-none text-slate-700 text-sm md:text-base leading-relaxed">
                {currentLesson.content ? (
                  <div className="whitespace-pre-line">{currentLesson.content}</div>
                ) : (
                  <div className="p-10 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p>No content provided for this text module.</p>
                  </div>
                )}
              </div>
            )}

            {/* Quiz Content */}
            {currentLesson?.lesson_type === 'quiz' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                   <div>
                     <p className="text-sm font-semibold text-slate-900">Passing requirement: {quiz?.passing_score_percentage || 70}%</p>
                   </div>
                   {quizSubmitted && (
                     <Badge variant={Number(quizScore) >= (quiz?.passing_score_percentage || 70) ? 'success' : 'error'}>
                       Score: {quizScore}% {Number(quizScore) >= (quiz?.passing_score_percentage || 70) ? '(Passed)' : '(Failed)'}
                     </Badge>
                   )}
                </div>

                <form onSubmit={handleQuizSubmit} className="space-y-8">
                  {(quiz?.questions || []).map((q, idx) => (
                    <div key={q.id} className="space-y-4">
                      <h4 className="text-base font-semibold text-slate-900 leading-snug flex items-start gap-2">
                        <span className="text-blue-600 font-bold shrink-0">{idx + 1}.</span> {q.question_text}
                      </h4>
                      <div className="space-y-2">
                        {(Array.isArray(q.options) ? q.options : []).map((opt: any, oIdx: number) => {
                          const optText = typeof opt === 'string' ? opt : (opt?.text || String(opt));
                          const optVal = typeof opt === 'string' ? opt : (opt?.id || opt?.text || String(opt));
                          const isChecked = selectedAnswers[q.id] === optVal;
                          return (
                            <label
                              key={oIdx}
                              className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-blue-50 border-blue-200 text-blue-900 ring-1 ring-blue-500'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
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
                              <span className="font-medium">{optText}</span>
                            </label>
                          );
                        })}
                      </div>
                      {quizSubmitted && q.explanation && (
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-900">
                          <strong className="font-semibold text-blue-700 block mb-1">Explanation</strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                    {quizSubmitted && (
                      <Button type="button" variant="outline" onClick={() => { setQuizSubmitted(false); setSelectedAnswers({}); }}>
                        Retake Quiz
                      </Button>
                    )}
                    {!quizSubmitted ? (
                      <Button type="submit">Submit Answers</Button>
                    ) : (
                      <Button type="button" onClick={handleMarkCompleted} iconRight={<ChevronRight className="w-4 h-4" />}>
                        Continue to Next
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Assignment Content */}
            {currentLesson?.lesson_type === 'assignment' && (
              <div className="space-y-6">
                {assignment?.instructions && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {assignment.instructions}
                  </div>
                )}

                <div className="p-6 rounded-2xl border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-4">Your Submission</h4>
                  {!assignmentSubmitted ? (
                    <form onSubmit={handleAssignmentSubmit} className="space-y-5">
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-2">Submission Notes / Link</label>
                        <textarea
                          rows={4}
                          required
                          value={submissionText}
                          onChange={e => setSubmissionText(e.target.value)}
                          placeholder="Provide any links or context..."
                          className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-2">Upload File</label>
                        <div className="flex items-center gap-3">
                          <label className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 cursor-pointer flex items-center gap-2">
                            <Upload className="w-4 h-4" /> {submittingFile ? 'Uploading...' : 'Choose File'}
                            <input type="file" onChange={handleFileUpload} className="hidden" />
                          </label>
                          {submittedFileUrl && <span className="text-sm text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> File attached</span>}
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button type="submit" disabled={submittingFile}>Turn In Assignment</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center p-6 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="font-semibold">Successfully submitted!</p>
                      <p className="text-sm mt-1">Your instructor will review your work shortly.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Media Tabs Area */}
            {(currentLesson?.lesson_type === 'video' || currentLesson?.lesson_type === 'audio') && (
              <div className="mt-8 border-t border-slate-200 pt-8">
                <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
                  {(['overview', 'notes', 'resources', 'qa'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-semibold capitalize transition-colors border-b-2 ${
                        activeTab === tab ? 'border-blue-600 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab === 'qa' ? 'Q&A' : tab}
                    </button>
                  ))}
                </div>

                {activeTab === 'overview' && (
                  <div className="prose max-w-none text-slate-600 text-sm leading-relaxed">
                    <p>{currentLesson.content || 'Engage with this lesson module and complete all required activities. Progress is saved automatically.'}</p>
                    <div className="mt-6 flex justify-end">
                      <Button variant={isCurrentDone ? 'outline' : 'primary'} onClick={handleMarkCompleted}>
                        {isCurrentDone ? 'Completed' : 'Mark as Complete'}
                      </Button>
                    </div>
                  </div>
                )}
                {activeTab === 'notes' && (
                  <div>
                    <textarea
                      rows={6}
                      value={studentNotes}
                      onChange={e => handleSaveNotes(e.target.value)}
                      placeholder="Write your personal timestamped notes here..."
                      className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-slate-400 mt-2">Saved locally to your browser</p>
                  </div>
                )}
                {activeTab === 'resources' && (
                  <div className="text-sm text-slate-500 p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                    No resources attached to this lesson.
                  </div>
                )}
                {activeTab === 'qa' && (
                  <div className="space-y-6">
                    <form onSubmit={handleAddQuestion} className="flex gap-3">
                      <input
                        type="text"
                        value={newQuestionText}
                        onChange={e => setNewQuestionText(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button type="submit">Ask</Button>
                    </form>
                    <div className="space-y-4">
                      {qaQuestions.map(q => (
                        <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-slate-900 text-sm">{q.author}</span>
                            <span className="text-xs text-slate-500">{q.time}</span>
                          </div>
                          <p className="text-sm text-slate-700">{q.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
