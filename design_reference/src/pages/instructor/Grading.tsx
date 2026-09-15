import { useState } from 'react'
import { AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const submissions = [
  { id: 1, student: 'Alex Johnson', assignment: 'React State Management Analysis', course: 'React Fundamentals', submitted: 'Sep 15, 2026 — 9:14 AM', status: 'pending', maxMarks: 100, files: ['state-analysis.pdf'] },
  { id: 2, student: 'Emily Chen', assignment: 'User Journey Mapping Exercise', course: 'UX Design Mastery', submitted: 'Sep 15, 2026 — 7:30 AM', status: 'pending', maxMarks: 50, files: ['journey-map.fig', 'notes.pdf'] },
  { id: 3, student: 'James Okafor', assignment: 'Neural Network from Scratch', course: 'ML Basics', submitted: 'Sep 14, 2026 — 11:52 PM', status: 'pending', maxMarks: 150, files: ['notebook.ipynb', 'report.pdf'] },
  { id: 4, student: 'Priya Sharma', assignment: 'API Design Documentation', course: 'Advanced Node.js', submitted: 'Sep 13, 2026 — 4:20 PM', status: 'graded', grade: 88, maxMarks: 100, files: ['api-docs.pdf'] },
]

export default function InstructorGrading() {
  const [selected, setSelected] = useState(submissions[0])
  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')
  const [toast, setToast] = useState(false)

  const handleSubmit = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  return (
    <div className="flex gap-5 h-full">
      {/* List */}
      <div className="w-72 flex-shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-4 py-3.5 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Submissions</h3>
          <p className="text-xs text-slate-500">{submissions.filter(s => s.status === 'pending').length} pending review</p>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {submissions.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${selected.id === s.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''}`}
            >
              <div className="flex items-start gap-2.5">
                <Avatar name={s.student} size="xs" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{s.student}</p>
                  <p className="text-xs text-slate-500 truncate">{s.assignment}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {s.status === 'pending' ? (
                      <><Clock className="w-3 h-3 text-amber-500" /><span className="text-xs text-amber-600 font-medium">Pending</span></>
                    ) : (
                      <><CheckCircle className="w-3 h-3 text-emerald-500" /><span className="text-xs text-emerald-600 font-medium">Graded {s.grade}/{s.maxMarks}</span></>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Grading panel */}
      <div className="flex-1 min-w-0 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">{selected.assignment}</h2>
              <p className="text-sm text-slate-500">{selected.course}</p>
            </div>
            <Badge variant={selected.status === 'pending' ? 'warning' : 'success'}>{selected.status}</Badge>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Avatar name={selected.student} size="sm" />
            <div>
              <p className="text-sm font-medium text-slate-900">{selected.student}</p>
              <p className="text-xs text-slate-500">Submitted {selected.submitted}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Submitted Files</p>
            <div className="flex flex-wrap gap-2">
              {selected.files.map(f => (
                <div key={f} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />{f}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">Grade Submission</h3>
          {selected.status === 'graded' && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <p className="text-sm text-emerald-700">Already graded: <strong>{selected.grade}/{selected.maxMarks}</strong></p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Grade</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  placeholder="0"
                  max={selected.maxMarks}
                  className="w-24 h-9 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-500">/ {selected.maxMarks}</span>
                {grade && (
                  <span className={`text-xs font-medium px-2 py-1 rounded ${Number(grade) / selected.maxMarks >= 0.6 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                    {Math.round((Number(grade) / selected.maxMarks) * 100)}%
                    {Number(grade) / selected.maxMarks >= 0.6 ? ' — Pass' : ' — Fail'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Feedback to Student</label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={4}
              placeholder="Provide detailed feedback to help the student improve..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handleSubmit} disabled={!grade}>Return Grade</Button>
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg shadow-lg">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <p className="text-sm font-medium text-emerald-800">Grade submitted successfully!</p>
          </div>
        )}
      </div>
    </div>
  )
}
