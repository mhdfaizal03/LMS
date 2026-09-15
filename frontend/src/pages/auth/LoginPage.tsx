import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Loader2, AlertCircle } from 'lucide-react'
import { useAuth, getRoleHome } from '../../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) { setError('Email is required'); return }
    if (!password) { setError('Password is required'); return }
    setLoading(true)
    try {
      const loggedUser = await login({ email, password })
      const requestedPath = (location.state as any)?.from?.pathname
      if (requestedPath && !['/login', '/register'].includes(requestedPath)) {
        navigate(requestedPath, { replace: true })
      } else {
        navigate(getRoleHome(loggedUser.role), { replace: true })
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-96 xl:w-[480px] bg-slate-900 flex-col justify-between p-10 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-700 text-white text-lg">LearnFlow</span>
        </div>
        <div>
          <blockquote className="text-slate-300 text-xl font-display leading-relaxed mb-6">
            &ldquo;LearnFlow transformed how we deliver professional learning and certifications across our entire organization.&rdquo;
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

      {/* Right form panel */}
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

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="you@domain.com"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all shadow-xs"
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
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••"
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all shadow-xs"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-slate-600">Remember me for 30 days</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Authenticating with endpoint...' : 'Sign in'}
            </button>
          </form>

          {/* Test credentials helper chips for effortless live endpoint testing */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">Demo Accounts (Live Backend)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setEmail('admin@lms.com'); setPassword('Admin@123456'); setError(''); }}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors text-center cursor-pointer"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => { setEmail('sarah.instructor@lms.com'); setPassword('Instructor@123'); setError(''); }}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors text-center cursor-pointer"
              >
                Instructor
              </button>
              <button
                type="button"
                onClick={() => { setEmail('emma.student@lms.com'); setPassword('Student@123'); setError(''); }}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors text-center cursor-pointer"
              >
                Student
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

