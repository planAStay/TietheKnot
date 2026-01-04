import { TBooking, TBookingStatus, TDayAvailability } from './type'

// Helper function to get dates relative to today
const getDateString = (daysFromToday: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split('T')[0]
}

// Generate mock bookings for a specific vendor ID
// This ensures bookings work for any vendor
// Using specific dates so they're always visible
export const generateBookingsForVendor = (vendorId: string): TBooking[] => {
  const bookings: TBooking[] = []

  // January 8, 2026 - Morning only booked (yellow triangle) - PARTIAL DAYTIME BOOKING
  bookings.push({
    id: `booking-${vendorId}-001`,
    vendorId,
    date: '2026-01-08',
    slot: 'morning',
    status: 'confirmed',
    createdAt: '2025-12-15T10:00:00Z',
    confirmedAt: '2025-12-16T14:00:00Z',
    userDetails: {
      name: 'Sarah & John',
      email: 'sarah.john@email.com',
      phone: '+94 77 123 4567',
    },
    message: 'Daytime wedding ceremony',
  })

  // January 12, 2026 - Evening only booked (purple triangle)
  bookings.push({
    id: `booking-${vendorId}-002`,
    vendorId,
    date: '2026-01-12',
    slot: 'evening',
    status: 'confirmed',
    createdAt: '2025-12-18T09:00:00Z',
    confirmedAt: '2025-12-19T11:00:00Z',
    userDetails: {
      name: 'Priya & Amal',
      email: 'priya.amal@email.com',
      phone: '+94 77 234 5678',
    },
  })

  // January 15, 2026 - Fully booked (both slots) - strikethrough
  bookings.push(
    {
      id: `booking-${vendorId}-003`,
      vendorId,
      date: '2026-01-15',
      slot: 'morning',
      status: 'confirmed',
      createdAt: '2025-12-20T10:00:00Z',
      confirmedAt: '2025-12-21T16:00:00Z',
      userDetails: {
        name: 'Nisha & Kumar',
        email: 'nisha.kumar@email.com',
        phone: '+94 77 456 7890',
      },
    },
    {
      id: `booking-${vendorId}-004`,
      vendorId,
      date: '2026-01-15',
      slot: 'evening',
      status: 'confirmed',
      createdAt: '2025-12-22T11:00:00Z',
      confirmedAt: '2025-12-23T09:00:00Z',
      userDetails: {
        name: 'Tara & Dev',
        email: 'tara.dev@email.com',
        phone: '+94 77 567 8901',
      },
    }
  )

  // January 18, 2026 - Morning only booked (yellow triangle)
  bookings.push({
    id: `booking-${vendorId}-005`,
    vendorId,
    date: '2026-01-18',
    slot: 'morning',
    status: 'confirmed',
    createdAt: '2025-12-25T10:00:00Z',
    confirmedAt: '2025-12-26T14:00:00Z',
    userDetails: {
      name: 'Maya & Rohan',
      email: 'maya.rohan@email.com',
      phone: '+94 77 345 6789',
    },
  })

  // January 22, 2026 - Evening only booked (purple triangle)
  bookings.push({
    id: `booking-${vendorId}-006`,
    vendorId,
    date: '2026-01-22',
    slot: 'evening',
    status: 'confirmed',
    createdAt: '2025-12-28T09:00:00Z',
    confirmedAt: '2025-12-29T11:00:00Z',
    userDetails: {
      name: 'Ananya & Ravi',
      email: 'ananya.ravi@email.com',
      phone: '+94 77 678 9012',
    },
  })

  // January 25, 2026 - Fully booked (both slots) - strikethrough
  bookings.push(
    {
      id: `booking-${vendorId}-007`,
      vendorId,
      date: '2026-01-25',
      slot: 'morning',
      status: 'confirmed',
      createdAt: '2026-01-01T10:00:00Z',
      confirmedAt: '2026-01-02T16:00:00Z',
      userDetails: {
        name: 'Kavya & Arjun',
        email: 'kavya.arjun@email.com',
        phone: '+94 77 789 0123',
      },
    },
    {
      id: `booking-${vendorId}-008`,
      vendorId,
      date: '2026-01-25',
      slot: 'evening',
      status: 'confirmed',
      createdAt: '2026-01-01T11:00:00Z',
      confirmedAt: '2026-01-02T17:00:00Z',
      userDetails: {
        name: 'Riya & Sam',
        email: 'riya.sam@email.com',
        phone: '+94 77 890 1234',
      },
    }
  )

  // January 28, 2026 - Evening only booked (purple triangle)
  bookings.push({
    id: `booking-${vendorId}-009`,
    vendorId,
    date: '2026-01-28',
    slot: 'evening',
    status: 'confirmed',
    createdAt: '2026-01-05T09:00:00Z',
    confirmedAt: '2026-01-06T11:00:00Z',
    userDetails: {
      name: 'Lina & Alex',
      email: 'lina.alex@email.com',
      phone: '+94 77 901 2345',
    },
  })

  // February 2, 2026 - Morning only booked (yellow triangle)
  bookings.push({
    id: `booking-${vendorId}-010`,
    vendorId,
    date: '2026-02-02',
    slot: 'morning',
    status: 'confirmed',
    createdAt: '2026-01-10T10:00:00Z',
    confirmedAt: '2026-01-11T14:00:00Z',
    userDetails: {
      name: 'Emma & James',
      email: 'emma.james@email.com',
      phone: '+94 77 012 3456',
    },
  })

  // February 5, 2026 - Fully booked (both slots) - strikethrough
  bookings.push(
    {
      id: `booking-${vendorId}-011`,
      vendorId,
      date: '2026-02-05',
      slot: 'morning',
      status: 'confirmed',
      createdAt: '2026-01-15T10:00:00Z',
      confirmedAt: '2026-01-16T16:00:00Z',
      userDetails: {
        name: 'Sophia & Michael',
        email: 'sophia.michael@email.com',
        phone: '+94 77 123 7890',
      },
    },
    {
      id: `booking-${vendorId}-012`,
      vendorId,
      date: '2026-02-05',
      slot: 'evening',
      status: 'confirmed',
      createdAt: '2026-01-15T11:00:00Z',
      confirmedAt: '2026-01-16T17:00:00Z',
      userDetails: {
        name: 'Olivia & David',
        email: 'olivia.david@email.com',
        phone: '+94 77 234 8901',
      },
    }
  )

  return bookings
}

