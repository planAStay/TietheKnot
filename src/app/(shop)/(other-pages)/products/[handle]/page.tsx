import { Divider } from '@/components/divider'
import { Heading } from '@/components/heading'
import VendorCard from '@/components/vendor-card'
import VendorDetailClient from '../vendor-detail-client'
import { getVendorByHandle, getVendorsByCategory } from '@/data-wedding'
import clsx from 'clsx'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'

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
    <div className={clsx('relative space-y-12 sm:space-y-16')}>
      <div className="absolute inset-x-0 -top-px z-10 h-px bg-white"></div>

      <main className="container">
        <div className="lg:grid lg:grid-cols-2 lg:gap-10">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
            <Image
              src={vendor.heroImage.src}
              alt={vendor.heroImage.alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <VendorDetailClient vendor={vendor} />
        </div>

        <Divider className="my-12 lg:my-16" />

        <section className="space-y-6">
          <Heading level={2} className="text-2xl font-semibold">
            Packages
          </Heading>
          <div className="grid gap-4 md:grid-cols-2">
            {vendor.packages?.map((pkg) => (
              <div key={pkg.name} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-zinc-900">{pkg.name}</p>
                {pkg.priceFrom ? <p className="text-sm text-rose-700">From ${pkg.priceFrom}</p> : null}
                {pkg.description ? <p className="mt-1 text-sm text-zinc-600">{pkg.description}</p> : null}
                {pkg.features ? (
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-600">
                    {pkg.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <Divider className="my-12 lg:my-16" />

        {related.length ? (
          <section>
            <Heading level={2} className="text-2xl font-semibold">
              You might also like
            </Heading>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
