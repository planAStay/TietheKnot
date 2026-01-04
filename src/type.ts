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
