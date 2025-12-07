'use client'

import { useWedding } from '@/lib/wedding-context'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { differenceInDays, format } from 'date-fns'

export default function WeddingDatePill({ compact = true }: { compact?: boolean }) {
  const { weddingInfo } = useWedding()
  const dateStr = weddingInfo.weddingDate
  const baseClasses = compact
    ? 'text-[11px] px-3 py-1.5'
    : 'text-sm px-3.5 py-2'
  if (!dateStr) {
    return (
      <div
        className={`flex items-center gap-2 rounded-full bg-rose-50 font-semibold text-rose-700 shadow-sm ${baseClasses}`}
      >
        <CalendarDaysIcon className="h-4 w-4" />
        Add your date
      </div>
    )
  }
  const target = new Date(dateStr)
  const days = differenceInDays(target, new Date())
  return (
    <div
      className={`flex items-center gap-2 rounded-full bg-rose-600/10 font-semibold text-rose-700 shadow-sm ${baseClasses}`}
    >
      <CalendarDaysIcon className="h-4 w-4" />
      <span className="whitespace-nowrap">
        {format(target, 'MMM d, yyyy')} • {days >= 0 ? `${days} days left` : 'Happened'}
      </span>
    </div>
  )
}

