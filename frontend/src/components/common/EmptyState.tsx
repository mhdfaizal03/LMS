import React from 'react'
import { LucideIcon, Inbox } from 'lucide-react'
import Button from '../ui/Button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionText?: string
  onAction?: () => void
  secondaryActionText?: string
  onSecondaryAction?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xs transition-colors duration-300">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center ring-8 ring-indigo-500/5 dark:ring-indigo-500/10">
          <Icon className="w-8 h-8 stroke-[1.75]" />
        </div>
      </div>
      
      <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {secondaryActionText && onSecondaryAction && (
            <Button variant="secondary" size="sm" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}
          {actionText && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default EmptyState
