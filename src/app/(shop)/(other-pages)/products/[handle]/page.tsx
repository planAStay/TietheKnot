import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import VendorCard from '@/components/vendor-card'
import VendorDetailClient from '../vendor-detail-client'
import VendorHeroCarousel from '@/components/vendor-hero-carousel'
import PricingSection from '@/components/pricing-section'
import { getVendorByHandle, getVendorsByCategory } from '@/data-wedding'
import clsx from 'clsx'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  const vendor = getVendorByHandle(handle)
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
  const vendor = getVendorByHandle(handle)
  if (!vendor) return notFound()
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
