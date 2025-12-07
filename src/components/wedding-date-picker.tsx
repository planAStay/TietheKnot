'use client'

import { useWedding } from '@/lib/wedding-context'
import { differenceInDays, format } from 'date-fns'
import { useMemo } from 'react'

export default function WeddingDatePicker({ className = '' }: { className?: string }) {
  const { weddingInfo, setWeddingInfo } = useWedding()
  const dateStr = weddingInfo.weddingDate

  const countdown = useMemo(() => {
    if (!dateStr) return null
    const now = new Date()
    const target = new Date(dateStr)
    const days = differenceInDays(target, now)
    return days >= 0 ? days : null
  }, [dateStr])

  return (
    <div className={`rounded-lg border border-zinc-200 bg-white p-4 shadow-sm ${className}`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-800">Wedding date</p>
          {dateStr ? <span className="text-xs text-zinc-500"> {format(new Date(dateStr), 'PPP')} </span> : null}
        </div>
        <input
          type="date"
          value={dateStr || ''}
          onChange={(e) => setWeddingInfo({ ...weddingInfo, weddingDate: e.target.value })}
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
        />
        {countdown !== null ? (
          <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {countdown === 0 ? 'Today is the day!' : `${countdown} days to go`}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">Pick a date to start your countdown.</p>
        )}
      </div>
    </div>
  )
}

