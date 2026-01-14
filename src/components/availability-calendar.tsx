'use client'

import { useState, useMemo, useEffect } from 'react'
import clsx from 'clsx'

interface AvailabilityCalendarProps {
  vendorId: string
  confirmedBookings: Array<{ date: string; slot: 'morning' | 'evening'; status?: string }>
  onDateClick: (date: string) => void
}

const DAYS_OF_WEEK = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default function AvailabilityCalendar({
  vendorId,
  confirmedBookings,
  onDateClick,
}: AvailabilityCalendarProps) {
  // Debug: Log bookings on mount/update
  useEffect(() => {
    console.log('AvailabilityCalendar - confirmedBookings:', confirmedBookings)
  }, [confirmedBookings])
  // Use useState with lazy initializer to avoid hydration mismatch
  const [today, setToday] = useState<Date | null>(null)
  const [currentDate, setCurrentDate] = useState<Date | null>(null)

  // Initialize dates on client side only
  useEffect(() => {
    const now = new Date()
    setToday(now)
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1))
  }, [])

  // Get year and month with fallbacks to prevent errors
  const year = currentDate?.getFullYear() ?? new Date().getFullYear()
  const month = currentDate?.getMonth() ?? new Date().getMonth()

  // Calculate calendar days - must be called before any conditional returns
  const calendarDays = useMemo(() => {
    if (!currentDate) return []
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty slots for days before the first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }, [year, month, currentDate])

  // Get booking status for a date
  const getDateStatus = (date: Date) => {
    // Format date as YYYY-MM-DD to match backend format
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    
    const dayBookings = confirmedBookings.filter((b) => {
      // Normalize both dates for comparison
      const bookingDate = String(b.date).trim()
      return bookingDate === dateString
    })

    const morningBooked = dayBookings.some((b) => b.slot === 'morning')
    const eveningBooked = dayBookings.some((b) => b.slot === 'evening')

    // Debug logging for specific date
    if (dateString === '2026-01-31') {
      console.log('Checking date 2026-01-31:', {
        dateString,
        confirmedBookings: confirmedBookings.length,
        dayBookings: dayBookings.length,
        dayBookingsData: dayBookings,
        morningBooked,
        eveningBooked,
      })
    }

    return { morningBooked, eveningBooked, fullyBooked: morningBooked && eveningBooked }
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDateClick = (date: Date) => {
    if (!today) return
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    if (isPast) return

    const { fullyBooked } = getDateStatus(date)
    if (fullyBooked) return

    // Format date as YYYY-MM-DD using local date components to avoid timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    onDateClick(dateString)
  }

  const isToday = (date: Date) => {
    if (!today) return false
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isPast = (date: Date) => {
    if (!today) return false
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return date < todayStart
  }

  // Show loading state if dates aren't initialized yet
  if (!today || !currentDate) {
    return (
      <div className="w-full max-w-md md:max-w-lg lg:max-w-sm xl:max-w-md mx-auto lg:mx-0 rounded-lg border border-zinc-200 bg-white p-3 sm:p-4 lg:p-3 xl:p-4 shadow-sm">
        <div className="h-64 flex items-center justify-center">
          <div className="text-sm text-zinc-500">Loading calendar...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md md:max-w-lg lg:max-w-sm xl:max-w-md mx-auto lg:mx-0 rounded-lg border border-zinc-200 bg-white p-3 sm:p-4 lg:p-3 xl:p-4 shadow-sm">
      {/* Header with month/year navigation */}
      <div className="mb-2.5 sm:mb-3 lg:mb-2.5 xl:mb-3 flex items-center justify-between">
        <button
          onClick={handlePreviousMonth}
          className="rounded-md p-1 sm:p-1.5 lg:p-1 xl:p-1.5 hover:bg-zinc-100 active:bg-zinc-200 transition-colors touch-manipulation"
          aria-label="Previous month"
        >
          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-1.5 xl:gap-2">
          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-semibold text-zinc-900">{MONTHS[month]}</span>
          <select
            value={year}
            onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1))}
            className="rounded-md border border-zinc-300 px-1.5 py-0.5 sm:px-2 sm:py-1 lg:px-1.5 lg:py-0.5 xl:px-2 xl:py-1 text-[10px] sm:text-xs lg:text-[10px] xl:text-xs font-medium text-zinc-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-200 transition-all"
          >
            {Array.from({ length: 5 }, (_, i) => (today?.getFullYear() ?? new Date().getFullYear()) + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNextMonth}
          className="rounded-md p-1 sm:p-1.5 lg:p-1 xl:p-1.5 hover:bg-zinc-100 active:bg-zinc-200 transition-colors touch-manipulation"
          aria-label="Next month"
        >
          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 lg:gap-0.5 xl:gap-1">
        {/* Day headers */}
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="py-0.5 sm:py-1 lg:py-0.5 xl:py-1 text-center text-[9px] sm:text-[10px] lg:text-[9px] xl:text-[10px] font-semibold text-zinc-600">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const { morningBooked, eveningBooked, fullyBooked } = getDateStatus(date)
          const isCurrentDay = isToday(date)
          const isPastDay = isPast(date)

          const isAvailable = !morningBooked && !eveningBooked
          const isPartialMorning = morningBooked && !eveningBooked
          const isPartialEvening = !morningBooked && eveningBooked

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={isPastDay || fullyBooked}
              className={clsx(
                'relative aspect-square rounded-md text-[10px] sm:text-xs lg:text-[10px] xl:text-xs font-medium transition-all duration-150 overflow-hidden touch-manipulation',
                {
                  // Past dates
                  'bg-white text-gray-300 cursor-not-allowed': isPastDay,
                  // Available (green)
                  'bg-green-50 text-green-900 hover:bg-green-100 active:bg-green-200 sm:hover:scale-105 sm:hover:shadow-sm cursor-pointer':
                    isAvailable && !isPastDay,
                  // Partial availability (white background)
                  'bg-white border border-zinc-200 text-gray-900 hover:bg-gray-50 active:bg-gray-100 hover:border-zinc-300 sm:hover:scale-105 sm:hover:shadow-sm cursor-pointer':
                    (isPartialMorning || isPartialEvening) && !isPastDay,
                  // Fully booked
                  'bg-gray-100 text-gray-400 line-through cursor-not-allowed': fullyBooked,
                  // Current date
                  'ring-1 sm:ring-1.5 lg:ring-1 xl:ring-1.5 ring-rose-500 ring-inset': isCurrentDay && !isPastDay,
                }
              )}
            >
              {/* Triangle overlays for partial bookings - exactly half the square diagonally */}
              {isPartialMorning && !isPastDay && (
                <span
                  className="absolute top-0 left-0 z-0 bg-amber-400"
                  style={{
                    width: '100%',
                    height: '100%',
                    clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                  }}
                />
              )}
              {isPartialEvening && !isPastDay && (
                <span
                  className="absolute bottom-0 right-0 z-0 bg-purple-500"
                  style={{
                    width: '100%',
                    height: '100%',
                    clipPath: 'polygon(100% 100%, 100% 0, 0 100%)',
                  }}
                />
              )}

              <span className="relative z-10 flex items-center justify-center h-full">{date.getDate()}</span>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-2.5 sm:mt-3 lg:mt-2.5 xl:mt-3 space-y-1.5 sm:space-y-2 lg:space-y-1.5 xl:space-y-2 border-t border-zinc-200 pt-2.5 sm:pt-3 lg:pt-2.5 xl:pt-3">
        <p className="text-[9px] sm:text-[10px] lg:text-[9px] xl:text-[10px] font-semibold uppercase text-zinc-600 tracking-wide">Legend</p>
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:gap-1.5 xl:gap-2 text-[9px] sm:text-[10px] lg:text-[9px] xl:text-[10px]">
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-1 xl:gap-1.5">
            <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-3 lg:w-3 xl:h-3.5 xl:w-3.5 rounded bg-green-50 border border-green-200 flex-shrink-0" />
            <span className="text-zinc-600">Available</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-1 xl:gap-1.5">
            <div className="relative h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-3 lg:w-3 xl:h-3.5 xl:w-3.5 rounded bg-white border border-zinc-200 flex-shrink-0 overflow-hidden">
              <span
                className="absolute top-0 left-0 bg-amber-400"
                style={{
                  width: '100%',
                  height: '100%',
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                }}
              />
            </div>
            <span className="text-zinc-600">Morning</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-1 xl:gap-1.5">
            <div className="relative h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-3 lg:w-3 xl:h-3.5 xl:w-3.5 rounded bg-white border border-zinc-200 flex-shrink-0 overflow-hidden">
              <span
                className="absolute bottom-0 right-0 bg-purple-500"
                style={{
                  width: '100%',
                  height: '100%',
                  clipPath: 'polygon(100% 100%, 100% 0, 0 100%)',
                }}
              />
            </div>
            <span className="text-zinc-600">Evening</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-1 xl:gap-1.5">
            <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-3 lg:w-3 xl:h-3.5 xl:w-3.5 rounded bg-gray-100 border border-gray-200 flex-shrink-0" />
            <span className="text-zinc-600">Booked</span>
          </div>
        </div>
      </div>
    </div>
  )
}

