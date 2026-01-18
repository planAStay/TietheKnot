import VendorGrid from '@/components/vendor-grid'
import { ApplicationLayout } from '@/app/(shop)/application-layout'

// Fetch approved vendor profiles from backend - always fetch fresh data
async function fetchApprovedVendors() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
  
  try {
    const response = await fetch(`${API_BASE_URL}/vendor-profiles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      cache: 'no-store', // Always fetch fresh data from backend
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })
    
    if (!response.ok) return []
    
    const profiles = await response.json()
    
    // Convert to vendor format
    return profiles.map((profile: any) => {
      const imageUrls = Array.isArray(profile.imageUrls) ? profile.imageUrls : []
      const heroImage = imageUrls.length > 0
        ? { src: imageUrls[0], alt: profile.businessName }
        : { src: '/placeholder-vendor.jpg', alt: profile.businessName }
      
      return {
        id: profile.id.toString(),
        name: profile.businessName,
        handle: `${profile.category.toLowerCase().replace(/\s+/g, '-')}-${profile.businessName.toLowerCase().replace(/\s+/g, '-')}-${profile.id}`,
        category: profile.category,
        location: profile.baseLocation || '',
        serviceAreas: profile.serviceAreas || [],
        priceRange: profile.priceRange || '',
        heroImage,
        featured: false,
      }
    })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return []
  }
}

// Add metadata for better SEO and loading
export const metadata = {
  title: 'TieTheKnot - Find Your Perfect Wedding Vendors',
  description: 'Discover and connect with the best wedding vendors in Sri Lanka',
}

export default async function HomePage() {
  const vendors = await fetchApprovedVendors()

  return (
    <ApplicationLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <VendorGrid vendors={vendors} />
        </div>
      </div>
    </ApplicationLayout>
  )
}
