'use client'

import { TVendor } from '@/type'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { MapPinIcon } from '@heroicons/react/24/outline'

interface VendorCardProps {
  vendor: TVendor
  className?: string
}

export default function VendorCard({ vendor, className, priority = false }: VendorCardProps & { priority?: boolean }) {
  return (
    <Link 
      href={`/products/${vendor.handle}`} 
      className={clsx('group block w-full cursor-pointer', className)}
    >
      <div className="relative w-full">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100">
          <Image
            src={vendor.heroImage.src}
            alt={vendor.heroImage.alt}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            quality={75}
          />
        </div>

        {/* Content */}
        <div className="mt-3">
          {/* Name and Price Range */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-text line-clamp-1 flex-1">
              {vendor.name}
            </h3>
            {vendor.priceRange && (
              <span className="text-xs text-secondary whitespace-nowrap">
                {vendor.priceRange}
              </span>
            )}
          </div>

          {/* Location */}
          {vendor.location && (
            <div className="mt-1 flex items-center gap-1 text-xs text-secondary">
              <MapPinIcon className="h-3 w-3" />
              <span className="line-clamp-1">{vendor.location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

