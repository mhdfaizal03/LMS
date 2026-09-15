import { useState } from 'react'
import { Camera, Save } from 'lucide-react'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'

export default function StudentProfile() {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">My Profile</h2>
        {!editing ? (
          <Button variant="outline" onClick={() => setEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            <Button icon={<Save className="w-4 h-4" />} onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700 font-medium">
          Profile updated successfully!
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-display font-700 text-2xl">AJ</div>
            {editing && (
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Full Name</label>
                {editing ? (
                  <input defaultValue="Alex Johnson" className="w-full h-9 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                ) : (
                  <p className="text-sm font-medium text-slate-900">Alex Johnson</p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Email</label>
                {editing ? (
                  <input defaultValue="alex@student.edu" className="w-full h-9 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                ) : (
                  <p className="text-sm text-slate-700">alex@student.edu</p>
                )}
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Bio</label>
                {editing ? (
                  <textarea defaultValue="Frontend developer passionate about UI/UX. Currently upskilling in React and design systems." rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                ) : (
                  <p className="text-sm text-slate-700">Frontend developer passionate about UI/UX. Currently upskilling in React and design systems.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning stats */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Learning Statistics</h3>
        <div className="grid grid-cols-2 gap-4 mb-5">
          {[
            { label: 'Courses Enrolled', value: '3' },
            { label: 'Courses Completed', value: '2' },
            { label: 'Certificates Earned', value: '2' },
            { label: 'Total Hours Learned', value: '47.5 hrs' },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-500 text-xs">{s.label}</p>
              <p className="text-xl font-display font-700 text-slate-900 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Course Progress</h4>
        <div className="space-y-3">
          {[
            { course: 'React Fundamentals', progress: 78 },
            { course: 'UX Design Mastery', progress: 45 },
            { course: 'Data Science with Python', progress: 22 },
          ].map(c => (
            <div key={c.course}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700">{c.course}</span>
              </div>
              <ProgressBar value={c.progress} showLabel />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
