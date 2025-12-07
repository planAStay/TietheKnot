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
    <div className={clsx('group relative w-full rounded-lg border border-zinc-200 bg-white p-3 shadow-sm', className)}>
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
          <Text className="text-sm font-semibold text-zinc-900">{vendor.name}</Text>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-700">{vendor.priceRange}</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 capitalize text-zinc-700">{vendor.subcategory}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
            <MapPinIcon className="h-4 w-4 text-zinc-400" />
            <span>{vendor.location}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(vendor.handle)}
          aria-label="Toggle favorite"
          className={clsx(
            'rounded-full p-2 transition',
            isFav ? 'bg-rose-50 text-rose-600' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
          )}
        >
          <HeartIcon className={clsx('h-5 w-5', isFav && 'fill-rose-500')} />
        </button>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{vendor.description}</p>
    </div>
  )
}

