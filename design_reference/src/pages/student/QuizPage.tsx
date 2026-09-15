import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Flag, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'

const questions = [
  {
    q: 'Which hook is used to manage local state in a React functional component?',
    options: ['useEffect', 'useState', 'useContext', 'useRef'],
    correct: 1,
  },
  {
    q: 'What does the second argument to useEffect control?',
    options: ['The cleanup function', 'The component name', 'When the effect re-runs', 'The return value'],
    correct: 2,
  },
  {
    q: 'How do you prevent a useEffect from running on every render?',
    options: ['Set the first argument to null', 'Pass an empty array as the second argument', 'Use useMemo instead', 'Add a conditional inside the effect'],
    correct: 1,
  },
  {
    q: 'What is the purpose of the cleanup function returned from useEffect?',
    options: ['To reset state', 'To prevent memory leaks', 'To log data', 'To update the DOM'],
    correct: 1,
  },
]

type Phase = 'intro' | 'quiz' | 'review'

export default function QuizPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [flagged, setFlagged] = useState<boolean[]>(Array(questions.length).fill(false))
  const navigate = useNavigate()

  const q = questions[current]
  const answered = answers.filter(a => a !== null).length
  const score = answers.filter((a, i) => a === questions[i].correct).length

  if (phase === 'intro') {
    return (
      <div className="-m-6 min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h1 className="text-xl font-display font-700 text-slate-900 mb-2">React Hooks Quiz</h1>
          <p className="text-slate-500 text-sm mb-6">Test your understanding of useState, useEffect, and related patterns.</p>
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            <div className="bg-slate-50 rounded-lg p-3"><p className="text-slate-500">Questions</p><p className="font-semibold text-slate-900">{questions.length}</p></div>
            <div className="bg-slate-50 rounded-lg p-3"><p className="text-slate-500">Time limit</p><p className="font-semibold text-slate-900">15 minutes</p></div>
            <div className="bg-slate-50 rounded-lg p-3"><p className="text-slate-500">Passing score</p><p className="font-semibold text-slate-900">75%</p></div>
            <div className="bg-slate-50 rounded-lg p-3"><p className="text-slate-500">Attempts</p><p className="font-semibold text-slate-900">3 allowed</p></div>
          </div>
          <Button className="w-full" onClick={() => setPhase('quiz')}>Start Quiz</Button>
        </div>
      </div>
    )
  }

  if (phase === 'review') {
    const pass = score / questions.length >= 0.75
    return (
      <div className="-m-6 min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${pass ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {pass ? <CheckCircle className="w-8 h-8 text-emerald-600" /> : <XCircle className="w-8 h-8 text-red-500" />}
            </div>
            <h1 className="text-2xl font-display font-700 text-slate-900">{pass ? 'Quiz Passed!' : 'Not Quite'}</h1>
            <p className={`text-sm mt-1 ${pass ? 'text-emerald-600' : 'text-red-500'}`}>{pass ? 'Great work!' : 'Review the material and try again.'}</p>
            <p className="text-4xl font-display font-700 text-slate-900 mt-4">{score}/{questions.length}</p>
            <p className="text-slate-500 text-sm">{Math.round((score / questions.length) * 100)}% correct</p>
          </div>
          <div className="space-y-3 mb-6">
            {questions.map((q, i) => {
              const correct = answers[i] === q.correct
              return (
                <div key={i} className={`p-3 rounded-lg border ${correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start gap-2">
                    {correct ? <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-slate-800">{q.q}</p>
                      {!correct && <p className="text-xs text-emerald-700 mt-1">Correct: {q.options[q.correct]}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-3">
            {!pass && <Button variant="outline" className="flex-1" onClick={() => { setAnswers(Array(questions.length).fill(null)); setPhase('intro') }}>Try Again</Button>}
            <Button className="flex-1" onClick={() => navigate('/student/learn/1')}>Back to Course</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="-m-6 min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">React Hooks Quiz</p>
          <p className="text-sm font-semibold text-slate-900">Question {current + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-100 rounded-lg px-3 py-1.5">
            <Clock className="w-4 h-4" /> 12:48
          </div>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${i === current ? 'bg-blue-600 text-white' : answers[i] !== null ? 'bg-emerald-100 text-emerald-700' : flagged[i] ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-slate-100 px-6 py-2">
        <ProgressBar value={answered} max={questions.length} showLabel />
      </div>

      {/* Question */}
      <div className="flex-1 flex items-start justify-center p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-xl w-full">
          <div className="flex items-start justify-between gap-4 mb-5">
            <h2 className="text-base font-semibold text-slate-900">{q.q}</h2>
            <button
              onClick={() => setFlagged(f => { const n = [...f]; n[current] = !n[current]; return n })}
              className={`p-2 rounded-lg flex-shrink-0 transition-colors ${flagged[current] ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2.5">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setAnswers(prev => { const n = [...prev]; n[current] = i; return n })}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium
                  ${answers[current] === i ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'}`}
              >
                <span className={`inline-block w-6 h-6 rounded-full border-2 text-xs font-bold text-center leading-5 mr-3 flex-shrink-0
                  ${answers[current] === i ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-500'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" icon={<ChevronLeft className="w-4 h-4" />} onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>Previous</Button>
            {current < questions.length - 1 ? (
              <Button iconRight={<ChevronRight className="w-4 h-4" />} onClick={() => setCurrent(current + 1)}>Next Question</Button>
            ) : (
              <Button variant="success" onClick={() => setPhase('review')}>Submit Quiz</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
