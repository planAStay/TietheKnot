'use client'

import { TVendor } from '@/type'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useWedding } from '@/lib/wedding-context'
import { HeartIcon, MapPinIcon } from '@heroicons/react/24/solid'
import { Text } from './text'

interface VendorCardProps {
  vendor: TVendor
  className?: string
}

export default function VendorCard({ vendor, className }: VendorCardProps) {
  const { toggleFavorite, favorites } = useWedding()
  const isFav = favorites.some((f) => f.vendorHandle === vendor.handle)

  return (
    <div className={clsx('group relative w-full rounded-lg border border-primary/30 bg-surface p-3 shadow-sm hover:shadow-md transition-shadow', className)}>
      <Link href={`/products/${vendor.handle}`} className="block overflow-hidden rounded-md">
        <div className="relative aspect-[4/3]">
          <Image
            src={vendor.heroImage.src}
            alt={vendor.heroImage.alt}
            fill
            className="rounded-md object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <Text className="text-sm font-semibold text-text">{vendor.name}</Text>
          <div className="mt-1 flex items-center gap-2 text-xs text-text/60">
            <span className="rounded-full bg-champagne/50 px-2 py-0.5 text-accent font-medium">{vendor.priceRange}</span>
            <span className="rounded-full bg-blush/50 px-2 py-0.5 capitalize text-text">{vendor.subcategory}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-text/60">
            <MapPinIcon className="h-4 w-4 text-primary" />
            <span>{vendor.location}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(vendor.handle)}
          aria-label="Toggle favorite"
          className={clsx(
            'rounded-full p-2 transition',
            isFav ? 'bg-primary/20 text-primary' : 'bg-blush/50 text-text/50 hover:bg-blush'
          )}
        >
          <HeartIcon className={clsx('h-5 w-5', isFav && 'fill-primary')} />
        </button>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-text/70">{vendor.description}</p>
    </div>
  )
}

