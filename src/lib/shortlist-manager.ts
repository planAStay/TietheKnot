import { getVendorProfileById, getAllVendorProfiles } from '@/lib/api/vendor-profile'
import { TShortlist, TVendor } from '@/type'
import { getMyShortlist, addToShortlist, removeFromShortlist } from './api/shortlist'
import { readStorage, writeStorage } from './local-storage'
import { getAuthToken } from './api/config'

const OLD_KEY = 'ttk_favorites'
const KEY = 'ttk_shortlist'
const MIGRATION_FLAG = 'ttk_shortlist_migrated'

// Helper function to convert VendorProfileResponse to TVendor format
async function convertVendorProfileToTVendor(vendorProfileId: number): Promise<TVendor | null> {
  try {
    const profile = await getVendorProfileById(vendorProfileId)
    if (!profile || !profile.isActive) {
      return null
    }

    // Generate handle from profile (matching the format used in collections page)
    const handle = `${profile.category.toLowerCase().replace(/\s+/g, '-')}-${profile.businessName.toLowerCase().replace(/\s+/g, '-')}-${profile.id}`

    // Convert imageUrls to TImage format
    const imageUrls = Array.isArray(profile.imageUrls) 
      ? profile.imageUrls.filter((url: any) => url && typeof url === 'string' && url.trim().length > 0)
      : []
    
    const allImages: TVendor['heroImage'][] = imageUrls.map((url: string) => ({
      src: url.trim(),
      alt: `${profile.businessName} - ${profile.category}`,
    }))
    
    const heroImage = allImages.length > 0 
      ? allImages[0]
      : {
          src: '/placeholder-vendor.jpg',
          alt: `${profile.businessName} - ${profile.category}`,
        }
    
    const additionalImages = allImages.slice(1)

    // Convert packages
    const packages = profile.packages?.map(pkg => ({
      name: pkg.name,
      priceFrom: pkg.priceFrom,
      priceTo: pkg.priceTo,
      description: pkg.description,
      features: pkg.features,
    })) || []

    return {
      id: String(profile.id),
      handle: handle,
      name: profile.businessName,
      description: profile.description || '',
      category: profile.category,
      subcategory: profile.category,
      location: profile.serviceArea || 'Not specified',
      priceRange: profile.priceRange || '$$',
      heroImage: heroImage,
      images: additionalImages,
      packages: packages,
      pricingPdf: profile.pricingPdfUrl,
      contact: {
        phone: profile.phone,
        email: profile.userEmail,
        whatsapp: profile.whatsapp,
      },
    }
  } catch (error) {
    console.error('Error converting vendor profile to TVendor:', error)
    return null
  }
}

// Migration function to migrate localStorage data to backend
async function migrateLocalStorageToBackend(): Promise<void> {
  if (typeof window === 'undefined') return
  
  // Check if already migrated
  const migrated = localStorage.getItem(MIGRATION_FLAG)
  if (migrated === 'true') return

  // Check if old localStorage data exists
  const oldData = localStorage.getItem(KEY) || localStorage.getItem(OLD_KEY)
  if (!oldData) {
    localStorage.setItem(MIGRATION_FLAG, 'true')
    return
  }

  try {
    // Parse old data (format: { vendorHandle: string, addedAt: string }[])
    const oldShortlist: Array<{ vendorHandle: string; addedAt: string }> = JSON.parse(oldData)
    
    if (oldShortlist.length === 0) {
      localStorage.setItem(MIGRATION_FLAG, 'true')
      return
    }

    // Get all vendor profiles to match handles to IDs
    const allProfiles = await getAllVendorProfiles()
    
    // Try to migrate each item
    for (const item of oldShortlist) {
      try {
        // Extract ID from handle if it matches the format: category-businessname-id
        const idMatch = item.vendorHandle.match(/-(\d+)$/)
        if (idMatch) {
          const vendorProfileId = parseInt(idMatch[1], 10)
          // Try to add to backend shortlist
          await addToShortlist(vendorProfileId)
        } else {
          // Try to find by matching business name or handle
          const profile = allProfiles.find(p => {
            const expectedHandle = `${p.category.toLowerCase().replace(/\s+/g, '-')}-${p.businessName.toLowerCase().replace(/\s+/g, '-')}-${p.id}`
            return expectedHandle === item.vendorHandle || p.businessName.toLowerCase() === item.vendorHandle.toLowerCase()
          })
          if (profile) {
            await addToShortlist(profile.id)
          }
        }
      } catch (err) {
        // Continue with next item if one fails
        console.warn('Failed to migrate shortlist item:', item, err)
      }
    }

    // Mark as migrated
    localStorage.setItem(MIGRATION_FLAG, 'true')
    // Optionally remove old data after successful migration
    // localStorage.removeItem(KEY)
    // localStorage.removeItem(OLD_KEY)
  } catch (err) {
    console.error('Error migrating shortlist data to backend:', err)
    // Don't mark as migrated if there was an error, so we can retry
  }
}

// Defer migration to run during browser idle time to avoid blocking initial load
if (typeof window !== 'undefined') {
  // Use requestIdleCallback or setTimeout fallback
  const runMigration = () => {
    migrateLocalStorageToBackend()
  }
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(runMigration, { timeout: 2000 })
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(runMigration, 1000)
  }
}

export async function getShortlist(): Promise<TShortlist[]> {
  // Check if user is authenticated before making API call
  const token = getAuthToken()
  if (!token) {
    // User not authenticated, return empty array (no shortlist for non-logged-in users)
    return []
  }
  
  try {
    return await getMyShortlist()
  } catch (error) {
    // Silently handle 403 errors (user not authenticated)
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
      return []
    }
    console.error('Error fetching shortlist from backend:', error)
    // Fallback to localStorage if backend fails (for offline support)
    return readStorage<TShortlist[]>(KEY, [])
  }
}

export async function isShortlisted(vendorProfileId: number): Promise<boolean> {
  try {
    const shortlist = await getShortlist()
    return shortlist.some((item) => item.vendorProfileId === vendorProfileId)
  } catch (error) {
    console.error('Error checking shortlist status:', error)
    return false
  }
}

export async function toggleShortlist(vendorProfileId: number): Promise<TShortlist[]> {
  try {
    const isCurrentlyShortlisted = await isShortlisted(vendorProfileId)
    
    if (isCurrentlyShortlisted) {
      await removeFromShortlist(vendorProfileId)
    } else {
      await addToShortlist(vendorProfileId)
    }
    
    // Return updated shortlist
    return await getShortlist()
  } catch (error) {
    console.error('Error toggling shortlist:', error)
    throw error
  }
}

export async function getShortlistedVendors(): Promise<TVendor[]> {
  // Check if user is authenticated before making API call
  const token = getAuthToken()
  if (!token) {
    // User not authenticated, return empty array
    return []
  }
  
  try {
    const shortlist = await getShortlist()
    
    // Convert each shortlist item to TVendor
    const vendors = await Promise.all(
      shortlist.map(item => convertVendorProfileToTVendor(item.vendorProfileId))
    )
    
    return vendors.filter((v): v is TVendor => v !== null)
  } catch (error) {
    // Silently handle 403 errors (user not authenticated)
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
      return []
    }
    console.error('Error fetching shortlisted vendors:', error)
    return []
  }
}
