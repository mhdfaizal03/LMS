import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { GraduationCap, Loader2, AlertCircle, Sparkles, BookOpen, Presentation, CheckCircle, ArrowRight, Sun, Moon } from 'lucide-react'
import { useAuth, getRoleHome } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') === 'instructor' ? 'instructor' : 'student'

  const { register } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'instructor'>(defaultRole)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0
    let score = 0
    if (password.length >= 6) score += 25
    if (password.length >= 8) score += 25
    if (/[A-Z]/.test(password)) score += 25
    if (/[0-9!@#$%^&*]/.test(password)) score += 25
    return score
  }

  const strength = getPasswordStrength()
  const strengthColor = strength <= 25 ? 'bg-rose-500' : strength <= 50 ? 'bg-amber-500' : strength <= 75 ? 'bg-blue-500' : 'bg-emerald-500'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Full name is required'); return }
    if (!email.trim()) { setError('Email address is required'); return }
    if (!password || password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    try {
      const registeredUser = await register({ name: name.trim(), email: email.trim(), password, role })
      navigate(getRoleHome(registeredUser.role), { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-500/20 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-500/15 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Theme Toggle (top right) */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 shadow-sm transition-all cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Left branding panel */}
      <div className="hidden lg:flex w-[440px] xl:w-[500px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex-col justify-between p-12 flex-shrink-0 relative overflow-hidden border-r border-slate-800">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Brand Header */}
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

        {/* Feature Highlights */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-medium mb-6 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Unlock Your True Potential</span>
          </div>

          <blockquote className="text-slate-200 text-xl xl:text-2xl font-display font-medium leading-relaxed mb-6">
            &ldquo;Join over 12,000 students and leading industry instructors elevating skill sets in real-time.&rdquo;
          </blockquote>

          <div className="space-y-3 pt-2">
            {[
              'Interactive video lessons with synchronized notes',
              'Automated quizzes, grading & accredited certificates',
              'Rich analytics & personalized learning pathways'
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm font-medium">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-3.5 pt-4">
          {[
            { value: '100% Free', label: 'Starter Curriculum' },
            { value: 'Verified', label: 'Course Certificates' }
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4">
              <p className="text-white font-display font-bold text-xl tracking-tight">{stat.value}</p>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 z-10">
        <div className="w-full max-w-md">
          {/* Mobile Brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 dark:text-white text-lg">EduPulse LMS</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise Learning</p>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5">
              Choose your role and start your learning or teaching adventure
            </p>
          </div>

          {/* Role selector cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                role === 'student'
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/80 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${role === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                {role === 'student' && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                )}
              </div>
              <div>
                <p className={`text-xs font-bold ${role === 'student' ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                  Student
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Learn & earn certificates
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('instructor')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                role === 'instructor'
                  ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500/80 dark:border-purple-500 ring-2 ring-purple-500/20'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${role === 'instructor' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                  <Presentation className="w-4 h-4" />
                </div>
                {role === 'instructor' && (
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                )}
              </div>
              <div>
                <p className={`text-xs font-bold ${role === 'instructor' ? 'text-purple-950 dark:text-purple-200' : 'text-slate-800 dark:text-slate-200'}`}>
                  Instructor
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Create courses & teach
                </p>
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs sm:text-sm text-rose-700 dark:text-rose-300 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => { setName(e.target.value); setError('') }}
                placeholder="Alex Morgan"
                className="w-full h-11 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-slate-900/80 shadow-xs transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="you@domain.com"
                className="w-full h-11 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-slate-900/80 shadow-xs transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="At least 6 characters"
                className="w-full h-11 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-slate-900/80 shadow-xs transition-all"
              />
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${strengthColor}`} 
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Strength: {strength <= 25 ? 'Weak' : strength <= 50 ? 'Fair' : strength <= 75 ? 'Good' : 'Strong'}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Get Started for Free</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-6 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
