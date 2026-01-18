import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import VendorHeroCarousel from '@/components/vendor-hero-carousel'
import { notFound } from 'next/navigation'
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  CurrencyDollarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { 
  BuildingStorefrontIcon 
} from '@heroicons/react/24/solid'
import Image from 'next/image'

// Server-side function to fetch vendor profile by handle from backend
async function fetchVendorProfileByHandle(handle: string) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
  
  try {
    const idMatch = handle.match(/-(\d+)$/)
    if (!idMatch) return undefined
    
    const id = parseInt(idMatch[1], 10)
    
    const response = await fetch(`${API_BASE_URL}/vendor-profiles/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    })
    
    if (!response.ok) return undefined
    
    const profile = await response.json()
    
    const imageUrls = Array.isArray(profile.imageUrls) ? profile.imageUrls : []
    const allImages = imageUrls.map((url: string) => ({
      src: url.trim(),
      alt: `${profile.businessName} - ${profile.category}`,
    }))
    
    const heroImage = allImages.length > 0 
      ? allImages[0]
      : { src: '/placeholder-vendor.jpg', alt: profile.businessName }
    
    return {
      id: profile.id.toString(),
      name: profile.businessName,
      handle,
      category: profile.category,
      location: profile.baseLocation || '',
      priceRange: profile.priceRange || '',
      heroImage,
      images: allImages,
      description: profile.description || '',
      contact: {
        phone: profile.phone,
        email: profile.userEmail,
      },
      baseLocation: profile.baseLocation,
      instagramUrl: profile.instagramUrl,
      facebookUrl: profile.facebookUrl,
      serviceAreas: profile.serviceAreas || [],
      packages: profile.packages || [],
      pricingPdfUrl: profile.pricingPdfUrl,
    }
  } catch (error) {
    console.error('Error fetching vendor profile:', error)
    return undefined
  }
}

export default async function VendorDetailPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const vendor = await fetchVendorProfileByHandle(handle)
  
  if (!vendor) {
    notFound()
  }

  const InstagramIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
    </svg>
  )

  const FacebookIcon = () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image Gallery */}
      <div className="w-full bg-zinc-100">
        <div className="mx-auto max-w-7xl">
          <VendorHeroCarousel images={vendor.images} />
        </div>
      </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Vendor Header */}
              <div>
                <div className="flex items-center gap-2 text-sm text-secondary mb-3">
                  <BuildingStorefrontIcon className="h-4 w-4" />
                  <span className="font-medium">{vendor.category}</span>
                  {vendor.baseLocation && (
                    <>
                      <span className="text-zinc-400">•</span>
                      <MapPinIcon className="h-4 w-4" />
                      <span>{vendor.baseLocation}</span>
                    </>
                  )}
                </div>
                
                <Heading level={1} className="text-4xl font-bold text-text mb-4">
                  {vendor.name}
                </Heading>
                
                {vendor.priceRange && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full">
                    <CurrencyDollarIcon className="h-5 w-5" />
                    <span className="font-semibold">{vendor.priceRange}</span>
                  </div>
                )}
              </div>

              {/* About Section */}
              {vendor.description && (
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <Heading level={2} className="text-2xl font-semibold text-text mb-4">
                    About {vendor.name}
                  </Heading>
                  <Text className="text-text/80 leading-relaxed whitespace-pre-wrap">
                    {vendor.description}
                  </Text>
                </div>
              )}

              {/* Pricing Packages */}
              {vendor.packages && vendor.packages.length > 0 && (
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <Heading level={2} className="text-2xl font-semibold text-text mb-4">
                    Pricing Packages
                  </Heading>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vendor.packages.map((pkg: any) => (
                      <div key={pkg.id} className="border border-zinc-200 rounded-lg p-5 hover:border-primary transition-colors">
                        <h3 className="font-semibold text-lg text-text mb-2">{pkg.name}</h3>
                        <p className="text-2xl font-bold text-accent mb-3">
                          ${pkg.priceFrom} - ${pkg.priceTo}
                        </p>
                        {pkg.description && (
                          <p className="text-sm text-text/70 mb-4">{pkg.description}</p>
                        )}
                        {pkg.features && pkg.features.length > 0 && (
                          <ul className="space-y-2">
                            {pkg.features.map((feature: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-text/80">
                                <CheckCircleIcon className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                  {vendor.pricingPdfUrl && (
                    <div className="mt-6 text-center">
                      <a
                        href={vendor.pricingPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Full Pricing PDF
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Service Areas */}
              {vendor.serviceAreas && vendor.serviceAreas.length > 0 && (
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <Heading level={2} className="text-2xl font-semibold text-text mb-4">
                    Service Areas
                  </Heading>
                  <div className="flex flex-wrap gap-2">
                    {vendor.serviceAreas.map((area: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Gallery */}
              {vendor.images && vendor.images.length > 1 && (
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <Heading level={2} className="text-2xl font-semibold text-text mb-4">
                    Gallery
                  </Heading>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {vendor.images.slice(1, 7).map((image: any, index: number) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover transition duration-300 hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Card */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg">
                  <Heading level={2} className="text-xl font-semibold text-text mb-5">
                    Contact Information
                  </Heading>
                  
                  <div className="space-y-3">
                    {vendor.contact?.phone && (
                      <a
                        href={`tel:${vendor.contact.phone}`}
                        className="flex items-center gap-3 p-4 rounded-lg border border-zinc-200 hover:border-primary hover:bg-primary/5 transition-all group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <PhoneIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-text/60 font-medium uppercase">Call Us</div>
                          <div className="text-sm font-medium text-text truncate">{vendor.contact.phone}</div>
                        </div>
                      </a>
                    )}

                    {vendor.contact?.email && (
                      <a
                        href={`mailto:${vendor.contact.email}`}
                        className="flex items-center gap-3 p-4 rounded-lg border border-zinc-200 hover:border-primary hover:bg-primary/5 transition-all group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <EnvelopeIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-text/60 font-medium uppercase">Email Us</div>
                          <div className="text-sm font-medium text-text truncate">{vendor.contact.email}</div>
                        </div>
                      </a>
                    )}

                    {/* Social Media */}
                    {(vendor.instagramUrl || vendor.facebookUrl) && (
                      <div className="pt-4 border-t border-zinc-200">
                        <div className="text-xs text-text/60 font-medium uppercase mb-3">Follow Us</div>
                        <div className="flex gap-3">
                          {vendor.instagramUrl && (
                            <a
                              href={vendor.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-[#2C2C2C] dark:bg-[#FEFCF7] text-[#FEFCF7] dark:text-[#2C2C2C] hover:opacity-80 transition-all"
                            >
                              <InstagramIcon />
                              <span className="text-sm font-medium">Instagram</span>
                            </a>
                          )}
                          {vendor.facebookUrl && (
                            <a
                              href={vendor.facebookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-[#2C2C2C] dark:bg-[#FEFCF7] text-[#FEFCF7] dark:text-[#2C2C2C] hover:opacity-80 transition-all"
                            >
                              <FacebookIcon />
                              <span className="text-sm font-medium">Facebook</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-xs text-text/80 text-center">
                      💡 <span className="font-medium">Tip:</span> Mention you found them on TieTheKnot!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
