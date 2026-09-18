import { useState } from 'react'
import { Save, Edit2, Camera, Mail, Phone, Globe, MapPin, Calendar, Award, BookOpen, Target, Zap } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'

const courses = [
  { title: 'React Fundamentals',  progress: 78, grade: 'A', color: 'bg-blue-500' },
  { title: 'UX Design Mastery',   progress: 100, grade: 'A+', color: 'bg-violet-500' },
  { title: 'Python for Data',     progress: 42, grade: '—', color: 'bg-emerald-500' },
]

export default function StudentProfile() {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (415) 555-0182',
    location: 'San Francisco, CA',
    website: 'alexj.dev',
    bio: 'Passionate about building elegant web experiences. Currently focused on React, TypeScript, and design systems.',
  })
  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const Field = ({ label, field, icon }: { label: string; field: keyof typeof form; icon: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {editing ? (
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-9 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-400 transition-all">
          <span className="text-slate-400">{icon}</span>
          <input className="flex-1 text-sm text-slate-800 bg-transparent outline-none" value={form[field]} onChange={set(field)} />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-slate-700 py-1">
          <span className="text-slate-400">{icon}</span>{form[field] || <span className="text-slate-400 italic">Not set</span>}
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-[900px] mx-auto space-y-5">

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 12px)',
          }} />
        </div>
        <div className="px-6 pb-5">
          <div className="flex items-end justify-between -mt-8 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-white flex items-center justify-center text-white font-display text-2xl font-800 shadow-sm">
                AJ
              </div>
              {editing && (
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors">
                  <Camera className="w-3 h-3" />
                </button>
              )}
            </div>
            <Button
              size="sm"
              variant={editing ? 'primary' : 'outline'}
              icon={editing ? <Save className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
              onClick={() => setEditing(e => !e)}
            >
              {editing ? 'Save Profile' : 'Edit Profile'}
            </Button>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-xl font-800 text-slate-900">{form.name}</h1>
              <p className="text-sm text-slate-500 mt-0.5">Student · Joined September 2024</p>
              <div className="flex gap-2 mt-2.5">
                <Badge variant="default">Developer</Badge>
                <Badge variant="violet">Designer</Badge>
                <Badge variant="info">Learner</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Info + Bio */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-display text-sm font-700 text-slate-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email" field="email" icon={<Mail className="w-3.5 h-3.5" />} />
              <Field label="Phone" field="phone" icon={<Phone className="w-3.5 h-3.5" />} />
              <Field label="Location" field="location" icon={<MapPin className="w-3.5 h-3.5" />} />
              <Field label="Website" field="website" icon={<Globe className="w-3.5 h-3.5" />} />
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Bio</label>
              {editing ? (
                <textarea
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all resize-none"
                  value={form.bio}
                  onChange={set('bio')}
                />
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed">{form.bio}</p>
              )}
            </div>
          </div>

          {/* Course progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="font-display text-sm font-700 text-slate-900 mb-4">Enrolled Courses</h2>
            <div className="space-y-4">
              {courses.map(c => (
                <div key={c.title}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-800">{c.title}</span>
                    <div className="flex items-center gap-2">
                      {c.grade !== '—' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{c.grade}</span>}
                      <span className="text-xs text-slate-500">{c.progress}%</span>
                    </div>
                  </div>
                  <ProgressBar value={c.progress} max={100} color={c.color} />
                  {c.progress === 100 && <p className="text-xs text-emerald-600 font-medium mt-1">Completed · Certificate earned</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-display text-sm font-700 text-slate-900 mb-4">Learning Stats</h3>
            <div className="space-y-3">
              {[
                { icon: <BookOpen className="w-4 h-4 text-blue-500" />,   label: 'Courses enrolled', value: '3' },
                { icon: <Award className="w-4 h-4 text-amber-500" />,     label: 'Certificates earned', value: '2' },
                { icon: <Target className="w-4 h-4 text-violet-500" />,   label: 'Quizzes passed', value: '11' },
                { icon: <Zap className="w-4 h-4 text-emerald-500" />,     label: 'Day streak', value: '14' },
                { icon: <Calendar className="w-4 h-4 text-slate-400" />,  label: 'Hours learned', value: '47' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">{s.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">{s.label}</p>
                    <p className="text-sm font-bold text-slate-900">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-blue-200" />
              <h3 className="font-display text-sm font-700">Weekly Goal</h3>
            </div>
            <p className="text-3xl font-display font-800 mb-1">5 / 7 hrs</p>
            <p className="text-blue-200 text-xs mb-3">71% of weekly target</p>
            <div className="h-2 bg-blue-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-white/80 rounded-full" style={{ width: '71%' }} />
            </div>
            <p className="text-xs text-blue-200 mt-2">2 more hours to hit your goal!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
