'use client'

import { useState } from 'react'
import { Button } from '@/components/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import QuoteRequestForm from '@/components/quote-request-form'

interface VendorDetailClientProps {
  vendor: {
    id: string
    name: string
    [key: string]: any
  }
}

export default function VendorDetailClient({ vendor }: VendorDetailClientProps) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const vendorProfileId = parseInt(vendor.id)

  return (
    <>
      {/* Request Quote Button */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg">
        <Button
          color="accent"
          className="w-full py-3 text-base"
          onClick={() => setIsQuoteModalOpen(true)}
        >
          Request Quote
        </Button>
        <p className="mt-3 text-xs text-center text-text/60">
          Get a personalized quote for your wedding
        </p>
      </div>

      {/* Quote Request Modal */}
      <Dialog open={isQuoteModalOpen} onClose={setIsQuoteModalOpen}>
        <DialogTitle>Request Quote from {vendor.name}</DialogTitle>
        <DialogDescription>
          Please provide your wedding details and answer the vendor&apos;s questions.
        </DialogDescription>
        <DialogBody>
          <QuoteRequestForm
            vendorProfileId={vendorProfileId}
            vendorName={vendor.name}
            onClose={() => setIsQuoteModalOpen(false)}
          />
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsQuoteModalOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
