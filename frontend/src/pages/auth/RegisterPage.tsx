import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { GraduationCap, Loader2, AlertCircle } from 'lucide-react'
import { useAuth, getRoleHome } from '../../context/AuthContext'

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') === 'instructor' ? 'instructor' : 'student'

  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'instructor'>(defaultRole)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Full name is required'); return }
    if (!email.trim()) { setError('Email address is required'); return }
    if (!password || password.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    try {
      const registeredUser = await register({ name, email, password, role })
      navigate(getRoleHome(registeredUser.role), { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
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
            &ldquo;Join millions of students and world-class instructors building the future of online education.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-300 font-semibold">MR</div>
            <div>
              <p className="text-white text-sm font-medium">Dr. Marcus Reid</p>
              <p className="text-slate-500 text-sm">Lead Instructor, LearnFlow</p>
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

          <h2 className="text-2xl font-display font-700 text-slate-900 mb-1">Create Account</h2>
          <p className="text-slate-500 text-sm mb-6">Get started with your free learning account</p>

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${role === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              I&apos;m a Student
            </button>
            <button
              type="button"
              onClick={() => setRole('instructor')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${role === 'instructor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              I&apos;m an Instructor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => { setName(e.target.value); setError('') }}
                placeholder="Alex Johnson"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="you@domain.com"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="At least 6 characters"
                className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