// Mock bookings data - will be populated dynamically for each vendor
// Using a function to generate bookings ensures they work for any vendor ID
export const mockBookings: TBooking[] = [
  // This will be populated when initializeMockBookings is called
]

/**
 * Get all bookings for a specific vendor
 */
export function getVendorBookings(vendorId: string): TBooking[] {
  return mockBookings.filter((booking) => booking.vendorId === vendorId)
}

/**
 * Get only confirmed bookings for a vendor (for calendar display)
 */
export function getConfirmedBookingsForCalendar(vendorId: string): TBooking[] {
  return mockBookings.filter((booking) => booking.vendorId === vendorId && booking.status === 'confirmed')
}

/**
 * Check availability for a specific date
 */
export function getDateAvailability(vendorId: string, date: string): TDayAvailability {
  const bookings = mockBookings.filter((booking) => booking.vendorId === vendorId && booking.date === date)

  const morningBooking = bookings.find((b) => b.slot === 'morning')
  const eveningBooking = bookings.find((b) => b.slot === 'evening')

  return {
    date,
    morningBooked: !!morningBooking && morningBooking.status === 'confirmed',
    eveningBooked: !!eveningBooking && eveningBooking.status === 'confirmed',
    morningStatus: morningBooking?.status,
    eveningStatus: eveningBooking?.status,
  }
}

/**
 * Get all bookings for a specific date (including pending)
 */
export function getDateBookings(vendorId: string, date: string): TBooking[] {
  return mockBookings.filter((booking) => booking.vendorId === vendorId && booking.date === date)
}

/**
 * Check if a specific slot is available (not confirmed)
 */
export function isSlotAvailable(vendorId: string, date: string, slot: 'morning' | 'evening'): boolean {
  const bookings = mockBookings.filter(
    (booking) => booking.vendorId === vendorId && booking.date === date && booking.slot === slot
  )

  // Slot is available if there's no confirmed booking
  return !bookings.some((b) => b.status === 'confirmed')
}

/**
 * Add a new booking to mock data (for demonstration)
 * In a real app, this would call an API
 */
export function createBooking(
  vendorId: string,
  date: string,
  slot: 'morning' | 'evening',
  userDetails: { name: string; email: string; phone: string },
  message?: string
): TBooking {
  const newBooking: TBooking = {
    id: `booking-${Date.now()}`,
    vendorId,
    date,
    slot,
    status: 'pending',
    createdAt: new Date().toISOString(),
    userDetails,
    message,
  }

  mockBookings.push(newBooking)
  return newBooking
}

/**
 * Initialize bookings for a vendor (generates mock data if not exists)
 * This ensures every vendor has sample bookings
 */
export function initializeBookingsForVendor(vendorId: string): void {
  // Check if bookings already exist for this vendor
  const existingBookings = mockBookings.filter((b) => b.vendorId === vendorId)
  if (existingBookings.length === 0) {
    // Generate bookings for this vendor
    const newBookings = generateBookingsForVendor(vendorId)
    mockBookings.push(...newBookings)
  }
}

