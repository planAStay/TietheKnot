import { TBooking, TBookingSlot, TBookingStatus } from '@/type'
import { readStorage, writeStorage } from './local-storage'
import { generateBookingsForVendor } from '@/data-bookings'

const BOOKINGS_KEY = 'ttk_bookings'

/**
 * Get all bookings from local storage
 */
export function getBookings(): TBooking[] {
  return readStorage<TBooking[]>(BOOKINGS_KEY, [])
}

/**
 * Get bookings for a specific vendor
 */
export function getVendorBookings(vendorId: string): TBooking[] {
  const bookings = getBookings()
  return bookings.filter((booking) => booking.vendorId === vendorId)
}

/**
 * Get confirmed bookings for a vendor (for calendar display)
 */
export function getConfirmedBookingsForCalendar(vendorId: string): TBooking[] {
  const bookings = getBookings()
  return bookings.filter((booking) => booking.vendorId === vendorId && booking.status === 'confirmed')
}

/**
 * Get bookings for a specific date
 */
export function getDateBookings(vendorId: string, date: string): TBooking[] {
  const bookings = getBookings()
  return bookings.filter((booking) => booking.vendorId === vendorId && booking.date === date)
}

/**
 * Check if a slot is available (not confirmed booked)
 */
export function isSlotAvailable(vendorId: string, date: string, slot: TBookingSlot): boolean {
  const bookings = getBookings()
  const slotBookings = bookings.filter(
    (booking) => booking.vendorId === vendorId && booking.date === date && booking.slot === slot
  )

  // Slot is available if there's no confirmed booking
  return !slotBookings.some((b) => b.status === 'confirmed')
}

/**
 * Create a new booking
 */
export function createBooking(
  vendorId: string,
  date: string,
  slot: TBookingSlot,
  userDetails: { name: string; email: string; phone: string },
  message?: string
): TBooking {
  const bookings = getBookings()

  const newBooking: TBooking = {
    id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    vendorId,
    date,
    slot,
    status: 'pending',
    createdAt: new Date().toISOString(),
    userDetails,
    message,
  }

  bookings.push(newBooking)
  writeStorage(BOOKINGS_KEY, bookings)

  return newBooking
}

/**
 * Update booking status
 */
export function updateBookingStatus(bookingId: string, status: TBookingStatus): TBooking[] {
  const bookings = getBookings()
  const booking = bookings.find((b) => b.id === bookingId)

  if (booking) {
    booking.status = status
    if (status === 'confirmed') {
      booking.confirmedAt = new Date().toISOString()
    }
  }

  writeStorage(BOOKINGS_KEY, bookings)
  return bookings
}

/**
 * Delete a booking
 */
export function deleteBooking(bookingId: string): TBooking[] {
  const bookings = getBookings()
  const filtered = bookings.filter((b) => b.id !== bookingId)
  writeStorage(BOOKINGS_KEY, filtered)
  return filtered
}

/**
 * Get bookings by status
 */
export function getBookingsByStatus(vendorId: string, status: TBookingStatus): TBooking[] {
  const bookings = getBookings()
  return bookings.filter((booking) => booking.vendorId === vendorId && booking.status === status)
}

/**
 * Get bookings in a date range
 */
export function getBookingsInRange(vendorId: string, startDate: string, endDate: string): TBooking[] {
  const bookings = getBookings()
  return bookings.filter((booking) => {
    if (booking.vendorId !== vendorId) return false
    return booking.date >= startDate && booking.date <= endDate
  })
}

/**
 * Initialize bookings with mock data (for demo purposes)
 * Only call this once on first load
 */
export function initializeMockBookings(mockData: TBooking[]): void {
  const existing = getBookings()
  if (existing.length === 0) {
    writeStorage(BOOKINGS_KEY, mockData)
  }
}

/**
 * Initialize bookings for a specific vendor
 * Generates mock bookings if they don't exist
 */
export function initializeBookingsForVendor(vendorId: string): void {
  const bookings = getBookings()
  const vendorBookings = bookings.filter((b) => b.vendorId === vendorId)
  
  if (vendorBookings.length === 0) {
    // Generate bookings for this vendor
    const newVendorBookings = generateBookingsForVendor(vendorId)
    if (newVendorBookings.length > 0) {
      bookings.push(...newVendorBookings)
      writeStorage(BOOKINGS_KEY, bookings)
    }
  }
}

