import { Award, Download, ExternalLink, Share2, ShieldCheck } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

const certs = [
  { id: 'LF-2024-001842', course: 'React Fundamentals',   instructor: 'Dr. Marcus Reid', issued: 'June 18, 2024', grade: '94%', skills: ['React', 'Hooks', 'State Management', 'JSX'] },
  { id: 'LF-2024-002109', course: 'UX Design Mastery',    instructor: 'Sarah Kim',       issued: 'August 3, 2024', grade: '88%', skills: ['User Research', 'Figma', 'Prototyping', 'Usability'] },
]

export default function StudentCertificates() {
  return (
    <div className="space-y-6 max-w-[960px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">My Certificates</h1>
          <p className="text-sm text-slate-500 mt-0.5">{certs.length} certificates earned · Verified by LearnFlow</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> Blockchain verified
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {certs.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">

            {/* Certificate visual */}
            <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 60%, #312E81 100%)', padding: '2px' }}>
              <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 60%, #312E81 100%)', borderRadius: '14px 14px 0 0' }}>
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 40px)',
                }} />
                <div className="relative px-7 py-7 text-center">
                  {/* Corner ornaments */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-400/40 rounded-tl-sm" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-400/40 rounded-tr-sm" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-400/40 rounded-bl-sm" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-400/40 rounded-br-sm" />

                  <Award className="w-10 h-10 text-amber-400 mx-auto mb-3 drop-shadow-sm" />
                  <p className="text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">Certificate of Completion</p>
                  <p className="font-display font-800 text-white text-lg leading-tight mb-1">Alex Johnson</p>
                  <p className="text-blue-200 text-xs mb-3">has successfully completed</p>
                  <p className="font-display font-800 text-white text-base mb-1">{c.course}</p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <span className="text-xs text-blue-300">Grade:</span>
                    <span className="text-amber-400 font-bold text-sm">{c.grade}</span>
                    <span className="text-blue-400 text-xs">·</span>
                    <span className="text-xs text-blue-300">{c.issued}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-800/50 flex items-center justify-between text-xs text-blue-400">
                    <span>{c.instructor}</span>
                    <span className="font-mono tracking-tight">{c.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">Skills Covered</p>
              <div className="flex flex-wrap gap-1.5">
                {c.skills.map(skill => (
                  <Badge key={skill} variant="muted">{skill}</Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-4 flex items-center gap-2">
              <Button size="sm" icon={<Download className="w-3.5 h-3.5" />} className="flex-1">Download PDF</Button>
              <Button size="sm" variant="outline" icon={<Share2 className="w-3.5 h-3.5" />}>Share</Button>
              <Button size="sm" variant="ghost" icon={<ExternalLink className="w-3.5 h-3.5" />}>Verify</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty slot */}
      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
        <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Complete more courses to earn certificates</p>
        <p className="text-xs text-slate-400 mt-1">You have 1 course at 78% completion</p>
        <Button size="sm" variant="outline" className="mt-4">Resume Learning</Button>
      </div>
    </div>
  )
}
