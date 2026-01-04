'use client'

import { TVendor, TBooking, TBookingSlot } from '@/type'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { createBooking, getDateBookings } from '@/lib/booking-manager'

interface Props {
  vendor: TVendor
  selectedDate: string | null
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function BookingModal({ vendor, selectedDate, open, onClose, onSuccess }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [slot, setSlot] = useState<TBookingSlot>('morning')
  const [message, setMessage] = useState('')
  const [dateBookings, setDateBookings] = useState<TBooking[]>([])
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (selectedDate) {
      const bookings = getDateBookings(vendor.id, selectedDate)
      setDateBookings(bookings)

      // Auto-select available slot
      const morningConfirmed = bookings.some((b) => b.slot === 'morning' && b.status === 'confirmed')
      const eveningConfirmed = bookings.some((b) => b.slot === 'evening' && b.status === 'confirmed')

      if (morningConfirmed && !eveningConfirmed) {
        setSlot('evening')
      } else {
        setSlot('morning')
      }
    }
  }, [selectedDate, vendor.id])

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setTimeout(() => {
        setSuccess(false)
        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
      }, 300)
    }
  }, [open])

  const confirmedBookings = dateBookings.filter((b) => b.status === 'confirmed')
  const pendingBookings = dateBookings.filter((b) => b.status === 'pending')
  const morningConfirmed = confirmedBookings.some((b) => b.slot === 'morning')
  const eveningConfirmed = confirmedBookings.some((b) => b.slot === 'evening')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate) return

    createBooking(vendor.id, selectedDate, slot, { name, email, phone }, message)

    setSuccess(true)

    // Close modal after showing success message
    setTimeout(() => {
      onClose()
      onSuccess?.()
    }, 2000)
  }

  if (!selectedDate) return null

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
          {success ? (
            <div className="text-center py-6 sm:py-8">
              <div className="mx-auto mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                <svg className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <Dialog.Title className="text-lg sm:text-xl font-bold text-zinc-900">Booking request submitted!</Dialog.Title>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed px-2">
                Waiting for vendor confirmation. We&apos;ll notify you once {vendor.name} confirms your booking.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg sm:text-xl font-bold text-zinc-900">Book Your Date</Dialog.Title>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 sm:p-2 text-zinc-500 hover:bg-zinc-100 active:bg-zinc-200 transition-colors touch-manipulation"
                >
                  <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

              <div className="mt-3 sm:mt-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 px-3 sm:px-4 py-2.5 sm:py-3 border border-rose-100">
                <p className="text-sm sm:text-base font-bold text-rose-900">{formattedDate}</p>
                <p className="text-xs sm:text-sm text-rose-700 mt-0.5">{vendor.name}</p>
              </div>

              {/* Slot availability info */}
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-zinc-800">Slot Availability</p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div
                    className={`rounded-md sm:rounded-lg border-2 px-2.5 sm:px-3 py-2 sm:py-2.5 transition-all ${
                      morningConfirmed
                        ? 'border-red-300 bg-red-50 text-red-800'
                        : 'border-green-300 bg-green-50 text-green-800'
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-semibold mb-0.5">Morning</p>
                    <p className="text-[10px] sm:text-xs">{morningConfirmed ? '❌ Booked' : '✓ Available'}</p>
                  </div>
                  <div
                    className={`rounded-md sm:rounded-lg border-2 px-2.5 sm:px-3 py-2 sm:py-2.5 transition-all ${
                      eveningConfirmed
                        ? 'border-red-300 bg-red-50 text-red-800'
                        : 'border-green-300 bg-green-50 text-green-800'
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-semibold mb-0.5">Evening</p>
                    <p className="text-[10px] sm:text-xs">{eveningConfirmed ? '❌ Booked' : '✓ Available'}</p>
                  </div>
                </div>

                {pendingBookings.length > 0 && (
                  <div className="rounded-md sm:rounded-lg bg-amber-50 border border-amber-200 px-2.5 sm:px-3 py-1.5 sm:py-2">
                    <p className="text-[10px] sm:text-xs text-amber-700 font-medium">
                      ⓘ {pendingBookings.length} pending booking{pendingBookings.length > 1 ? 's' : ''} for this date
                    </p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="mt-1 w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="mt-1 w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    required
                    className="mt-1 w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">
                    Preferred Slot *
                  </label>
                  <div className="mt-1.5 sm:mt-2 space-y-2 sm:space-y-2.5">
                    <label
                      className={`flex items-center p-2.5 sm:p-3 rounded-md sm:rounded-lg border-2 transition-all cursor-pointer touch-manipulation ${
                        slot === 'morning' && !morningConfirmed
                          ? 'border-rose-500 bg-rose-50'
                          : morningConfirmed
                          ? 'border-zinc-200 bg-zinc-50 cursor-not-allowed'
                          : 'border-zinc-200 active:bg-zinc-50 sm:hover:border-zinc-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        value="morning"
                        checked={slot === 'morning'}
                        onChange={(e) => setSlot(e.target.value as TBookingSlot)}
                        disabled={morningConfirmed}
                        className="mr-2 sm:mr-3 h-4 w-4 text-rose-600 flex-shrink-0"
                      />
                      <span className={`text-xs sm:text-sm ${morningConfirmed ? 'text-zinc-400' : 'text-zinc-800 font-medium'}`}>
                        Morning Slot
                        <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs text-zinc-500">(8 AM - 2 PM)</span>
                      </span>
                    </label>
                    <label
                      className={`flex items-center p-2.5 sm:p-3 rounded-md sm:rounded-lg border-2 transition-all cursor-pointer touch-manipulation ${
                        slot === 'evening' && !eveningConfirmed
                          ? 'border-rose-500 bg-rose-50'
                          : eveningConfirmed
                          ? 'border-zinc-200 bg-zinc-50 cursor-not-allowed'
                          : 'border-zinc-200 active:bg-zinc-50 sm:hover:border-zinc-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="slot"
                        value="evening"
                        checked={slot === 'evening'}
                        onChange={(e) => setSlot(e.target.value as TBookingSlot)}
                        disabled={eveningConfirmed}
                        className="mr-2 sm:mr-3 h-4 w-4 text-rose-600 flex-shrink-0"
                      />
                      <span className={`text-xs sm:text-sm ${eveningConfirmed ? 'text-zinc-400' : 'text-zinc-800 font-medium'}`}>
                        Evening Slot
                        <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs text-zinc-500">(4 PM - 11 PM)</span>
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-xs font-semibold text-zinc-700 uppercase tracking-wide">
                    Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any special requirements or notes..."
                    className="mt-1 w-full rounded-md sm:rounded-lg border border-zinc-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-rose-500 focus:ring-1 sm:focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all resize-none"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 sm:mt-5 w-full rounded-md sm:rounded-lg bg-rose-600 px-4 py-2.5 sm:py-3 text-sm font-bold text-white hover:bg-rose-700 active:bg-rose-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-md touch-manipulation"
                  disabled={morningConfirmed && eveningConfirmed}
                >
                  Submit Booking Request
                </button>
              </form>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

