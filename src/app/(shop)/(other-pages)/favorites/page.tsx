'use client'

import VendorCard from '@/components/vendor-card'
import { Heading } from '@/components/heading'
import { Text, TextLink } from '@/components/text'
import { useWedding } from '@/lib/wedding-context'

export default function FavoritesPage() {
  const { favoriteVendors } = useWedding()

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <Heading level={1} className="text-3xl font-semibold text-text">
          Favorites
        </Heading>
        <TextLink href="/collections/all" className="text-sm font-semibold text-accent">
          Browse categories
        </TextLink>
      </div>
      <Text className="mt-1 text-sm text-zinc-600">
        Shortlist vendors you love. We keep them here for quick access.
      </Text>

      {favoriteVendors.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-primary/40 bg-white p-6 text-center">
          <Text className="text-sm text-zinc-600">No favorites yet. Add vendors to start your list.</Text>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  )
}

