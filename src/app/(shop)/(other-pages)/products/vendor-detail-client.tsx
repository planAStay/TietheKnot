'use client'

import QuotationFormModal from '@/components/quotation-form-modal'
import BookingModal from '@/components/booking-modal'
import AvailabilityCalendar from '@/components/availability-calendar'
import { Heading } from '@/components/heading'
import { useWedding } from '@/lib/wedding-context'
import { TVendor } from '@/type'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { getConfirmedBookingsForCalendar, initializeBookingsForVendor } from '@/lib/booking-manager'

export default function VendorDetailClient({ vendor }: { vendor: TVendor }) {
  const [quotationOpen, setQuotationOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [confirmedBookings, setConfirmedBookings] = useState(() => getConfirmedBookingsForCalendar(vendor.id))
  const { toggleFavorite, favorites } = useWedding()
  const isFav = favorites.some((f) => f.vendorHandle === vendor.handle)

  // Initialize mock bookings for this vendor on first load
  useEffect(() => {
    initializeBookingsForVendor(vendor.id)
    setConfirmedBookings(getConfirmedBookingsForCalendar(vendor.id))
  }, [vendor.id])

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
    setBookingOpen(true)
  }

  const handleBookingSuccess = () => {
    // Refresh bookings after successful booking
    setConfirmedBookings(getConfirmedBookingsForCalendar(vendor.id))
  }

  return (
    <>
      {/* Left column - Vendor details */}
      <div className="space-y-4 sm:space-y-5 lg:space-y-4 xl:space-y-5">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm uppercase text-zinc-500">{vendor.subcategory}</p>
            <Heading level={1} className="mt-0.5 sm:mt-1 text-xl sm:text-2xl lg:text-3xl font-semibold">
              {vendor.name}
            </Heading>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">{vendor.location}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleFavorite(vendor.handle)}
            className={clsx(
              'rounded-full px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-semibold shadow-sm transition flex-shrink-0 touch-manipulation',
              isFav ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 active:bg-zinc-300'
            )}
          >
            {isFav ? 'Saved' : 'Save'}
          </button>
        </div>

        <div className="rounded-lg bg-rose-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-rose-800">
          {vendor.description}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-2.5 sm:p-3 shadow-sm">
            <p className="text-[10px] sm:text-xs uppercase text-zinc-400">Category</p>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold capitalize text-zinc-900">{vendor.subcategory}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-2.5 sm:p-3 shadow-sm">
            <p className="text-[10px] sm:text-xs uppercase text-zinc-400">Price range</p>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold text-zinc-900">{vendor.priceRange}</p>
          </div>
        </div>

        {vendor.tags && vendor.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {vendor.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs text-zinc-600 transition hover:bg-zinc-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setQuotationOpen(true)}
            className="flex-1 sm:flex-none rounded-md bg-rose-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 active:bg-rose-800 touch-manipulation"
          >
            Request quote
          </button>
          <button
            onClick={() => toggleFavorite(vendor.handle)}
            className={clsx(
              'flex-1 sm:flex-none rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm transition touch-manipulation',
              isFav
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 active:bg-rose-300'
                : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 active:bg-zinc-300'
            )}
          >
            {isFav ? 'Remove favorite' : 'Add to favorites'}
          </button>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm text-xs sm:text-sm text-zinc-600">
          <p className="text-[10px] sm:text-xs uppercase text-zinc-400 font-semibold">Contact</p>
          <div className="mt-1.5 sm:mt-2 space-y-1">
            {vendor.contact?.email ? (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-zinc-500">Email:</span>
                <a
                  href={`mailto:${vendor.contact.email}`}
                  className="text-rose-600 hover:underline break-all"
                >
                  {vendor.contact.email}
                </a>
              </div>
            ) : null}
            {vendor.contact?.phone ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-zinc-500">Phone:</span>
                <a href={`tel:${vendor.contact.phone}`} className="text-rose-600 hover:underline">
                  {vendor.contact.phone}
                </a>
              </div>
            ) : null}
            {vendor.contact?.website ? (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-zinc-500">Website:</span>
                <a
                  href={vendor.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:underline break-all"
                >
                  {vendor.contact.website}
                </a>
              </div>
            ) : null}
            {vendor.contact?.instagram ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-zinc-500">Instagram:</span>
                <a
                  href={`https://instagram.com/${vendor.contact.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:underline"
                >
                  @{vendor.contact.instagram}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Right column - Availability Calendar */}
      <div className="space-y-2.5 sm:space-y-3 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
        <div>
          <h3 className="text-sm sm:text-base lg:text-sm xl:text-base font-semibold text-zinc-900 mb-1 sm:mb-1.5 lg:mb-1 xl:mb-1.5">Check Availability</h3>
          <p className="text-xs sm:text-sm lg:text-xs xl:text-sm text-zinc-600 mb-2.5 sm:mb-3 lg:mb-2.5 xl:mb-3 leading-relaxed">
            Select a date to book your special day. Green dates are fully available, while colored triangles indicate
            partially booked slots.
          </p>
        </div>
        <div className="lg:pr-1">
          <AvailabilityCalendar
            vendorId={vendor.id}
            confirmedBookings={confirmedBookings}
            onDateClick={handleDateClick}
          />
        </div>
      </div>

      <QuotationFormModal vendor={vendor} open={quotationOpen} onClose={() => setQuotationOpen(false)} />
      <BookingModal
        vendor={vendor}
        selectedDate={selectedDate}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onSuccess={handleBookingSuccess}
      />
    </>
  )
}

