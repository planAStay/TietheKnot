import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import VendorCard from '@/components/vendor-card'
import VendorDetailClient from '../vendor-detail-client'
import VendorHeroCarousel from '@/components/vendor-hero-carousel'
import PricingSection from '@/components/pricing-section'
import { getVendorByHandle, getVendorsByCategory } from '@/data-wedding'
import { getVendorPackagesByProfile } from '@/lib/api/vendor-profile'
import clsx from 'clsx'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Server-side function to fetch vendor profile by handle from backend
async function fetchVendorProfileByHandle(handle: string): Promise<import('@/type').TVendor | undefined> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
  
  try {
    // Extract ID from handle (format: category-businessname-id)
    const idMatch = handle.match(/-(\d+)$/)
    if (!idMatch) {
      return undefined
    }
    
    const id = parseInt(idMatch[1], 10)
    
    // Helper function to process profile data
    const processProfile = async (profile: any) => {
      // imageUrls is now directly an array from the backend (using @ElementCollection)
      const imageUrls = Array.isArray(profile.imageUrls) 
        ? profile.imageUrls.filter((url: any) => url && typeof url === 'string' && url.trim().length > 0)
        : []
      
      // Convert all imageUrls to TImage format
      const allImages = imageUrls.map((url: string) => ({
        src: url.trim(),
        alt: `${profile.businessName} - ${profile.category}`,
      }))
      
      // Use first image as heroImage, or placeholder if no images
      const heroImage = allImages.length > 0 
        ? allImages[0]
        : {
            src: '/placeholder-vendor.jpg',
            alt: `${profile.businessName} - ${profile.category}`,
          }
      
      // Rest of images (excluding first one since it's heroImage)
      const additionalImages = allImages.slice(1)
      
      // Fetch packages for this profile
      let packages: import('@/type').TPackage[] | undefined = undefined
      try {
        const backendPackages = await getVendorPackagesByProfile(profile.id)
        packages = backendPackages.map((pkg: any) => ({
          name: pkg.name,
          priceFrom: pkg.priceFrom,
          priceTo: pkg.priceTo,
          description: pkg.description,
          features: pkg.features || [],
        }))
      } catch (err) {
        console.error('Error fetching packages:', err)
        // Continue without packages if fetch fails
      }
      
      // Convert to TVendor format
      return {
        id: String(profile.id),
        handle: handle,
        name: profile.businessName,
        description: profile.description || '',
        category: profile.category,
        subcategory: profile.category,
        location: profile.serviceArea || 'Not specified',
        priceRange: profile.priceRange || '$$',
        rating: undefined,
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
    }
    
    // Try fetching by ID first
    const response = await fetch(`${API_BASE_URL}/vendor-profiles/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })
    
    if (response.ok) {
      const profile = await response.json()
      if (profile && profile.isActive) {
        return await processProfile(profile)
      }
    }
    
    // Fallback: fetch all profiles and find by ID
    const allProfilesResponse = await fetch(`${API_BASE_URL}/vendor-profiles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })
    
    if (allProfilesResponse.ok) {
      const profiles = await allProfilesResponse.json()
      const profile = profiles.find((p: any) => p.id === id && p.isActive)
      if (profile) {
        return await processProfile(profile)
      }
    }
    
    return undefined
  } catch (error) {
    console.error('Error fetching vendor profile:', error)
    return undefined
  }
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  // Try mock data first, then backend
  let vendor = getVendorByHandle(handle)
  if (!vendor) {
    vendor = await fetchVendorProfileByHandle(handle)
  }
  if (!vendor) {
    return {
      title: 'Vendor not found',
      description: 'Vendor not found',
    }
  }

  const { name, description } = vendor
  return { title: name, description }
}

export default async function VendorPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  // Try mock data first, then backend
  let vendor = getVendorByHandle(handle)
  if (!vendor) {
    vendor = await fetchVendorProfileByHandle(handle)
  }
  if (!vendor) return notFound()
  
  // Get related vendors (from mock data for now, can be enhanced later)
  const related = getVendorsByCategory(vendor.category).filter((v) => v.handle !== vendor.handle).slice(0, 3)

  return (
    <div className={clsx('relative space-y-6 sm:space-y-8 lg:space-y-10')}>
      <div className="absolute inset-x-0 -top-px z-10 h-px bg-white"></div>

      <main className="container">
        {/* Hero Image Carousel */}
        <VendorHeroCarousel
          images={[vendor.heroImage, ...(vendor.images || [])]}
          className="max-w-6xl mx-auto"
        />

        <Divider className="my-5 sm:my-6 lg:my-7 xl:my-8" />

        {/* Main Content: Two Column Layout */}
        <div className="grid gap-6 sm:gap-7 md:gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-6 xl:gap-8">
          <VendorDetailClient vendor={vendor} />
        </div>

        <Divider className="my-7 sm:my-8 md:my-10 lg:my-11 xl:my-12" />

        {/* Packages & Pricing Section */}
        <PricingSection packages={vendor.packages} pricingPdf={vendor.pricingPdf} />

        {(vendor.packages && vendor.packages.length > 0) || vendor.pricingPdf ? (
          <Divider className="my-7 sm:my-8 md:my-10 lg:my-11 xl:my-12" />
        ) : null}

        {/* Related Vendors */}
        {related.length ? (
          <section>
            <Heading level={2} className="text-xl sm:text-2xl lg:text-xl xl:text-2xl font-semibold">
              You might also like
            </Heading>
            <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-5 xl:mt-6 grid grid-cols-1 gap-4 sm:gap-5 lg:gap-4 xl:gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <VendorCard key={item.id} vendor={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
