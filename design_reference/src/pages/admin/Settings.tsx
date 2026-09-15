import { useState } from 'react'
import { Save } from 'lucide-react'
import Button from '../../components/ui/Button'

const sections = ['General', 'Branding', 'Users & Roles', 'Security', 'Notifications', 'Email', 'Storage']

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('General')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex gap-6">
      <div className="w-48 flex-shrink-0">
        <nav className="space-y-0.5">
          {sections.map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === s ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {s}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 space-y-5">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-1">{activeSection} Settings</h2>
          <p className="text-sm text-slate-500 mb-6">Configure {activeSection.toLowerCase()} preferences for your platform.</p>

          {activeSection === 'General' && (
            <div className="space-y-5 max-w-lg">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Platform Name</label>
                <input defaultValue="LearnFlow" className="w-full h-9 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Platform URL</label>
                <input defaultValue="https://learnflow.co" className="w-full h-9 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Support Email</label>
                <input defaultValue="support@learnflow.co" className="w-full h-9 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Timezone</label>
                <select className="w-full h-9 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>America/New_York (Eastern Time)</option>
                  <option>America/Los_Angeles (Pacific Time)</option>
                  <option>Europe/London (GMT)</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Allow user registration</p>
                    <p className="text-xs text-slate-500">New users can create accounts on the platform</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeSection === 'Security' && (
            <div className="space-y-5 max-w-lg">
              {[
                { label: 'Two-factor authentication', desc: 'Require 2FA for all admin accounts', enabled: true },
                { label: 'Session timeout', desc: 'Automatically log out after 30 minutes of inactivity', enabled: true },
                { label: 'Password requirements', desc: 'Enforce strong password policy', enabled: true },
                { label: 'Login attempt limits', desc: 'Lock account after 5 failed login attempts', enabled: false },
              ].map((opt, i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer">
                  <div className="relative mt-0.5">
                    <input type="checkbox" defaultChecked={opt.enabled} className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {!['General', 'Security'].includes(activeSection) && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">{activeSection} settings would appear here</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} icon={<Save className="w-4 h-4" />}>
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
