import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Flag, CheckCircle, XCircle, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import Button from '../../components/ui/Button'

const questions = [
  {
    q: 'Which hook is used to manage local state in a React functional component?',
    options: ['useEffect', 'useState', 'useContext', 'useRef'],
    correct: 1,
    explanation: 'useState is the primary hook for declaring and updating local component state.',
  },
  {
    q: 'What does the second argument (dependency array) to useEffect control?',
    options: ['The cleanup function', 'The component name', 'When the effect re-runs', 'The return value'],
    correct: 2,
    explanation: 'The dependency array tells React when to re-run the effect. Empty array = once on mount. Omitted = every render.',
  },
  {
    q: 'How do you run a useEffect only once — on mount?',
    options: ['Set the first argument to null', 'Pass an empty dependency array []', 'Use useMemo instead', 'Add a conditional inside the effect'],
    correct: 1,
    explanation: 'An empty dependency array [] tells React there are no dependencies, so the effect runs only on the initial render.',
  },
  {
    q: 'What is the return value of a useEffect cleanup function used for?',
    options: ['To reset state on each render', 'To prevent memory leaks and cancel subscriptions', 'To log diagnostic data', 'To re-initialize the component'],
    correct: 1,
    explanation: 'The cleanup function runs before the next effect and on unmount, allowing you to cancel timers, subscriptions, or async operations.',
  },
  {
    q: 'If useState receives a function as its initial value, when does that function run?',
    options: ['On every render', 'Only on the initial render (lazy initialization)', 'Never — it throws an error', 'After the component unmounts'],
    correct: 1,
    explanation: 'This is called lazy initialization. The function is called once to compute the initial state, making it efficient for expensive computations.',
  },
]

type Phase = 'intro' | 'quiz' | 'result'

