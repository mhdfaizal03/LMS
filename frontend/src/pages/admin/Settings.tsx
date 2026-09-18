import React, { useState } from 'react'
import { Save, Globe, Shield, Bell, Mail, HardDrive, Users, Palette, AlertTriangle } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const sections = [
  { id: 'general',       label: 'General',        icon: <Globe className="w-4 h-4" /> },
  { id: 'branding',      label: 'Branding',        icon: <Palette className="w-4 h-4" /> },
  { id: 'users',         label: 'Users & Roles',   icon: <Users className="w-4 h-4" /> },
  { id: 'security',      label: 'Security',        icon: <Shield className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications',   icon: <Bell className="w-4 h-4" /> },
  { id: 'email',         label: 'Email',           icon: <Mail className="w-4 h-4" /> },
  { id: 'storage',       label: 'Storage',         icon: <HardDrive className="w-4 h-4" /> },
]

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative w-10 rounded-full transition-colors flex-shrink-0 cursor-pointer ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
    style={{ height: '22px' }}
  >
    <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-[18px]' : ''}`} style={{ width: '18px', height: '18px' }} />
  </button>
)

const SettingRow = ({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
)

const FieldRow = ({ label, description, value, type = 'text', onChange }: { label: string; description?: string; value: string; type?: string; onChange: (v: string) => void }) => (
  <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-56 h-9 border border-slate-200 rounded-xl px-3 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
    />
  </div>
)

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('general')
  const [saved, setSaved] = useState(false)
  const [cfg, setCfg] = useState({
    platformName: 'LearnFlow',
    supportEmail: 'support@learnflow.io',
    domain: 'learnflow.io',
    maxFileSizeMb: '500',
    sessionTimeout: '60',
    maintenanceMode: false,
    studentSelfRegister: true,
    instructorApproval: true,
    twoFactorAuth: false,
    emailVerification: true,
    emailNotifications: true,
    enrollmentAlerts: true,
    weeklyDigest: true,
    systemAlerts: true,
    smtpHost: 'smtp.mailgun.org',
    smtpPort: '587',
  })
  const toggle = (k: keyof typeof cfg) => setCfg(c => ({ ...c, [k]: !c[k] }))
  const set = (k: keyof typeof cfg) => (v: string) => setCfg(c => ({ ...c, [k]: v }))

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const panels: Record<string, React.ReactNode> = {
    general: (
      <>
        <FieldRow label="Platform Name"  description="Displayed across the application and emails" value={cfg.platformName}  onChange={set('platformName')} />
        <FieldRow label="Support Email"  description="Users contact this address for help" value={cfg.supportEmail}  onChange={set('supportEmail')} />
        <FieldRow label="Domain"         description="Primary domain for the platform" value={cfg.domain}         onChange={set('domain')} />
        <SettingRow label="Student self-registration" description="Allow new students to sign up without an invitation">
          <Toggle checked={cfg.studentSelfRegister} onChange={() => toggle('studentSelfRegister')} />
        </SettingRow>
        <SettingRow label="Maintenance Mode" description="Take the platform offline for scheduled maintenance">
          <div className="flex items-center gap-3">
            {cfg.maintenanceMode && <Badge variant="warning" dot>Active</Badge>}
            <Toggle checked={cfg.maintenanceMode} onChange={() => toggle('maintenanceMode')} />
          </div>
        </SettingRow>
      </>
    ),
    users: (
      <>
        <SettingRow label="Require instructor approval" description="New instructor accounts must be approved by an admin">
          <Toggle checked={cfg.instructorApproval} onChange={() => toggle('instructorApproval')} />
        </SettingRow>
        <SettingRow label="Email verification" description="Students must verify their email before accessing courses">
          <Toggle checked={cfg.emailVerification} onChange={() => toggle('emailVerification')} />
        </SettingRow>
        <FieldRow label="Session timeout (min)" description="Auto-logout inactive users after this duration" value={cfg.sessionTimeout} onChange={set('sessionTimeout')} />
      </>
    ),
    security: (
      <>
        <SettingRow label="Two-factor authentication" description="Require 2FA for admin and instructor accounts">
          <Toggle checked={cfg.twoFactorAuth} onChange={() => toggle('twoFactorAuth')} />
        </SettingRow>
        <FieldRow label="Session timeout (minutes)" description="Automatically log out inactive users" value={cfg.sessionTimeout} onChange={set('sessionTimeout')} />
        <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Security Review Recommended</p>
            <p className="text-xs text-amber-700 mt-0.5">Enable two-factor authentication to protect admin accounts from unauthorized access.</p>
          </div>
        </div>
      </>
    ),
    notifications: (
      <>
        <SettingRow label="Email notifications" description="Send transactional emails for key events">
          <Toggle checked={cfg.emailNotifications} onChange={() => toggle('emailNotifications')} />
        </SettingRow>
        <SettingRow label="Enrollment alerts" description="Notify instructors when new students enroll">
          <Toggle checked={cfg.enrollmentAlerts} onChange={() => toggle('enrollmentAlerts')} />
        </SettingRow>
        <SettingRow label="Weekly digest" description="Send weekly summaries to admins">
          <Toggle checked={cfg.weeklyDigest} onChange={() => toggle('weeklyDigest')} />
        </SettingRow>
        <SettingRow label="System alerts" description="Critical alerts for errors, downtime, and security events">
          <Toggle checked={cfg.systemAlerts} onChange={() => toggle('systemAlerts')} />
        </SettingRow>
      </>
    ),
    email: (
      <>
        <FieldRow label="SMTP Host" description="Outgoing mail server hostname" value={cfg.smtpHost} onChange={set('smtpHost')} />
        <FieldRow label="SMTP Port" description="Port for SMTP (587 for TLS, 465 for SSL)" value={cfg.smtpPort}  onChange={set('smtpPort')} />
        <FieldRow label="From Address" description="Email shown as the sender" value={cfg.supportEmail} onChange={set('supportEmail')} />
      </>
    ),
    storage: (
      <>
        <FieldRow label="Max upload size (MB)" description="Maximum file size for course media uploads" value={cfg.maxFileSizeMb} onChange={set('maxFileSizeMb')} />
        <div className="py-4">
          <p className="text-sm font-semibold text-slate-800 mb-1">Storage Usage</p>
          <p className="text-xs text-slate-500 mb-3">4.2 GB of 10 GB used</p>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }} />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">42% of your storage plan is in use.</p>
        </div>
      </>
    ),
    branding: (
      <div className="py-4 text-center text-slate-400 text-sm">Branding customization coming soon.</div>
    ),
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">Platform Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Configure your LearnFlow platform preferences</p>
        </div>
        <Button icon={<Save className="w-4 h-4" />} variant={saved ? 'success' : 'primary'} onClick={handleSave}>
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Section nav */}
        <div className="w-full md:w-48 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors text-left border-b border-slate-100 last:border-0
                  ${activeSection === s.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <span className={activeSection === s.id ? 'text-blue-600' : 'text-slate-400'}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Panel */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-display text-base font-bold text-slate-900 mb-1">
            {sections.find(s => s.id === activeSection)?.label}
          </h2>
          <p className="text-xs text-slate-400 mb-4">Configure {sections.find(s => s.id === activeSection)?.label.toLowerCase()} settings for your platform.</p>
          <div className="divide-y divide-slate-100">
            {panels[activeSection] ?? <p className="py-8 text-center text-slate-400 text-sm">No settings available.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
