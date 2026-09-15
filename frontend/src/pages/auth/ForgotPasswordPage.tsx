import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-700 text-slate-900">LearnFlow</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <h2 className="text-xl font-display font-700 text-slate-900 mb-2">Check your email</h2>
            <p className="text-slate-500 text-sm mb-6">We sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 justify-center">
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-display font-700 text-slate-900 mb-2">Reset your password</h2>
            <p className="text-slate-500 text-sm mb-8">Enter your email and we&apos;ll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
            <Link to="/login" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mt-6">
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
