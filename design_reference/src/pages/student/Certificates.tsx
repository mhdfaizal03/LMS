import { Award, Download, ExternalLink } from 'lucide-react'
import Button from '../../components/ui/Button'

const certs = [
  { id: 'LF-2024-001842', course: 'React Fundamentals', instructor: 'Dr. Marcus Reid', issued: 'June 18, 2024', expires: 'No expiry', grade: '94%' },
  { id: 'LF-2024-002109', course: 'UX Design Mastery', instructor: 'Sarah Kim', issued: 'August 3, 2024', expires: 'No expiry', grade: '88%' },
]

export default function StudentCertificates() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">My Certificates</h2>
        <p className="text-sm text-slate-500">{certs.length} certificates earned</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {certs.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Certificate visual */}
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
              <div className="relative">
                <Award className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                <p className="text-blue-300 text-xs font-medium uppercase tracking-widest mb-2">Certificate of Completion</p>
                <p className="text-white font-display font-700 text-xl mb-1">Alex Johnson</p>
                <p className="text-blue-200 text-sm mb-3">has successfully completed</p>
                <p className="text-white font-display font-700 text-base mb-1">{c.course}</p>
                <p className="text-blue-300 text-xs">with a grade of <strong className="text-amber-400">{c.grade}</strong></p>
                <div className="mt-4 pt-4 border-t border-blue-800 flex items-center justify-between text-xs text-blue-400">
                  <span>Issued: {c.issued}</span>
                  <span>ID: {c.id}</span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><p className="text-xs text-slate-500">Instructor</p><p className="font-medium text-slate-900">{c.instructor}</p></div>
                <div><p className="text-xs text-slate-500">Issued</p><p className="font-medium text-slate-900">{c.issued}</p></div>
                <div><p className="text-xs text-slate-500">Certificate ID</p><p className="font-medium text-slate-700 font-mono text-xs">{c.id}</p></div>
                <div><p className="text-xs text-slate-500">Validity</p><p className="font-medium text-slate-900">{c.expires}</p></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" icon={<Download className="w-3.5 h-3.5" />} className="flex-1">Download PDF</Button>
                <Button size="sm" variant="ghost" icon={<ExternalLink className="w-3.5 h-3.5" />}>Verify</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
