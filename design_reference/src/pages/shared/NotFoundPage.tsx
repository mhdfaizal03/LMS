import { useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-6">
        <GraduationCap className="w-6 h-6 text-white" />
      </div>
      <h1 className="text-6xl font-display font-700 text-slate-900 mb-2">404</h1>
      <p className="text-xl font-semibold text-slate-700 mb-2">Page not found</p>
      <p className="text-slate-500 text-sm mb-8 max-w-sm">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
        <Button onClick={() => navigate('/login')}>Go to Login</Button>
      </div>
    </div>
  )
}
