'use client'

import QuotationFormModal from '@/components/quotation-form-modal'
import { Heading } from '@/components/heading'
import { useWedding } from '@/lib/wedding-context'
import { TVendor } from '@/type'
import clsx from 'clsx'
import { useState } from 'react'

export default function VendorDetailClient({ vendor }: { vendor: TVendor }) {
  const [open, setOpen] = useState(false)
  const { toggleFavorite, favorites } = useWedding()
  const isFav = favorites.some((f) => f.vendorHandle === vendor.handle)

  return (
    <div className="mt-6 flex flex-col gap-4 lg:mt-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase text-zinc-500">{vendor.subcategory}</p>
          <Heading level={1} className="mt-1 text-3xl font-semibold">
            {vendor.name}
          </Heading>
          <p className="text-sm text-zinc-500">{vendor.location}</p>
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(vendor.handle)}
          className={clsx(
            'rounded-full px-3 py-1 text-sm font-semibold shadow-sm transition',
            isFav ? 'bg-rose-600 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
          )}
        >
          {isFav ? 'Favorited' : 'Save'}
        </button>
      </div>

      <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">
        {vendor.description}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-zinc-600">
        <div className="rounded-lg border border-zinc-200 bg-white p-3">
          <p className="text-xs uppercase text-zinc-400">Category</p>
          <p className="font-semibold capitalize text-zinc-900">{vendor.subcategory}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-3">
          <p className="text-xs uppercase text-zinc-400">Price range</p>
          <p className="font-semibold text-zinc-900">{vendor.priceRange}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
        {vendor.tags?.map((tag) => (
          <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
        >
          Request quote
        </button>
        <button
          onClick={() => toggleFavorite(vendor.handle)}
          className={clsx(
            'rounded-md px-4 py-2 text-sm font-semibold shadow-sm',
            isFav ? 'bg-rose-100 text-rose-700' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
          )}
        >
          {isFav ? 'Remove favorite' : 'Add to favorites'}
        </button>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
        <p className="text-xs uppercase text-zinc-400">Contact</p>
        <div className="mt-1 space-y-1">
          {vendor.contact?.email ? <p>Email: {vendor.contact.email}</p> : null}
          {vendor.contact?.phone ? <p>Phone: {vendor.contact.phone}</p> : null}
          {vendor.contact?.website ? <p>Website: {vendor.contact.website}</p> : null}
          {vendor.contact?.instagram ? <p>Instagram: {vendor.contact.instagram}</p> : null}
        </div>
      </div>

      <QuotationFormModal vendor={vendor} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

