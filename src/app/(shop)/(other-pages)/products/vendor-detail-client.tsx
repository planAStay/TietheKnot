'use client'

import QuoteRequestModal from '@/components/quote-request-modal'
import AvailabilityCalendar from '@/components/availability-calendar'
import { Heading } from '@/components/heading'
import { useWedding } from '@/lib/wedding-context'
import { TVendor } from '@/type'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import { getVendorAvailability } from '@/lib/api/vendor-availability'

export default function VendorDetailClient({ vendor }: { vendor: TVendor }) {
  const [quoteRequestOpen, setQuoteRequestOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [confirmedBookings, setConfirmedBookings] = useState<Array<{ date: string; slot: 'morning' | 'evening'; status: string }>>([])
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true)
  const { toggleShortlist, shortlist } = useWedding()
  const vendorProfileId = Number(vendor.id)
  const shortlistItem = shortlist.find(item => item.vendorProfileId === vendorProfileId)
  const isShortlisted = !!shortlistItem

  // Fetch availability from backend
  useEffect(() => {
    const loadAvailability = async () => {
      setIsLoadingAvailability(true)
      try {
        const availability = await getVendorAvailability(vendorProfileId)
        console.log('Loaded availability:', availability)
        // Convert to the format expected by the calendar component
        const bookings = availability.map(item => ({
          date: item.date, // Should be in YYYY-MM-DD format
          slot: item.slot,
          status: item.status,
        }))
        console.log('Mapped bookings for calendar:', bookings)
        setConfirmedBookings(bookings)
      } catch (error) {
        console.error('Error loading vendor availability:', error)
        // On error, set empty array so calendar still renders
        setConfirmedBookings([])
      } finally {
        setIsLoadingAvailability(false)
      }
    }

    if (vendorProfileId) {
      loadAvailability()
    }
  }, [vendorProfileId])

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
    setQuoteRequestOpen(true)
  }

  const handleQuoteRequestSuccess = () => {
    // Refresh shortlist after successful quote request
    // The shortlist will be automatically updated by the backend
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
          <div className="flex items-center gap-2 flex-shrink-0">
            {shortlistItem && shortlistItem.status !== 'FAVOURITED' && (
              <span className={clsx(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                shortlistItem.status === 'QUOTED' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                shortlistItem.status === 'ACCEPTED' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                shortlistItem.status === 'BOOKED' && 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
              )}>
                {shortlistItem.status === 'QUOTED' && 'Quote Sent'}
                {shortlistItem.status === 'ACCEPTED' && 'Quote Accepted'}
                {shortlistItem.status === 'BOOKED' && 'Booked'}
              </span>
            )}
            <button
              type="button"
              onClick={async () => {
                try {
                  await toggleShortlist(vendorProfileId)
                } catch (error) {
                  console.error('Error toggling shortlist:', error)
                }
              }}
              className={clsx(
                'rounded-full px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-semibold shadow-sm transition flex-shrink-0 touch-manipulation',
                isShortlisted ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 active:bg-zinc-300'
              )}
            >
              {isShortlisted ? 'Saved' : 'Save'}
            </button>
          </div>
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
                  onClick={() => setQuoteRequestOpen(true)}
                  className="flex-1 sm:flex-none rounded-md bg-rose-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 active:bg-rose-800 touch-manipulation"
                >
                  Request quote
                </button>
          <button
            onClick={async () => {
              try {
                await toggleShortlist(vendorProfileId)
              } catch (error) {
                console.error('Error toggling shortlist:', error)
              }
            }}
            className={clsx(
              'flex-1 sm:flex-none rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm transition touch-manipulation',
              isShortlisted
                ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 active:bg-rose-300'
                : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 active:bg-zinc-300'
            )}
          >
            {isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
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
            {vendor.contact?.whatsapp ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-zinc-500">WhatsApp:</span>
                <a 
                  href={`https://wa.me/${vendor.contact.whatsapp.replace(/[^0-9]/g, '')}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:underline"
                >
                  {vendor.contact.whatsapp}
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

            <QuoteRequestModal
              vendor={vendor}
              selectedDate={selectedDate}
              open={quoteRequestOpen}
              onClose={() => setQuoteRequestOpen(false)}
              onSuccess={handleQuoteRequestSuccess}
            />
    </>
  )
}

