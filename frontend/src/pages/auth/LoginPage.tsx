import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Loader2, AlertCircle, Server, CheckCircle2, RefreshCw } from 'lucide-react'
import { useAuth, getRoleHome } from '../../context/AuthContext'
import { getApiBaseUrl, normalizeApiUrl } from '../../api/client'
import axios from 'axios'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [remember, setRemember] = useState(false)
  
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
    const url = normalizeApiUrl(targetUrl || getApiBaseUrl());
    // Get base root without /api/v1 for root health
    const rootUrl = url.replace(/\/api\/v1\/?$/, '');
    setApiStatus('checking');
    setApiStatusMsg('Connecting to endpoint...');
    try {
      const res = await axios.get(rootUrl ? `${rootUrl}/` : '/api/v1/health', { timeout: 15000 });
      if (res.status === 200) {
        setApiStatus('online');
        setApiStatusMsg('Backend is online and responsive!');
      } else {
        setApiStatus('online');
        setApiStatusMsg(`Received status: ${res.status}`);
      }
    } catch (err: any) {
      setApiStatus('offline');
      if (err.code === 'ECONNABORTED') {
        setApiStatusMsg('Server waking up (Render spin-up takes ~30s on free tier). Please retry shortly.');
      } else {
        setApiStatusMsg(`Cannot reach ${url}. Please verify URL or check CORS settings.`);
      }
    }
  };

  useEffect(() => {
    testBackendConnection();
  }, []);

  const handleSaveCustomApi = () => {
    if (!customUrlInput.trim()) {
      localStorage.removeItem('custom_api_url');
    } else {
      localStorage.setItem('custom_api_url', customUrlInput.trim());
    }
    const updated = getApiBaseUrl();
    setApiEndpoint(updated);
    testBackendConnection(updated);
    setShowApiConfig(false);
  };

  const handleLogin = async (e?: React.FormEvent, customCredentials?: { email: string; pass: string }) => {
    if (e) e.preventDefault();
    setError('');
    
    const loginEmail = customCredentials ? customCredentials.email : email.trim();
    const loginPassword = customCredentials ? customCredentials.pass : password;

    if (!loginEmail) { setError('Email is required'); return }
    if (!loginPassword) { setError('Password is required'); return }
    
    setLoading(true);
    try {
      const loggedUser = await login({ email: loginEmail, password: loginPassword });
      const requestedPath = (location.state as any)?.from?.pathname;
      if (requestedPath && !['/login', '/register'].includes(requestedPath)) {
        navigate(requestedPath, { replace: true });
      } else {
        navigate(getRoleHome(loggedUser.role), { replace: true });
      }
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Backend request timed out (Render free tier may take 30s to spin up on first request). Please wait a moment and try again.');
      } else if (err.message === 'Network Error' || !err.response) {
        setError(`Unable to connect to backend (${getApiBaseUrl()}). Please ensure Render service is awake and CORS is active.`);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-700 text-slate-900">LearnFlow</span>
          </div>

          <h2 className="text-2xl font-display font-700 text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in to your account to continue</p>

          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
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
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Demo Accounts (1-Click Fill)</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@lms.com');
                  setPassword('Admin@123456');
                  setError('');
                }}
                className="px-2.5 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all text-center cursor-pointer shadow-2xs"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('sarah.instructor@lms.com');
                  setPassword('Instructor@123');
                  setError('');
                }}
                className="px-2.5 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all text-center cursor-pointer shadow-2xs"
              >
                Instructor
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('emma.student@lms.com');
                  setPassword('Student@123');
                  setError('');
                }}
                className="px-2.5 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all text-center cursor-pointer shadow-2xs"
              >
                Student
              </button>
            </div>
          </div>

          {/* Live Backend Connection Indicator & Direct Configurator */}
          <div className="mt-4 p-3 bg-slate-100 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500 animate-pulse' : apiStatus === 'checking' ? 'bg-amber-400 animate-ping' : 'bg-rose-500'}`} />
                <span className="text-xs font-mono text-slate-600 truncate max-w-[200px]" title={apiEndpoint}>
                  {apiEndpoint}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => testBackendConnection()}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors"
                  title="Test connection"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${apiStatus === 'checking' ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowApiConfig(!showApiConfig)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  {showApiConfig ? 'Close' : 'Change URL'}
                </button>
              </div>
            </div>

            {apiStatusMsg && (
              <p className={`text-[11px] mt-1.5 ${apiStatus === 'online' ? 'text-emerald-700' : 'text-slate-500'}`}>
                {apiStatusMsg}
              </p>
            )}

            {showApiConfig && (
              <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-2">
                <label className="text-[11px] font-medium text-slate-700 block">
                  Custom Render Backend URL:
                </label>
                <input
                  type="url"
                  placeholder="https://your-backend.onrender.com"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomUrlInput('');
                      localStorage.removeItem('custom_api_url');
                      const updated = getApiBaseUrl();
                      setApiEndpoint(updated);
                      testBackendConnection(updated);
                      setShowApiConfig(false);
                    }}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Reset Default
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomApi}
                    className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    Save & Test
                  </button>
                </div>
              </div>
            )}
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
