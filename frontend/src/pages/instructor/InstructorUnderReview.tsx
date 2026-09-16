import { useState } from 'react'
import { Clock, ShieldCheck, Mail, CheckCircle2, AlertCircle, FileText, User as UserIcon, RefreshCw, LogOut, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../api'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function InstructorUnderReview() {
  const { user, logout, refreshUser } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [editingBio, setEditingBio] = useState(false)
  const [bio, setBio] = useState(user?.bio || '')
  const [expertise, setExpertise] = useState(user?.expertise || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const handleRefreshStatus = async () => {
    try {
      setRefreshing(true)
      if (refreshUser) {
        await refreshUser()
      } else {
        const updated = await authApi.getMe()
        if (updated.status === 'active') {
          window.location.reload()
        }
      }
    } catch (err) {
      console.error('Refresh status error:', err)
    } finally {
      setRefreshing(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      await authApi.updateProfile({
        bio: bio.trim(),
        expertise: expertise.trim(),
        phone: phone.trim(),
      })
      setSuccessMsg('Your instructor profile details have been updated for admin review.')
      setEditingBio(false)
    } catch (err) {
      console.error('Update profile error:', err)
    } finally {
      setSaving(false)
    }
  }

  const steps = [
    {
      title: 'Account Registration',
      desc: 'Account created and credentials verified',
      done: true,
      current: false,
    },
    {
      title: 'Admin Background Review',
      desc: 'Administrator is verifying subject matter expertise & credentials',
      done: false,
      current: true,
    },
    {
      title: 'Instructor Portal Activation',
      desc: 'Access granted to publish courses, create quizzes & manage learners',
      done: false,
      current: false,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-6 sm:p-10 font-sans">
      {/* Top bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-white tracking-tight">LearnFlow Instructor Onboarding</h1>
            <p className="text-xs text-slate-400">Application verification in progress</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefreshStatus}
            disabled={refreshing}
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />}
          >
            Check Status
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={logout}
            className="text-slate-400 hover:text-white"
            icon={<LogOut className="w-3.5 h-3.5" />}
          >
            Log Out
          </Button>
        </div>
      </div>

      {/* Main card */}
      <div className="max-w-4xl w-full mx-auto my-8 space-y-6">
        {/* Status banner */}
        <div className="bg-gradient-to-r from-blue-950/60 via-slate-800/80 to-slate-800/60 border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <Badge variant="warning" className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border-amber-500/30">
                  <Clock className="w-3.5 h-3.5 mr-1 animate-pulse" />
                  Application Under Review
                </Badge>
                <span className="text-xs text-slate-400">ID: #{user?.id}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Welcome, {user?.name || 'Instructor'}!
              </h2>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                Thank you for applying to teach on LearnFlow. Our platform administrators review every instructor application to ensure premier curriculum standards. You will receive immediate dashboard access once approved.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 text-center sm:text-right min-w-[200px] shadow-inner">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Estimated Review Time</p>
              <p className="text-xl font-display font-bold text-blue-400 mt-0.5">Within 24 Hours</p>
              <p className="text-[11px] text-slate-500 mt-1">Admin notified automatically</p>
            </div>
          </div>

          {/* Timeline steps */}
          <div className="mt-8 pt-6 border-t border-slate-700/60 grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  step.done
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : step.current
                    ? 'bg-blue-950/30 border-blue-500/40 text-blue-300'
                    : 'bg-slate-900/30 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {step.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : step.current ? (
                    <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </div>
                  )}
                  <p className="text-xs font-bold font-display uppercase tracking-wider">{step.title}</p>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Profile preview & fast editor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Profile Details Submitted for Review */}
          <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-display font-bold text-white">Your Submitted Application Details</h3>
                <p className="text-xs text-slate-400">Administrators use this information to approve your teaching profile.</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingBio(!editingBio)}
                className="border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                {editingBio ? 'Cancel' : 'Edit Information'}
              </Button>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {!editingBio ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                    <p className="text-slate-500 font-medium mb-0.5">Registered Email</p>
                    <p className="text-slate-200 font-mono text-xs">{user?.email}</p>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                    <p className="text-slate-500 font-medium mb-0.5">Contact Phone</p>
                    <p className="text-slate-200">{user?.phone || 'Not specified'}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/40 space-y-1">
                  <p className="text-slate-500 font-medium">Areas of Expertise</p>
                  <p className="text-slate-200">{user?.expertise || 'e.g. Full-Stack Development, React, Cloud Architecture'}</p>
                </div>

                <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/40 space-y-1">
                  <p className="text-slate-500 font-medium">Professional Bio & Credentials</p>
                  <p className="text-slate-300 leading-relaxed">
                    {user?.bio || 'No detailed bio submitted. Click "Edit Information" above to provide your credentials for faster approval.'}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-9 bg-slate-900 border border-slate-700 rounded-lg px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Teaching Expertise</label>
                    <input
                      type="text"
                      value={expertise}
                      onChange={e => setExpertise(e.target.value)}
                      placeholder="e.g. Python, Machine Learning, UI/UX"
                      className="w-full h-9 bg-slate-900 border border-slate-700 rounded-lg px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Professional Bio & Experience</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Describe your industry experience, certifications, and teaching background..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditingBio(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile Updates'}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Col: Admin Contact & Help Card */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Sparkles className="w-5 h-5" />
                <h4 className="text-sm font-display font-bold text-white">Need Fast Track Approval?</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                If you are a certified university professor or enterprise partner, you can contact the platform administration directly for immediate priority approval.
              </p>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/40 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Admin Contact:</span>
                </div>
                <a href="mailto:admin@lms.com" className="text-blue-400 font-mono text-xs hover:underline block">
                  admin@lms.com
                </a>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshStatus}
              disabled={refreshing}
              className="w-full border-blue-500/30 text-blue-300 bg-blue-950/30 hover:bg-blue-900/50"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Approval Status
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-500 pt-6 border-t border-slate-800">
        LearnFlow LMS Enterprise Platform &bull; Role-Based Access Control & Instructor Verification System
      </div>
    </div>
  )
}