export default function QuizPage() {
  const [phase, setPhase]     = useState<Phase>('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [flagged, setFlagged] = useState<boolean[]>(Array(questions.length).fill(false))
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const navigate = useNavigate()

  const answered = answers.filter(a => a !== null).length
  const score = answers.filter((a, i) => a === questions[i].correct).length
  const pass  = score / questions.length >= 0.75

  const selectAnswer = (idx: number) => {
    setAnswers(prev => { const n = [...prev]; n[current] = idx; return n })
  }

  const toggleFlag = () => {
    setFlagged(prev => { const n = [...prev]; n[current] = !n[current]; return n })
  }

  /* ---- INTRO ---- */
  if (phase === 'intro') return (
    <div className="-m-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 max-w-md w-full">
        <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-5 text-3xl">📝</div>
        <h1 className="font-display text-2xl font-800 text-slate-900 text-center mb-1">React Hooks Quiz</h1>
        <p className="text-slate-500 text-sm text-center mb-7">Test your knowledge of useState, useEffect, and related patterns.</p>
        <div className="grid grid-cols-2 gap-3 mb-7">
          {[
            ['Questions', `${questions.length}`],
            ['Time Limit',  '15 minutes'],
            ['Pass Score',  '75%'],
            ['Attempts',    '3 allowed'],
          ].map(([l, v]) => (
            <div key={l} className="bg-slate-50 rounded-xl p-3.5 text-center">
              <p className="text-xs text-slate-500 mb-0.5">{l}</p>
              <p className="text-base font-display font-800 text-slate-900">{v}</p>
            </div>
          ))}
        </div>
        <Button fullWidth size="lg" onClick={() => setPhase('quiz')}>Start Quiz</Button>
        <button onClick={() => navigate(-1)} className="w-full mt-3 text-sm text-slate-500 hover:text-slate-700 transition-colors">Back to lesson</button>
      </div>
    </div>
  )

  /* ---- RESULT ---- */
  if (phase === 'result') return (
    <div className="-m-6 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 max-w-lg w-full">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${pass ? 'bg-emerald-100' : 'bg-red-100'}`}>
          {pass ? <CheckCircle className="w-8 h-8 text-emerald-600" /> : <XCircle className="w-8 h-8 text-red-500" />}
        </div>
        <h1 className="font-display text-2xl font-800 text-slate-900 text-center">{pass ? 'Passed! 🎉' : 'Not quite'}</h1>
        <div className="flex items-center justify-center gap-2 mt-2 mb-2">
          <span className="text-4xl font-display font-800 text-slate-900">{score}/{questions.length}</span>
        </div>
        <p className={`text-center text-sm font-semibold mb-6 ${pass ? 'text-emerald-600' : 'text-red-500'}`}>
          {Math.round((score / questions.length) * 100)}% — {pass ? 'You passed!' : 'Required: 75%'}
        </p>

        <div className="space-y-2.5 mb-7">
          {questions.map((q, i) => {
            const ok = answers[i] === q.correct
            return (
              <div key={i} className={`rounded-xl border p-3.5 ${ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-2.5">
                  {ok ? <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{q.q}</p>
                    {!ok && <p className="text-xs text-emerald-700 mt-1 font-medium">✓ Correct: {q.options[q.correct]}</p>}
                    <p className="text-xs text-slate-500 mt-1">{q.explanation}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          {!pass && (
            <Button variant="outline" className="flex-1" onClick={() => { setAnswers(Array(questions.length).fill(null)); setFlagged(Array(questions.length).fill(false)); setCurrent(0); setPhase('intro') }}>
              Try Again
            </Button>
          )}
          <Button className="flex-1" onClick={() => navigate('/student/learn/1')}>Back to Course</Button>
        </div>
      </div>
    </div>
  )

  /* ---- QUIZ ---- */
  const q = questions[current]
  const progressPct = (answered / questions.length) * 100

  return (
    <div className="-m-6 min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="text-xs text-slate-500 font-medium">React Hooks Quiz</p>
          <p className="text-sm font-semibold text-slate-900">Question {current + 1} <span className="text-slate-400 font-normal">of {questions.length}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700 tabular-nums">12:48</span>
          </div>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={[
                  'w-7 h-7 rounded-lg text-xs font-bold transition-colors',
                  i === current ? 'bg-blue-600 text-white' :
                  answers[i] !== null ? 'bg-emerald-100 text-emerald-700' :
                  flagged[i]  ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
                ].join(' ')}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-200">
        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Question card */}
      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Question header */}
            <div className="px-6 pt-6 pb-5 border-b border-slate-100">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">{current + 1}</span>
                  <h2 className="text-base font-semibold text-slate-900 leading-snug">{q.q}</h2>
                </div>
                <button
                  onClick={toggleFlag}
                  className={`p-2 rounded-xl flex-shrink-0 transition-all ${flagged[current] ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`}
                  title={flagged[current] ? 'Unflag question' : 'Flag for review'}
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="p-4 space-y-2.5">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  className={[
                    'w-full flex items-center gap-3.5 text-left px-4 py-3.5 rounded-xl border-2 transition-all text-sm font-medium',
                    answers[current] === i
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50',
                  ].join(' ')}
                >
                  <span className={[
                    'w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold border-2 transition-colors',
                    answers[current] === i
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 text-slate-500',
                  ].join(' ')}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {/* Nav */}
            <div className="px-6 pb-6 flex items-center justify-between">
              <Button variant="outline" icon={<ChevronLeft className="w-4 h-4" />} onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
                Previous
              </Button>
              {current < questions.length - 1 ? (
                <Button iconRight={<ChevronRight className="w-4 h-4" />} onClick={() => setCurrent(current + 1)} disabled={answers[current] === null}>
                  Next Question
                </Button>
              ) : (
                <Button variant="success" onClick={() => setConfirmSubmit(true)} disabled={answered < questions.length}>
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>

          {/* Flagged notice */}
          {flagged.some(Boolean) && (
            <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
              <Flag className="w-3.5 h-3.5" />{flagged.filter(Boolean).length} question(s) flagged for review
            </div>
          )}
          {answered < questions.length && current === questions.length - 1 && (
            <div className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />{questions.length - answered} question(s) unanswered. Answer all before submitting.
            </div>
          )}
        </div>
      </div>

      {/* Submit confirmation overlay */}
      {confirmSubmit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-display text-lg font-800 text-slate-900 mb-2">Submit Quiz?</h3>
            <p className="text-sm text-slate-500 mb-5">You answered <strong className="text-slate-800">{answered} of {questions.length}</strong> questions. You won&apos;t be able to change your answers after submitting.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmSubmit(false)}>Review Answers</Button>
              <Button className="flex-1" onClick={() => { setConfirmSubmit(false); setPhase('result') }}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
