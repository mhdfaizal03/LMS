import React, { useState, useEffect } from 'react'
import { Camera, Save, Edit2, Mail, Phone, MapPin, Globe, Award, BookOpen, Target, Zap, Shield, CheckCircle2, Calendar } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import { useAuth } from '../../context/AuthContext'
import { uploadApi } from '../../api'

// Mock data for stats/progress until backend API is ready
const courses = [
  { title: 'React Fundamentals',  progress: 78, grade: 'A', color: 'bg-blue-500' },
  { title: 'UX Design Mastery',   progress: 100, grade: 'A+', color: 'bg-violet-500' },
  { title: 'Python for Data',     progress: 42, grade: '—', color: 'bg-emerald-500' },
]

export default function StudentProfile() {
  const { user, updateUserProfile } = useAuth()

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [profileImage, setProfileImage] = useState(user?.profile_image || '')
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setBio(user.bio || '')
      setPhone(user.phone || '')
      setProfileImage(user.profile_image || '')
    }
  }, [user])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploadingAvatar(true)
      const res = await uploadApi.uploadFile(file, 'avatars')
      setProfileImage(res.url)
      await updateUserProfile({ profile_image: res.url })
    } catch (err) {
      console.error('Avatar upload error:', err)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await updateUserProfile({
        name: name.trim(),
        bio: bio.trim(),
        phone: phone.trim(),
        profile_image: profileImage,
      })
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Failed to update profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'ST'

  const Field = ({ label, value, onChange, icon, editable }: { label: string; value: string; onChange?: (val: string) => void; icon: React.ReactNode; editable: boolean }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      {editing && editable ? (
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-9 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-400 transition-all">
          <span className="text-slate-400">{icon}</span>
          <input className="flex-1 text-sm text-slate-800 bg-transparent outline-none" value={value} onChange={e => onChange?.(e.target.value)} />
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-slate-700 py-1">
          <span className="text-slate-400">{icon}</span>{value || <span className="text-slate-400 italic">Not provided</span>}
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-800 font-semibold flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 12px)',
          }} />
        </div>
        <div className="px-6 pb-5">
          <div className="flex items-end justify-between -mt-8 mb-4">
            <div className="relative group">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={user?.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-white flex items-center justify-center text-white font-display text-2xl font-800 shadow-sm">
                  {initials}
                </div>
              )}
              {editing && (
                <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors cursor-pointer z-10">
                  <Camera className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploadingAvatar} />
                </label>
              )}
            </div>
            
            {!editing ? (
              <Button
                size="sm"
                variant="outline"
                icon={<Edit2 className="w-3.5 h-3.5" />}
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  setEditing(false)
                  setName(user?.name || '')
                  setBio(user?.bio || '')
                  setPhone(user?.phone || '')
                }}>Cancel</Button>
                <Button size="sm" variant="primary" icon={<Save className="w-3.5 h-3.5" />} onClick={handleSave} disabled={saving} loading={saving}>
                  Save Profile
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="font-display text-xl font-800 text-slate-900 border-b border-blue-300 focus:border-blue-600 outline-none bg-transparent mb-1 w-full max-w-sm px-1 py-0.5"
                  placeholder="Your Name"
                />
              ) : (
                <h1 className="font-display text-xl font-800 text-slate-900">{user?.name || 'Student'}</h1>
              )}
              <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5 capitalize">
                <Shield className="w-3.5 h-3.5" /> {user?.role} Account · Member of LearnFlow
              </p>
              <div className="flex gap-2 mt-2.5">
                <Badge variant="default">Learner</Badge>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Info + Bio */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="font-display text-sm font-700 text-slate-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email (Read Only)" value={user?.email || ''} icon={<Mail className="w-3.5 h-3.5" />} editable={false} />
              <Field label="Phone" value={phone} onChange={setPhone} icon={<Phone className="w-3.5 h-3.5" />} editable={true} />
              <Field label="Location" value="Earth" icon={<MapPin className="w-3.5 h-3.5" />} editable={false} />
              <Field label="Website" value="" icon={<Globe className="w-3.5 h-3.5" />} editable={false} />
            </div>
            
            <div className="mt-5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Bio / Introduction</label>
              {editing ? (
                <textarea
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all resize-none"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us a little about yourself..."
                />
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {bio || <span className="italic text-slate-400">No bio provided yet. Edit your profile to add one.</span>}
                </p>
              )}
            </div>
          </div>

          {/* Course progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h2 className="font-display text-sm font-700 text-slate-900 mb-4">Enrolled Courses</h2>
            <div className="space-y-5">
              {courses.map(c => (
                <div key={c.title}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-800">{c.title}</span>
                    <div className="flex items-center gap-2">
                      {c.grade !== '—' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">{c.grade}</span>}
                      <span className="text-xs text-slate-500">{c.progress}%</span>
                    </div>
                  </div>
                  <ProgressBar value={c.progress} max={100} color={c.color} showLabel={false} />
                  {c.progress === 100 && <p className="text-xs text-emerald-600 font-medium mt-1">Completed · Certificate earned</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-display text-sm font-700 text-slate-900 mb-4">Learning Stats</h3>
            <div className="space-y-4">
              {[
                { icon: <BookOpen className="w-4 h-4 text-blue-500" />,   label: 'Courses enrolled', value: '3' },
                { icon: <Award className="w-4 h-4 text-amber-500" />,     label: 'Certificates earned', value: '1' },
                { icon: <Target className="w-4 h-4 text-violet-500" />,   label: 'Quizzes passed', value: '11' },
                { icon: <Zap className="w-4 h-4 text-emerald-500" />,     label: 'Day streak', value: '14' },
                { icon: <Calendar className="w-4 h-4 text-slate-400" />,  label: 'Hours learned', value: '47' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">{s.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">{s.label}</p>
                    <p className="text-sm font-bold text-slate-900">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white shadow-md">
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
