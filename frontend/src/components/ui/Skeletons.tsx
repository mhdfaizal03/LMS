import React from 'react'

export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow flex flex-col h-[320px] animate-pulse">
      <div className="h-[160px] bg-slate-200 w-full" />
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="h-5 w-16 bg-slate-200 rounded-lg" />
          <div className="h-4 w-12 bg-slate-200 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-slate-200 rounded mb-2" />
        <div className="h-4 w-1/2 bg-slate-200 rounded mb-4" />
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="h-4 w-10 bg-slate-200 rounded" />
          <div className="h-4 w-10 bg-slate-200 rounded" />
          <div className="h-4 w-10 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 overflow-hidden premium-shadow">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {[1, 2, 3, 4, 5].map(i => (
                <th key={i} className="px-6 py-4"><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {[1, 2, 3, 4, 5].map(j => (
                  <td key={j} className="px-6 py-4">
                    <div className={`h-4 bg-slate-100 rounded animate-pulse ${j === 1 ? 'w-32' : 'w-24'}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 premium-shadow animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-slate-200" />
        <div className="h-5 w-24 bg-slate-200 rounded" />
      </div>
      <div className="h-8 w-16 bg-slate-200 rounded mb-2" />
      <div className="h-4 w-32 bg-slate-200 rounded" />
    </div>
  )
}
