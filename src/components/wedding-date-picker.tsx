'use client'

import { useWedding } from '@/lib/wedding-context'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

type CountdownState =
  | {
      days: number
      hours: number
      minutes: number
      seconds: number
      label: string
      isToday: boolean
      isPast: boolean
    }
  | null

const computeCountdown = (dateStr?: string | null): CountdownState => {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()
  if (diffMs < 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      label: 'Date passed',
      isToday: false,
      isPast: true,
    }
  }
  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const isToday = days === 0
  const label = isToday ? (hours === 0 && minutes === 0 && seconds === 0 ? 'Today' : 'Today') : 'Days to go'
  return { days, hours, minutes, seconds, label, isToday, isPast: false }
}

export default function WeddingDatePicker({ className = '' }: { className?: string }) {
  const { weddingInfo, setWeddingInfo } = useWedding()
  const dateStr = weddingInfo.weddingDate

  const [countdown, setCountdown] = useState<CountdownState>(() => computeCountdown(dateStr))

  useEffect(() => {
    setCountdown(computeCountdown(dateStr))
    if (!dateStr) return
    const id = setInterval(() => {
      setCountdown(computeCountdown(dateStr))
    }, 1000)
    return () => clearInterval(id)
  }, [dateStr])

  const coupleNames =
    [weddingInfo.partnerOne, weddingInfo.partnerTwo].filter(Boolean).join(' & ') || 'Add your names'

  return (
    <div className={`rounded-xl border border-primary/30 bg-white p-5 shadow-sm ${className}`}>
      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-primary">Your wedding</p>
          <div className="text-2xl font-semibold text-text">{coupleNames}</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-lg border border-primary/30 bg-white px-3 py-2">
            <label className="text-xs text-zinc-600">Partner one</label>
            <input
              type="text"
              value={weddingInfo.partnerOne || ''}
              onChange={(e) => setWeddingInfo({ ...weddingInfo, partnerOne: e.target.value })}
              placeholder="Name"
              className="mt-1 w-full rounded-md border border-primary/30 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="rounded-lg border border-primary/30 bg-white px-3 py-2">
            <label className="text-xs text-zinc-600">Partner two</label>
            <input
              type="text"
              value={weddingInfo.partnerTwo || ''}
              onChange={(e) => setWeddingInfo({ ...weddingInfo, partnerTwo: e.target.value })}
              placeholder="Name"
              className="mt-1 w-full rounded-md border border-primary/30 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-lg border border-primary/30 bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text">Wedding date</p>
            {dateStr ? <span className="text-xs text-zinc-500">{format(new Date(dateStr), 'PPP')}</span> : null}
          </div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <input
              type="date"
              value={dateStr || ''}
              onChange={(e) => setWeddingInfo({ ...weddingInfo, weddingDate: e.target.value })}
              className="w-full rounded-md border border-primary/30 px-3 py-2 text-sm focus:border-primary focus:outline-none sm:w-auto"
            />
            {countdown !== null ? (
              <div className="flex flex-wrap items-center gap-3 rounded-md bg-champagne/50 px-3 py-2 text-sm font-semibold text-text">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold leading-none tabular-nums text-accent">{countdown.days}</span>
                  <span className="text-[11px] uppercase tracking-wide text-text/70">days</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold leading-none tabular-nums text-accent">{countdown.hours}</span>
                  <span className="text-[11px] uppercase tracking-wide text-text/70">h</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold leading-none tabular-nums text-accent">{countdown.minutes}</span>
                  <span className="text-[11px] uppercase tracking-wide text-text/70">m</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold leading-none tabular-nums text-accent">{countdown.seconds}</span>
                  <span className="text-[11px] uppercase tracking-wide text-text/70">s</span>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-text/70">
                  {countdown.isPast ? 'Date passed' : countdown.isToday ? "Today's the day" : 'Countdown'}
                </span>
              </div>
            ) : (
              <p className="text-xs text-zinc-500">Pick a date to start your countdown.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

