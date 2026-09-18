import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Loader2, AlertCircle, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react'
import { useAuth, getRoleHome } from '../../context/AuthContext'
import { getApiBaseUrl, normalizeApiUrl } from '../../api/client'
import axios from 'axios'

const quickRoles = [
  { label: 'Admin',      email: 'admin@lms.com',           route: '/admin',      color: 'bg-violet-600', border: 'hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700' },
  { label: 'Instructor', email: 'sarah.instructor@lms.com',route: '/instructor', color: 'bg-blue-600',   border: 'hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'     },
  { label: 'Student',    email: 'emma.student@lms.com',    route: '/student',    color: 'bg-emerald-600',border: 'hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700' },
]

const testimonials = [
  { text: 'LearnFlow transformed how we deliver professional development.', name: 'Jessica Hart', title: 'VP of Learning, Meridian Corp', initials: 'JH' },
  { text: 'Our course completion rates went from 52% to 89% in one semester.', name: 'Prof. Lin Zhang', title: 'Department Head, State University', initials: 'LZ' },
]

export default function LoginPage() {
  const [email, setEmail]   = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [remember, setRemember] = useState(false)
  const [tIdx] = useState(0)

  // API Endpoint customizer & status check
  const [apiEndpoint, setApiEndpoint] = useState(getApiBaseUrl())
  const [showApiConfig, setShowApiConfig] = useState(false)
  const [customUrlInput, setCustomUrlInput] = useState(localStorage.getItem('custom_api_url') || '')
  const [apiStatus, setApiStatus] = useState<'idle' | 'checking' | 'online' | 'offline'>('idle')
  const [apiStatusMsg, setApiStatusMsg] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  // Test backend connectivity
  const testBackendConnection = async (targetUrl?: string) => {
    const url = normalizeApiUrl(targetUrl || getApiBaseUrl())
    const rootUrl = url.replace(/\/api\/v1\/?$/, '')
    setApiStatus('checking')
    setApiStatusMsg('Connecting to endpoint...')
    try {
      const res = await axios.get(rootUrl ? `${rootUrl}/` : '/api/v1/health', { timeout: 15000 })
      if (res.status === 200) {
        setApiStatus('online')
        setApiStatusMsg('Backend is online and responsive!')
      } else {
        setApiStatus('online')
        setApiStatusMsg(`Received status: ${res.status}`)
      }
    } catch (err: any) {
      setApiStatus('offline')
      if (err.code === 'ECONNABORTED') {
        setApiStatusMsg('Server waking up (Free tier takes ~30s on first spin-up). Please retry.')
      } else {
        setApiStatusMsg(`Cannot reach ${url}. Please verify URL or check CORS settings.`)
      }
    }
  }

  useEffect(() => {
    testBackendConnection()
  }, [])

  const handleSaveCustomApi = () => {
    if (!customUrlInput.trim()) {
      localStorage.removeItem('custom_api_url')
    } else {
      localStorage.setItem('custom_api_url', customUrlInput.trim())
    }
    const updated = getApiBaseUrl()
    setApiEndpoint(updated)
    testBackendConnection(updated)
    setShowApiConfig(false)
  }

  const handleLogin = async (e?: React.FormEvent, customCredentials?: { email: string; pass: string }) => {
    if (e) e.preventDefault()
    setError('')
    
    const loginEmail = customCredentials ? customCredentials.email : email.trim()
    const loginPassword = customCredentials ? customCredentials.pass : password

    if (!loginEmail) { setError('Email is required'); return }
    if (!loginPassword) { setError('Password is required'); return }
    
    setLoading(true)
    try {
      const loggedUser = await login({ email: loginEmail, password: loginPassword })
      const requestedPath = (location.state as any)?.from?.pathname
      if (requestedPath && !['/login', '/register'].includes(requestedPath)) {
        navigate(requestedPath, { replace: true })
      } else {
        navigate(getRoleHome(loggedUser.role), { replace: true })
      }
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Backend request timed out (Render free tier may take 30s to spin up on first request). Please wait a moment and try again.')
      } else if (err.message === 'Network Error' || !err.response) {
        setError(`Unable to connect to backend (${getApiBaseUrl()}). Please ensure backend service is awake and CORS is active.`)
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (role: typeof quickRoles[0]) => {
    setEmail(role.email)
    let pass = 'Admin@123456'
    if(role.label === 'Instructor') pass = 'Instructor@123'
    if(role.label === 'Student') pass = 'Student@123'
    setPassword(pass)
    setError('')
    handleLogin(undefined, { email: role.email, pass })
  }

  const t = testimonials[tIdx]

  return (
    <div className="min-h-screen flex bg-slate-50 transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Left panel */}
      <div className="hidden lg:flex w-[440px] xl:w-[500px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex-col justify-between p-12 flex-shrink-0 relative overflow-hidden border-r border-slate-800 z-10">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-2 ring-white/10">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-xl tracking-tight">EduPulse LMS</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-medium text-slate-400">Enterprise Learning v2.0</span>
            </div>
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
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 z-10">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 text-lg">EduPulse LMS</span>
              <p className="text-xs text-slate-500">Enterprise Learning</p>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight mb-1">
              Welcome back
            </h1>
            <p className="text-slate-600 text-sm mt-1.5">
              Sign in to your account to continue learning.
            </p>
          </div>

          {/* Quick access */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2.5">Quick sign in as</p>
            <div className="flex gap-2">
              {quickRoles.map(r => (
                <button
                  key={r.label}
                  type="button"
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
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                autoComplete="email"
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="you@domain.com"
                className="w-full h-11 border border-slate-300 rounded-xl px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 shadow-sm transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  autoComplete="current-password"
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••"
                  className="w-full h-11 border border-slate-300 rounded-xl px-3.5 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 shadow-sm transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
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
              className="w-full h-11 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                : <><span>Sign in securely</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          {/* Live Backend Connection Indicator & Direct Configurator */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                Backend Connection
              </p>
            </div>
            <div className="mt-1 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${apiStatus === 'online' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : apiStatus === 'checking' ? 'bg-amber-400 animate-ping' : 'bg-red-500'}`} />
                  <span className="text-xs font-mono text-slate-600 truncate max-w-[190px]" title={apiEndpoint}>
                    {apiEndpoint}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => testBackendConnection()}
                    className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors"
                    title="Test connection"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${apiStatus === 'checking' ? 'animate-spin text-blue-500' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApiConfig(!showApiConfig)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                  >
                    {showApiConfig ? 'Close' : 'Config'}
                  </button>
                </div>
              </div>

              {apiStatusMsg && (
                <p className={`text-[11px] mt-1.5 ${apiStatus === 'online' ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {apiStatusMsg}
                </p>
              )}

              {showApiConfig && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5 animate-in fade-in">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    Custom Backend API URL:
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-backend.onrender.com"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomUrlInput('')
                        localStorage.removeItem('custom_api_url')
                        const updated = getApiBaseUrl()
                        setApiEndpoint(updated)
                        testBackendConnection(updated)
                        setShowApiConfig(false)
                      }}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                    >
                      Reset Default
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCustomApi}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-sm"
                    >
                      Save & Connect
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
