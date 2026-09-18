import React from 'react'
import { LucideIcon } from 'lucide-react'
import Button from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionIcon?: React.ReactNode
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center w-full h-full min-h-[300px]">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
        <div className="relative w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center premium-shadow">
          <Icon className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <h3 className="font-display font-bold text-slate-900 text-lg mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
