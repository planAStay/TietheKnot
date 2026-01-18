/**
 * Vendor Categories - Shared constants for frontend
 * These should match the categories defined in the backend VendorCategory enum
 */
export const VENDOR_CATEGORIES = [
  'Photography & Videography',
  'Venues',
  'Bridal & Groom Styling',
  'Fashion & Attire',
  'Décor & Flowers',
  'Entertainment',
  'Food & Beverages',
  'Wedding Planning & Coordination',
  'Transportation',
  'Stationery & Invitations',
  'Wedding Accessories & Extras',
  'Gifts & Souvenirs',
  'Technology Services',
  'Logistics & Support Services',
  'Religious / Cultural Services',
  'Post-Wedding Services',
] as const

export type VendorCategory = typeof VENDOR_CATEGORIES[number]

