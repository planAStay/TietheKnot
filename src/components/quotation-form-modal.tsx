'use client'

import { TVendor } from '@/type'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useWedding } from '@/lib/wedding-context'
import { useState } from 'react'

interface Props {
  vendor: TVendor
  open: boolean
  onClose: () => void
}

export default function QuotationFormModal({ vendor, open, onClose }: Props) {
  const { addQuotation, weddingInfo } = useWedding()
  const [budget, setBudget] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = () => {
    addQuotation({
      vendorHandle: vendor.handle,
      vendorName: vendor.name,
      category: vendor.category,
      subcategory: vendor.subcategory,
      budget,
      guestCount,
      notes,
      eventDate: weddingInfo.weddingDate,
    })
    onClose()
    setBudget('')
    setGuestCount('')
    setNotes('')
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-zinc-900">Request a quote</Dialog.Title>
            <button onClick={onClose} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-1 text-sm text-zinc-500">We will forward this to {vendor.name}.</p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-zinc-600">Estimated budget</label>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="$5,000"
                className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Guest count</label>
              <input
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                placeholder="150"
                className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share timing, style, or must-haves."
                className="mt-1 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
                rows={4}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-5 w-full rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Send request
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

