import { useState, useEffect } from 'react'
import { Award, Download, ExternalLink, Loader2, CheckCircle, Search, ShieldCheck } from 'lucide-react'
import Button from '../../components/ui/Button'
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-700 text-slate-900">Official Certificates</h2>
          <p className="text-sm text-slate-500">
            {certs.length} verified completion {certs.length === 1 ? 'credential' : 'credentials'} earned
          </p>
        </div>

        {/* Quick verify form */}
        <form onSubmit={handleVerify} className="flex items-center gap-2">
          <input
            type="text"
            value={verifyCode}
            onChange={e => setVerifyCode(e.target.value)}
            placeholder="Enter certificate ID..."
            className="h-9 border border-slate-300 rounded-lg px-3 text-xs bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button size="sm" type="submit" disabled={verifying} icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            {verifying ? 'Checking...' : 'Verify'}
          </Button>
        </form>
      </div>

      {verifyResult && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
            verifyResult.valid
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {verifyResult.valid ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold">{verifyResult.valid ? 'Verified Authentic Certificate' : 'Verification Notice'}</p>
            <p className="mt-0.5">
              {verifyResult.valid
                ? `Issued to ${verifyResult.recipient_name} for completing "${verifyResult.course_title}" on ${verifyResult.issue_date}.`
                : verifyResult.message || 'Could not locate matching certificate record.'}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading your earned certificates from server...</p>
        </div>
      ) : certs.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {certs.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              {/* Certificate visual */}
              <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 p-8 text-center relative overflow-hidden text-white">
                <div className="relative z-10">
                  <Award className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-2">
                    Certificate of Mastery
                  </p>
                  <p className="text-white font-display font-700 text-2xl mb-1">{user?.name || 'Student Graduate'}</p>
                  <p className="text-blue-200 text-xs mb-3">has successfully fulfilled all curriculum requirements for</p>
                  <p className="text-white font-display font-700 text-lg mb-1">{c.course?.title || 'Academic Course'}</p>
                  <div className="mt-4 pt-4 border-t border-blue-800/80 flex items-center justify-between text-xs text-blue-300 font-mono">
                    <span>Issued: {new Date(c.issued_at).toLocaleDateString()}</span>
                    <span>ID: {c.certificate_code}</span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <p className="text-slate-500 font-medium">Instructor</p>
                    <p className="font-semibold text-slate-900">{c.course?.instructor?.name || 'Lead Faculty'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Issue Date</p>
                    <p className="font-semibold text-slate-900">{new Date(c.issued_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Credential Code</p>
                    <p className="font-mono text-slate-700 font-semibold">{c.certificate_code}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Verification Status</p>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Blockchain Verified
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Download className="w-3.5 h-3.5" />}
                    className="flex-1"
                    onClick={() => window.print()}
                  >
                    Print Certificate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<ExternalLink className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setVerifyCode(c.certificate_code)
                      setVerifyResult({
                        valid: true,
                        recipient_name: user?.name || 'Student',
                        course_title: c.course?.title || 'Course',
                        issue_date: new Date(c.issued_at).toLocaleDateString(),
                      })
                    }}
                  >
                    Verify Credential
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 mb-1">No Certificates Yet</h3>
          <p className="text-xs text-slate-500 mb-4">
            Complete 100% of all lessons, quizzes, and assignments in any enrolled course to earn an official verified certificate.
          </p>
        </div>
      )}
    </div>
  )
}
