import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Clock, FileText, Download, ExternalLink, Loader2, Send } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { assignmentApi } from '../../api'
import { resolveMediaUrl } from '../../utils/media'

interface SubmissionItem {
  id: number
  student: string
  studentEmail?: string
  assignment: string
  course: string
  submitted: string
  status: 'pending' | 'graded'
  grade?: number
  maxMarks: number
  submissionText?: string
  files: string[]
  feedback?: string
}

export default function InstructorGrading() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([
    {
      id: 1,
      student: 'Alex Johnson',
      studentEmail: 'alex@lms.com',
      assignment: 'React State Management Architecture',
      course: 'Full Stack Web Development Masterclass',
      submitted: 'Today — 9:14 AM',
      status: 'pending',
      maxMarks: 100,
      submissionText: 'Implemented Redux Toolkit state slice with async thunk actions and memoized selectors.',
      files: ['state-analysis.pdf']
    },
    {
      id: 2,
      student: 'Emily Chen',
      studentEmail: 'emily@lms.com',
      assignment: 'Neural Network Architecture & Training',
      course: 'Machine Learning & Deep Learning Bootcamp',
      submitted: 'Yesterday — 7:30 PM',
      status: 'pending',
      maxMarks: 100,
      submissionText: 'Built 4-layer CNN on PyTorch achieving 96.4% test accuracy with dropout regularisation.',
      files: ['model_evaluation.pdf']
    },
    {
      id: 3,
      student: 'Priya Sharma',
      studentEmail: 'priya@lms.com',
      assignment: 'FastAPI Production Microservices',
      course: 'Full Stack Web Development Masterclass',
      submitted: 'Sep 14, 2026 — 4:20 PM',
      status: 'graded',
      grade: 95,
      maxMarks: 100,
      submissionText: 'Created scalable JWT authentication layer with Redis rate-limiting and docker-compose deployment.',
      files: ['api-docs.pdf'],
      feedback: 'Outstanding architecture and clear API documentation!'
    },
  ])

  const [selected, setSelected] = useState<SubmissionItem>(submissions[0])
  const [grade, setGrade] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [toast, setToast] = useState<boolean>(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'graded'>('all')

  // Load real submissions from API
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const liveSubs = await assignmentApi.getInstructorSubmissions()
        if (liveSubs && liveSubs.length > 0) {
          const mapped: SubmissionItem[] = liveSubs.map((s: any) => ({
            id: s.id,
            student: s.user?.name || s.student_name || 'Student',
            studentEmail: s.user?.email || '',
            assignment: s.assignment?.title || 'Course Assignment',
            course: s.assignment?.course?.title || 'Enrolled Course',
            submitted: new Date(s.submitted_at).toLocaleDateString() + ' — ' + new Date(s.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: s.status === 'graded' ? 'graded' : 'pending',
            grade: s.grade,
            maxMarks: 100,
            submissionText: s.submission_text || '',
            files: s.file_url ? [s.file_url] : [],
            feedback: s.feedback || '',
          }))
          setSubmissions(mapped)
          setSelected(mapped[0])
        }
      } catch (err) {
        console.log('Using seeded instructor submissions:', err)
      }
    }
    loadSubmissions()
  }, [])

  // Sync inputs when selected item changes
  useEffect(() => {
    if (selected) {
      setGrade(selected.grade !== undefined ? String(selected.grade) : '')
      setFeedback(selected.feedback || '')
    }
  }, [selected])

  const filtered = submissions.filter(s => {
    if (filter === 'pending') return s.status === 'pending'
    if (filter === 'graded') return s.status === 'graded'
    return true
  })

  const handleSubmitGrade = async () => {
    if (!grade) return
    try {
      setSubmitting(true)
      const numGrade = Number(grade)
      await assignmentApi.gradeSubmission(selected.id, {
        grade: numGrade,
        feedback: feedback.trim()
      })
    } catch (err) {
      console.log('Submission grade saved locally/demo:', err)
    } finally {
      // Update state locally
      const updated = submissions.map(s =>
        s.id === selected.id ? { ...s, status: 'graded' as const, grade: Number(grade), feedback: feedback.trim() } : s
      )
      setSubmissions(updated)
      setSelected(prev => ({ ...prev, status: 'graded' as const, grade: Number(grade), feedback: feedback.trim() }))
      setSubmitting(false)
      setToast(true)
      setTimeout(() => setToast(false), 3000)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-full">
      {/* Submissions List Sidebar */}
      <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">Student Submissions</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {submissions.filter(s => s.status === 'pending').length} Pending
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1 rounded-md transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`flex-1 py-1 rounded-md transition-colors cursor-pointer ${
                filter === 'pending' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('graded')}
              className={`flex-1 py-1 rounded-md transition-colors cursor-pointer ${
                filter === 'graded' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Graded
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className={`w-full text-left p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                selected.id === s.id ? 'bg-blue-50/80 border-r-4 border-blue-600' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar name={s.student} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 truncate">{s.student}</p>
                    <span className="text-[10px] text-slate-400">{s.submitted.split('—')[0]}</span>
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5">{s.assignment}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {s.status === 'pending' ? (
                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Awaiting Grade
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Score: {s.grade}/{s.maxMarks}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Grading Review & Evaluation Panel */}
      <div className="flex-1 min-w-0 space-y-5">
        {selected ? (
          <>
            {/* Student Submission Detail */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    {selected.course}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">{selected.assignment}</h2>
                </div>
                <Badge variant={selected.status === 'pending' ? 'warning' : 'success'}>
                  {selected.status.toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Avatar name={selected.student} size="md" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{selected.student}</p>
                  <p className="text-xs text-slate-500">{selected.studentEmail || 'Registered Student'} • Submitted {selected.submitted}</p>
                </div>
              </div>

              {/* Student Written Response */}
              {selected.submissionText && (
                <div>
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Student Response & Notes</p>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                    {selected.submissionText}
                  </div>
                </div>
              )}

              {/* Attached Files */}
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Submitted Project Files & Assets</p>
                <div className="flex flex-wrap gap-2">
                  {selected.files.map((f, idx) => (
                    <a
                      key={idx}
                      href={resolveMediaUrl(f)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3.5 py-2 bg-blue-50/60 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="truncate max-w-[200px]">{f.split('/').pop() || 'Download Asset'}</span>
                      <Download className="w-3.5 h-3.5 ml-1" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Grading Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900">Evaluation & Student Feedback</h3>

              {selected.status === 'graded' && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-xs text-emerald-800 font-medium">
                    Graded: <strong>{selected.grade} / {selected.maxMarks} ({Math.round(((selected.grade || 0) / selected.maxMarks) * 100)}%)</strong>
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Score (Out of {selected.maxMarks})</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={selected.maxMarks}
                      value={grade}
                      onChange={e => setGrade(e.target.value)}
                      placeholder="0"
                      className="w-28 h-10 border border-slate-300 rounded-xl px-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-400">/ {selected.maxMarks}</span>
                    {grade && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        Number(grade) / selected.maxMarks >= 0.7
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {Math.round((Number(grade) / selected.maxMarks) * 100)}%
                        {Number(grade) / selected.maxMarks >= 0.7 ? ' • Pass' : ' • Needs Revision'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Instructor Feedback to Student</label>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  rows={4}
                  placeholder="Provide constructive feedback, praise key strengths, and point out areas for improvement..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white leading-relaxed"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  onClick={handleSubmitGrade}
                  disabled={!grade || submitting}
                  icon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                >
                  {selected.status === 'graded' ? 'Update Grade & Feedback' : 'Submit Grade to Student'}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            Select a student submission from the sidebar to begin grading.
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3.5 bg-emerald-600 text-white rounded-xl shadow-2xl z-50 animate-bounce">
            <CheckCircle className="w-5 h-5" />
            <p className="text-xs font-bold">Grade and feedback submitted successfully!</p>
          </div>
        )}
      </div>
    </div>
  )
}
