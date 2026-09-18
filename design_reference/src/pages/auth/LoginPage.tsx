import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

const quickRoles = [
  { label: 'Admin',      email: 'admin@learnflow.co',      route: '/admin',      color: 'bg-violet-600', border: 'hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700' },
  { label: 'Instructor', email: 'instructor@learnflow.co', route: '/instructor', color: 'bg-blue-600',   border: 'hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'     },
  { label: 'Student',    email: 'student@edu.com',         route: '/student',    color: 'bg-emerald-600',border: 'hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700' },
]

const testimonials = [
  { text: 'LearnFlow transformed how we deliver professional development.', name: 'Jessica Hart', title: 'VP of Learning, Meridian Corp', initials: 'JH' },
  { text: 'Our course completion rates went from 52% to 89% in one semester.', name: 'Prof. Lin Zhang', title: 'Department Head, State University', initials: 'LZ' },
]

export default function LoginPage() {
  const [email, setEmail]   = useState('')
  const [pw, setPw]         = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [remember, setRemember] = useState(false)
  const [tIdx] = useState(0)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Email is required.'); return }
    if (!pw)           { setError('Password is required.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    if (email.includes('admin')) navigate('/admin')
    else if (email.includes('instructor')) navigate('/instructor')
    else navigate('/student')
  }

  const quickLogin = (role: typeof quickRoles[0]) => {
    setEmail(role.email)
    setPw('password')
    setError('')
    setTimeout(async () => {
      setLoading(true)
      await new Promise(r => setTimeout(r, 700))
      setLoading(false)
      navigate(role.route)
    }, 100)
  }

  const t = testimonials[tIdx]

  return (
    <div className="min-h-screen flex bg-white">

      {/* Left panel */}
      <div className="hidden lg:flex w-[420px] xl:w-[480px] flex-col justify-between flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)' }}>
        <div className="absolute inset-0 hero-mesh pointer-events-none" />

        <div className="relative px-10 pt-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-800 text-white text-xl tracking-tight">LearnFlow</span>
          </div>
        </div>

        <div className="relative px-10 py-12">
          <div className="mb-10">
            <blockquote className="text-slate-300 text-lg font-display leading-relaxed mb-5 italic">
              &ldquo;{t.text}&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-300 text-sm font-bold">{t.initials}</div>
              <div>
                <p className="text-white text-sm font-semibold">{t.name}</p>
                <p className="text-slate-500 text-xs">{t.title}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[['12,400+', 'Active learners'], ['340+', 'Published courses'], ['94%', 'Completion rate'], ['4.8★', 'Average rating']].map(([v, l]) => (
              <div key={l} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="font-display font-800 text-white text-xl">{v}</p>
                <p className="text-slate-500 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-[360px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><GraduationCap className="w-4 h-4 text-white" /></div>
            <span className="font-display font-800 text-slate-900">LearnFlow</span>
          </div>

          <h2 className="font-display text-2xl font-800 text-slate-900 leading-tight mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your account to continue learning.</p>

          {/* Quick access */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2.5">Quick sign in as</p>
            <div className="flex gap-2">
              {quickRoles.map(r => (
                <button
                  key={r.label}
                  onClick={() => quickLogin(r)}
                  disabled={loading}
                  className={`flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 transition-all ${r.border} disabled:opacity-50`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or sign in manually</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                autoComplete="email"
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="you@example.com"
                className="w-full h-11 bg-white border border-slate-300 rounded-xl px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  autoComplete="current-password"
                  onChange={e => { setPw(e.target.value); setError('') }}
                  placeholder="••••••••"
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-600">Remember me for 30 days</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">Create account</a>
          </p>
        </div>
      </div>
    </div>
  )
}
