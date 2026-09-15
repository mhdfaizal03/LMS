import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Loader2, AlertCircle } from 'lucide-react'

const roles = [
  { label: 'Admin', path: '/admin', email: 'admin@learnflow.co', color: 'bg-violet-600' },
  { label: 'Instructor', path: '/instructor', email: 'instructor@learnflow.co', color: 'bg-blue-600' },
  { label: 'Student', path: '/student', email: 'student@edu.com', color: 'bg-emerald-600' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) { setError('Email is required'); return }
    if (!password) { setError('Password is required'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    if (email.includes('admin')) navigate('/admin')
    else if (email.includes('instructor')) navigate('/instructor')
    else navigate('/student')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-96 xl:w-[480px] bg-slate-900 flex-col justify-between p-10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-700 text-white text-lg">LearnFlow</span>
        </div>
        <div>
          <blockquote className="text-slate-300 text-xl font-display leading-relaxed mb-6">
            "LearnFlow transformed how we deliver professional development across our 3,000-person organization."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-300 font-semibold">JH</div>
            <div>
              <p className="text-white text-sm font-medium">Jessica Hart</p>
              <p className="text-slate-500 text-sm">VP of Learning, Meridian Corp</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[['12,000+', 'Active learners'], ['340+', 'Courses published'], ['94%', 'Completion rate'], ['4.8★', 'Average rating']].map(([v, l]) => (
            <div key={l} className="bg-slate-800 rounded-xl p-4">
              <p className="text-white font-display font-700 text-xl">{v}</p>
              <p className="text-slate-500 text-sm mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-700 text-slate-900">LearnFlow</span>
          </div>

          <h2 className="text-2xl font-display font-700 text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your account to continue</p>

          {/* Quick access */}
          <div className="mb-6">
            <p className="text-xs text-slate-500 mb-2 font-medium">Quick access as:</p>
            <div className="flex gap-2">
              {roles.map(r => (
                <button
                  key={r.label}
                  onClick={() => { setEmail(r.email); setPassword('password'); }}
                  className="flex-1 text-xs py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors font-medium"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="you@example.com"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••"
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-600">Remember me for 30 days</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Create account</a>
          </p>
        </div>
      </div>
    </div>
  )
}
