'use client'

import VendorCard from '@/components/vendor-card'
import { Heading } from '@/components/heading'
import { Text, TextLink } from '@/components/text'
import { useWedding } from '@/lib/wedding-context'
import clsx from 'clsx'

const getStatusBadge = (status: string) => {
  const statusConfig = {
    FAVOURITED: { label: 'Favourited', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    QUOTED: { label: 'Quote Sent', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    ACCEPTED: { label: 'Quote Accepted', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    BOOKED: { label: 'Booked', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.FAVOURITED
  return (
    <span className={clsx('rounded-full px-2 py-0.5 text-xs font-medium', config.className)}>
      {config.label}
    </span>
  )
}

export default function ShortlistPage() {
  const { shortlistedVendors, shortlist } = useWedding()

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <Heading level={1} className="text-3xl font-semibold text-text">
          Shortlist
        </Heading>
        <TextLink href="/collections/all" className="text-sm font-semibold text-accent">
          Browse categories
        </TextLink>
      </div>
      <Text className="mt-1 text-sm text-zinc-600">
        Shortlist vendors you love. We keep them here for quick access.
      </Text>

      {shortlistedVendors.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-primary/40 bg-white p-6 text-center">
          <Text className="text-sm text-zinc-600">No vendors in your shortlist yet. Add vendors to start your list.</Text>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shortlistedVendors.map((vendor) => {
            const shortlistItem = shortlist.find(item => item.vendorProfileId === Number(vendor.id))
            return (
              <div key={vendor.id} className="relative">
                <VendorCard vendor={vendor} />
                {shortlistItem && (
                  <div className="absolute top-2 right-2 z-10">
                    {getStatusBadge(shortlistItem.status)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

