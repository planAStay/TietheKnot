export interface TImage {
  src: string
  width?: number
  height?: number
  alt: string
  sizes?: string
}

// Wedding planner domain types
export type TQuotationStatus = 'requested' | 'pending' | 'responded' | 'booked' | 'declined'

export interface TSubcategory {
  id: string
  name: string
  slug: string
}

export interface TCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  subcategories: TSubcategory[]
}

export interface TPackage {
  name: string
  priceFrom?: number
  priceTo?: number
  description?: string
  features?: string[]
}

export interface TVendor {
  id: string
  name: string
  handle: string
  category: string
  subcategory: string
  location: string
  priceRange: string
  rating?: number
  tags?: string[]
  heroImage: TImage
  images?: TImage[]
  description: string
  packages?: TPackage[]
  pricingPdf?: string
  contact?: {
    phone?: string
    email?: string
    website?: string
    instagram?: string
  }
  availability?: string[]
  featured?: boolean
}

export interface TFavorite {
  vendorHandle: string
  addedAt: string
}

export interface TQuotation {
  id: string
  vendorHandle: string
  vendorName: string
  category: string
  subcategory: string
  budget?: string
  guestCount?: string
  notes?: string
  status: TQuotationStatus
  createdAt: string
  eventDate?: string
}

export interface TWeddingInfo {
  weddingDate?: string
  partnerOne?: string
  partnerTwo?: string
  location?: string
  totalBudget?: number
}

export interface TBudgetCategory {
  id: string
  name: string
  allocatedAmount: number
  spentAmount: number
  icon?: string
  notes?: string
}

export interface TBudgetExpense {
  id: string
  categoryId: string
  vendorHandle?: string
  vendorName?: string
  description: string
  amount: number
  date: string
  isPaid: boolean
}

// Booking system types
export type TBookingSlot = 'morning' | 'evening'
export type TBookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled'

export interface TBooking {
  id: string
  vendorId: string
  userId?: string
  date: string // ISO date string
  slot: TBookingSlot
  status: TBookingStatus
  createdAt: string
  confirmedAt?: string
  userDetails: {
    name: string
    email: string
    phone: string
  }
  message?: string
}

export interface TDayAvailability {
  date: string
  morningBooked: boolean
  eveningBooked: boolean
  morningStatus?: TBookingStatus
  eveningStatus?: TBookingStatus
}

// Timeline and Checklist types
export type TTaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TTimelineMilestone {
  id: string
  title: string
  description?: string
  monthsBefore: number // Default relative timing (e.g., 12 means 12 months before)
  customStartDate?: string // Optional override for start date
  customEndDate?: string // Optional override for end date
  startDate?: string // Calculated start date
  endDate?: string // Calculated end date
  color?: string // Optional color for visual distinction
}

export interface TChecklistItem {
  id: string
  title: string
  description?: string
  isCompleted: boolean
  dueDate?: string // ISO date string
  milestoneId: string // Parent milestone
  category?: string // Optional category (e.g., "Venue", "Photography")
  priority: TTaskPriority
  assignedTo?: string // Optional (e.g., "Partner 1", "Partner 2", "Both")
  notes?: string
  reminderDate?: string // Optional reminder date (ISO date string)
}

// Guest Management types
export type TGuestSide = 'bride' | 'groom' | 'mutual'
export type TRsvpStatus = 'draft' | 'invited' | 'attending' | 'declined' | 'no-response'
export type TPriorityTier = 'tier1' | 'tier2'

export type TRelationshipLabel =
  | 'Extended Family'
  | 'Immediate Family'
  | 'College Friends'
  | 'Work'
  | 'High School Friends'
  | 'Childhood Friends'
  | 'Out of Town'
  | 'Vendor'
  | 'Other'

export interface TGuest {
  id: string
  name: string
  email?: string
  phone?: string
  side: TGuestSide
  rsvpStatus: TRsvpStatus
  priorityTier: TPriorityTier
  relationshipLabels: TRelationshipLabel[]
  householdId?: string
  guestCount: number // Total number of people (1 for single guest, 2+ for families/groups)
  invitedAt?: string // ISO date string
  respondedAt?: string // ISO date string
  openedInviteAt?: string // ISO date string - when invite link was opened
  viewedRsvpAt?: string // ISO date string - when RSVP page was viewed
  thankYouSent: boolean
  thankYouSentAt?: string // ISO date string
  lastReminderSentAt?: string // ISO date string
  notes?: string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export interface TGuestHousehold {
  id: string
  name: string
  memberIds: string[] // Array of guest IDs
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}
