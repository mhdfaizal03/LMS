import { useState, useEffect } from 'react'
import { Camera, Save, Loader2, Check, User as UserIcon } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { uploadApi } from '../../api'

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
    : 'LF'

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-700 text-slate-900">User Profile</h2>
          <p className="text-xs text-slate-500">Manage your account information and preferences</p>
        </div>

        {!editing ? (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditing(false)
                setName(user?.name || '')
                setBio(user?.bio || '')
                setPhone(user?.phone || '')
              }}
            >
              Cancel
            </Button>
            <Button size="sm" disabled={saving} icon={<Save className="w-3.5 h-3.5" />} onClick={handleSave}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile updated and synced with database!</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="relative">
            {profileImage ? (
              <img
                src={profileImage}
                alt={user?.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-xs"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-display font-700 text-2xl shadow-xs">
                {initials}
              </div>
            )}
            <label className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-xs hover:bg-slate-50 cursor-pointer transition-colors">
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full h-9 border border-slate-300 rounded-lg px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-900">{user?.name || 'Student'}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                  Email Address
                </label>
                <p className="text-xs text-slate-600 font-mono py-1.5">{user?.email}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                  Role
                </label>
                <p className="text-xs text-slate-800 font-semibold capitalize">{user?.role}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-9 border border-slate-300 rounded-lg px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                ) : (
                  <p className="text-xs text-slate-700">{user?.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                  Bio / About Me
                </label>
                {editing ? (
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    placeholder="Tell other learners and instructors about yourself..."
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
                  />
                ) : (
                  <p className="text-xs text-slate-700 leading-relaxed">{user?.bio || 'No bio provided yet.'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
