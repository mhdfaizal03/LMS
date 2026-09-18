import React from 'react'
import { GraduationCap } from 'lucide-react'

export const LoadingSpinner: React.FC<{ message?: string; size?: number; fullScreen?: boolean }> = ({
  message = 'Loading...',
  size = 36,
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div className="relative flex items-center justify-center">
        {/* Glowing pulse aura */}
        <div className="absolute w-12 h-12 rounded-full bg-indigo-500/20 dark:bg-indigo-500/30 animate-ping pointer-events-none" />
        {/* Outer spinning ring */}
        <div 
          className="rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-400 animate-spin"
          style={{ width: size, height: size }}
        />
        {/* Center icon */}
        <div className="absolute text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <GraduationCap className="w-4 h-4" />
        </div>
      </div>
      {message && (
        <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 animate-pulse tracking-wide font-display">
          {message}
        </span>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        {content}
      </div>
    )
  }

  return content
}

export default LoadingSpinner
