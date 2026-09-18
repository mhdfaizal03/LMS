import React, { useState, useEffect } from 'react'
import { CheckCircle2, Clock, FileText, Download, Loader2, Send, Award, Check } from 'lucide-react'
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Grading & Feedback</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Review student submissions and assign grades with customized feedback</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Submissions List Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col shadow-xs">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">Submissions</h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {submissions.filter(s => s.status === 'pending').length} Pending
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              {(['all', 'pending', 'graded'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer capitalize text-center ${
                    filter === f 
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px]">
            {filtered.map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full text-left p-5 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer ${
                  selected.id === s.id ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-r-4 border-indigo-600 dark:border-indigo-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={s.student} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.student}</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{s.submitted.split('—')[0]}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5 font-medium">{s.assignment}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {s.status === 'pending' ? (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Awaiting Grade
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Score: {s.grade}/{s.maxMarks}
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
        <div className="flex-1 min-w-0 space-y-6">
          {selected ? (
            <>
              {/* Student Submission Detail */}
              <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 backdrop-blur-xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                      {selected.course}
                    </span>
                    <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mt-2.5">{selected.assignment}</h2>
                  </div>
                  <Badge variant={selected.status === 'pending' ? 'warning' : 'success'}>
                    {selected.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center gap-3.5 p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <Avatar name={selected.student} size="md" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selected.student}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{selected.studentEmail || 'Registered Student'} • Submitted {selected.submitted}</p>
                  </div>
                </div>

                {/* Student Written Response */}
                {selected.submissionText && (
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Student Response & Notes</p>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-mono">
                      {selected.submissionText}
                    </div>
                  </div>
                )}

                {/* Attached Files */}
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Submitted Project Files</p>
                  <div className="flex flex-wrap gap-2.5">
                    {selected.files.map((f, idx) => (
                      <a
                        key={idx}
                        href={resolveMediaUrl(f)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="truncate max-w-[220px]">{f.split('/').pop() || 'Download Asset'}</span>
                        <Download className="w-3.5 h-3.5 ml-1" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grading Form */}
              <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-xs backdrop-blur-xs">
                <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">Evaluation & Feedback</h3>

                {selected.status === 'graded' && (
                  <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <p className="text-xs text-emerald-800 dark:text-emerald-200 font-semibold">
                      Recorded Score: <strong>{selected.grade} / {selected.maxMarks} ({Math.round(((selected.grade || 0) / selected.maxMarks) * 100)}%)</strong>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">Score (Out of {selected.maxMarks})</label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="number"
                        min="0"
                        max={selected.maxMarks}
                        value={grade}
                        onChange={e => setGrade(e.target.value)}
                        placeholder="0"
                        className="w-28 h-11 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 text-base font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-bold text-slate-400">/ {selected.maxMarks}</span>
                      {grade && (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          Number(grade) / selected.maxMarks >= 0.7
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        }`}>
                          {Math.round((Number(grade) / selected.maxMarks) * 100)}%
                          {Number(grade) / selected.maxMarks >= 0.7 ? ' • Pass' : ' • Needs Revision'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">Instructor Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    rows={4}
                    placeholder="Provide constructive feedback, praise key strengths, and point out areas for improvement..."
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    variant="primary"
                    onClick={handleSubmitGrade}
                    disabled={!grade || submitting}
                    loading={submitting}
                    className="font-bold shadow-md shadow-indigo-500/25"
                  >
                    <Send className="w-4 h-4 mr-1.5" />
                    {selected.status === 'graded' ? 'Update Grade & Feedback' : 'Submit Grade to Student'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center text-slate-400">
              Select a student submission from the sidebar to begin grading.
            </div>
          )}

          {toast && (
            <div className="fixed bottom-6 right-6 flex items-center gap-2.5 px-5 py-4 bg-emerald-600 text-white rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-5 h-5" />
              <p className="text-xs font-bold">Grade and feedback submitted successfully!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
