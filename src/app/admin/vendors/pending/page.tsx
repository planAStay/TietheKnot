'use client'

import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { useEffect, useState } from 'react'
import { getPendingVendors, AdminVendorProfile } from '@/lib/api/admin'
import Link from 'next/link'
import { ClockIcon } from '@heroicons/react/24/outline'

export default function PendingVendorsPage() {
  const [vendors, setVendors] = useState<AdminVendorProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadVendors()
  }, [])

  const loadVendors = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getPendingVendors()
      setVendors(data)
    } catch (err) {
      console.error('Error loading pending vendors:', err)
      setError(err instanceof Error ? err.message : 'Failed to load vendors')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="text-3xl font-bold">
            Pending Vendor Approvals
          </Heading>
          <p className="mt-2 text-zinc-600">
            Review and approve vendor profiles waiting for verification
          </p>
        </div>
        <Link href="/admin/dashboard">
          <Button outline>Back to Dashboard</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-sm">
        {isLoading ? (
          <p className="text-center py-8 text-zinc-500">Loading pending vendors...</p>
        ) : error ? (
          <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
            <p className="text-red-800">{error}</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="h-16 w-16 mx-auto mb-4 text-zinc-400" />
            <Heading level={2} className="text-xl font-semibold mb-2">
              No Pending Vendors
            </Heading>
            <p className="text-zinc-600">All vendor profiles have been reviewed!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="border border-zinc-200 rounded-lg p-6 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Heading level={3} className="text-xl font-semibold">
                        {vendor.businessName}
                      </Heading>
                      <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Pending
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-zinc-600">
                          <span className="font-medium">Category:</span> {vendor.category}
                        </p>
                        <p className="text-sm text-zinc-600">
                          <span className="font-medium">Base Location:</span> {vendor.baseLocation || 'N/A'}
                        </p>
                        {vendor.serviceAreas && vendor.serviceAreas.length > 0 && (
                          <p className="text-sm text-zinc-600">
                            <span className="font-medium">Service Areas:</span>{' '}
                            {vendor.serviceAreas.join(', ')}
                          </p>
                        )}
                        <p className="text-sm text-zinc-600">
                          <span className="font-medium">Price Range:</span> {vendor.priceRange || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-600">
                          <span className="font-medium">Contact:</span> {vendor.userEmail}
                        </p>
                        {vendor.phone && (
                          <p className="text-sm text-zinc-600">
                            <span className="font-medium">Phone:</span> {vendor.phone}
                          </p>
                        )}
                        <p className="text-sm text-zinc-600">
                          <span className="font-medium">Submitted:</span>{' '}
                          {new Date(vendor.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {vendor.description && (
                      <p className="mt-4 text-sm text-zinc-700 line-clamp-2">
                        {vendor.description}
                      </p>
                    )}

                    {vendor.imageUrls && vendor.imageUrls.length > 0 && (
                      <div className="mt-4 flex gap-2">
                        {vendor.imageUrls.slice(0, 4).map((url, idx) => (
                          <div
                            key={idx}
                            className="w-20 h-20 rounded overflow-hidden bg-zinc-100"
                          >
                            <img
                              src={url}
                              alt={`${vendor.businessName} - ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {vendor.imageUrls.length > 4 && (
                          <div className="w-20 h-20 rounded bg-zinc-100 flex items-center justify-center text-sm text-zinc-600">
                            +{vendor.imageUrls.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <Link href={`/admin/vendors/${vendor.id}`}>
                      <Button>Review & Approve</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

