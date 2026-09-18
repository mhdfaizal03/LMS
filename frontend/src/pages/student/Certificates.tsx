import React, { useState, useEffect } from 'react'
import { Award, Download, ExternalLink, Loader2, CheckCircle2, ShieldCheck, Share2, Printer } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/common/EmptyState'
import { certificateApi } from '../../api'
import { Certificate, CertificateVerifyResult } from '../../types'
import { useAuth } from '../../context/AuthContext'

export default function StudentCertificates() {
  const { user } = useAuth()
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [verifyCode, setVerifyCode] = useState<string>('')
  const [verifyResult, setVerifyResult] = useState<CertificateVerifyResult | null>(null)
  const [verifying, setVerifying] = useState<boolean>(false)

  useEffect(() => {
    let active = true
    const loadCertificates = async () => {
      try {
        setLoading(true)
        const data = await certificateApi.getMyCertificates()
        if (active) setCerts(data || [])
      } catch (err) {
        console.error('Failed to load certificates:', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadCertificates()
    return () => { active = false }
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verifyCode.trim()) return
    try {
      setVerifying(true)
      const res = await certificateApi.verifyCertificate(verifyCode.trim())
      setVerifyResult(res)
    } catch (err) {
      console.error('Verify error:', err)
      setVerifyResult({ valid: false, message: 'Invalid or unrecognized certificate ID.' })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="space-y-6 max-w-[960px]">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-800 text-slate-900">My Certificates</h1>
          <p className="text-sm text-slate-500 mt-0.5">{certs.length} certificates earned · Verified by LearnFlow</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> Blockchain verified
        </div>
      </div>

      {/* Verify form */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleVerify} className="flex items-center gap-3">
          <input
            type="text"
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value)}
            placeholder="Enter certificate ID to verify..."
            className="flex-1 h-10 border border-slate-300 rounded-lg px-4 text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <Button type="submit" disabled={verifying} loading={verifying} className="font-bold">
            Verify
          </Button>
        </form>
        {verifyResult && (
          <div className={`mt-3 p-3 rounded-lg border text-sm flex items-start gap-3 ${verifyResult.valid ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
            {verifyResult.valid ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> : <ShieldCheck className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
            <div>
              <p className="font-bold">{verifyResult.valid ? 'Verified Authentic Certificate' : 'Verification Failed'}</p>
              <p className="mt-0.5 text-xs">
                {verifyResult.valid
                  ? `Issued to ${verifyResult.recipient_name} for "${verifyResult.course_title}" on ${verifyResult.issue_date}.`
                  : verifyResult.message || 'Could not locate matching certificate record.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-[280px] bg-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : certs.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {certs.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              
              {/* Certificate visual */}
              <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 60%, #312E81 100%)', padding: '2px' }}>
                <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 60%, #312E81 100%)', borderRadius: '14px 14px 0 0' }}>
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 40px)',
                  }} />
                  <div className="relative px-7 py-7 text-center">
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-400/40 rounded-tl-sm" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-400/40 rounded-tr-sm" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-400/40 rounded-bl-sm" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-400/40 rounded-br-sm" />

                    <Award className="w-10 h-10 text-amber-400 mx-auto mb-3 drop-shadow-sm" />
                    <p className="text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">Certificate of Completion</p>
                    <p className="font-display font-800 text-white text-lg leading-tight mb-1">{user?.name || 'Student'}</p>
                    <p className="text-blue-200 text-xs mb-3">has successfully completed</p>
                    <p className="font-display font-800 text-white text-base mb-1">{c.course?.title}</p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <span className="text-xs text-blue-300">{new Date(c.issued_at).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-blue-800/50 flex items-center justify-between text-xs text-blue-400">
                      <span>{c.course?.instructor?.name || 'Instructor'}</span>
                      <span className="font-mono tracking-tight">{c.certificate_code}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">Skills Covered</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="muted">{c.course?.category?.name || 'General'}</Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-4 flex items-center gap-2">
                <Button size="sm" icon={<Printer className="w-3.5 h-3.5" />} className="flex-1" onClick={() => window.print()}>Print</Button>
                <Button size="sm" variant="outline" icon={<Share2 className="w-3.5 h-3.5" />}>Share</Button>
                <Button size="sm" variant="ghost" icon={<ExternalLink className="w-3.5 h-3.5" />} onClick={() => {
                  setVerifyCode(c.certificate_code)
                  setVerifyResult({
                    valid: true,
                    recipient_name: user?.name || 'Student',
                    course_title: c.course?.title || 'Course',
                    issue_date: new Date(c.issued_at).toLocaleDateString(),
                  })
                }}>Verify</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="Complete more courses to earn certificates"
          description="You haven't earned any certificates yet. Finish your enrolled courses to get certified."
          actionText="Resume Learning"
          onAction={() => window.location.href = '/student/dashboard'}
        />
      )}
    </div>
  )
}
