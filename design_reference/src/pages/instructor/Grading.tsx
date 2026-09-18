import { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, FileText, Send, ChevronRight } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const submissions = [
  { id: 1, student: 'Alex Johnson',   course: 'React Fundamentals',  assignment: 'Hooks Deep Dive',     submitted: '2h ago',   status: 'pending',  preview: 'My solution uses useCallback to memoize the expensive sort function. I also added custom hooks for the data-fetching layer...' },
  { id: 2, student: 'Sam Rivera',     course: 'React Fundamentals',  assignment: 'Custom Hook Project', submitted: '5h ago',   status: 'pending',  preview: 'I built a useLocalStorage hook that syncs state with localStorage and handles JSON serialization/deserialization automatically...' },
  { id: 3, student: 'Jordan Lee',     course: 'Advanced Node.js',    assignment: 'REST API Final',      submitted: '1d ago',   status: 'graded',   preview: 'Implemented full CRUD endpoints with Express, JWT auth middleware, and rate limiting using express-rate-limit...' },
  { id: 4, student: 'Taylor Smith',   course: 'React Fundamentals',  assignment: 'Component Library',   submitted: '2d ago',   status: 'pending',  preview: 'Created 12 reusable components following the Atomic Design methodology. All components have TypeScript interfaces...' },
  { id: 5, student: 'Morgan Chen',    course: 'Advanced Node.js',    assignment: 'Middleware Lab',      submitted: '3d ago',   status: 'graded',   preview: 'Wrote custom error-handling middleware that catches async errors and returns structured JSON responses with appropriate status codes...' },
]

const pending = submissions.filter(s => s.status === 'pending')
const graded  = submissions.filter(s => s.status === 'graded')

export default function InstructorGrading() {
  const [selected, setSelected] = useState(submissions[0])
  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')
  const [toast, setToast] = useState(false)
  const [tab, setTab] = useState<'pending' | 'graded'>('pending')

  const list = tab === 'pending' ? pending : graded

  const submitGrade = () => {
    if (!grade) return
    setToast(true)
    setGrade('')
    setFeedback('')
    setTimeout(() => setToast(false), 2500)
  }

  const numGrade = parseFloat(grade)
  const passing  = !isNaN(numGrade) && numGrade >= 75
  const failing  = !isNaN(numGrade) && numGrade < 75

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div>
        <h1 className="font-display text-xl font-800 text-slate-900">Grading Center</h1>
        <p className="text-sm text-slate-500 mt-0.5"><span className="font-semibold text-red-500">{pending.length}</span> pending · {graded.length} graded</p>
      </div>

      <div className="flex gap-5 h-[680px]">
        {/* Left: submission list */}
        <div className="w-80 flex-shrink-0 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {(['pending', 'graded'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-medium transition-colors capitalize ${tab === t ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t} ({t === 'pending' ? pending.length : graded.length})
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {list.map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selected.id === s.id ? 'bg-blue-50 border-l-2 border-blue-600' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={s.student} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{s.student}</p>
                      <span className="text-xs text-slate-400 flex-shrink-0">{s.submitted}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{s.assignment}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{s.course}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-0.5" />
                </div>
              </button>
            ))}
            {list.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                All caught up!
              </div>
            )}
          </div>
        </div>

        {/* Right: grading panel */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar name={selected.student} />
              <div>
                <p className="font-semibold text-slate-900 text-sm">{selected.student}</p>
                <p className="text-xs text-slate-500">{selected.assignment} · {selected.course}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selected.status === 'pending'
                ? <Badge variant="warning" dot><Clock className="w-3 h-3 inline mr-1" />Pending</Badge>
                : <Badge variant="success" dot><CheckCircle className="w-3 h-3 inline mr-1" />Graded</Badge>
              }
              <span className="text-xs text-slate-400">{selected.submitted}</span>
            </div>
          </div>

          {/* Submission preview */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Submission Preview</h3>
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed mb-5">
              {selected.preview}
              <p className="text-slate-400 mt-3">[Full submission content would load here from the LMS storage...]</p>
            </div>

            {/* Grade input */}
            {selected.status === 'pending' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700">Grade Submission</h3>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <label className="block text-xs text-slate-500 mb-1.5">Score (0–100)</label>
                    <div className={`flex items-center gap-2 border-2 rounded-xl px-3 h-11 w-32 transition-colors ${passing ? 'border-emerald-400 bg-emerald-50' : failing ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}>
                      <input
                        type="number"
                        min={0} max={100}
                        value={grade}
                        onChange={e => setGrade(e.target.value)}
                        placeholder="0–100"
                        className="w-full text-lg font-bold bg-transparent outline-none text-slate-900 tabular-nums"
                      />
                      <span className="text-slate-400 text-sm">%</span>
                    </div>
                    {passing && <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Pass</p>}
                    {failing && <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Fail (min 75%)</p>}
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1.5">Feedback (optional)</label>
                    <textarea
                      rows={4}
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      placeholder="Write feedback for the student…"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all resize-none"
                    />
                  </div>
                </div>
                <Button icon={<Send className="w-3.5 h-3.5" />} onClick={submitGrade} disabled={!grade}>
                  Submit Grade
                </Button>
              </div>
            )}

            {selected.status === 'graded' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Already graded</p>
                  <p className="text-xs text-emerald-700 mt-0.5">This submission has been reviewed and feedback was sent to the student.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400" />Grade submitted successfully!
        </div>
      )}
    </div>
  )
}
