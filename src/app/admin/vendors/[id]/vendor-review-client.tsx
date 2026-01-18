'use client'

import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Textarea } from '@/components/textarea'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { approveVendor, rejectVendor, getVendorByIdAdmin, AdminVendorProfile } from '@/lib/api/admin'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowLeftIcon 
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export function VendorReviewPageClient({ vendorId }: { vendorId: string }) {
  const router = useRouter()
  const [vendor, setVendor] = useState<AdminVendorProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    loadVendor()
  }, [vendorId])

  const loadVendor = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getVendorByIdAdmin(parseInt(vendorId))
      setVendor(data)
      setAdminNotes(data.adminNotes || '')
    } catch (err) {
      console.error('Error loading vendor:', err)
      setError(err instanceof Error ? err.message : 'Failed to load vendor')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!vendor) return
    
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await approveVendor(vendor.id, adminNotes)
      router.push('/admin/vendors/pending')
    } catch (err) {
      console.error('Error approving vendor:', err)
      setSubmitError(err instanceof Error ? err.message : 'Failed to approve vendor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!vendor) return
    
    if (!adminNotes.trim()) {
      setSubmitError('Please provide a reason for rejection')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await rejectVendor(vendor.id, adminNotes)
      router.push('/admin/vendors/pending')
    } catch (err) {
      console.error('Error rejecting vendor:', err)
      setSubmitError(err instanceof Error ? err.message : 'Failed to reject vendor')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Loading vendor details...</p>
      </div>
    )
  }

  if (error || !vendor) {
    return (
      <div className="space-y-4">
        <Link href="/admin/vendors/pending">
          <Button outline>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Pending Vendors
          </Button>
        </Link>
        <div className="rounded-lg border-2 border-red-300 bg-red-50 p-6">
          <p className="text-red-800">{error || 'Vendor not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/vendors/pending">
            <Button outline>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Heading level={1} className="text-2xl font-bold">
            Review Vendor Profile
          </Heading>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            vendor.approvalStatus === 'APPROVED'
              ? 'bg-green-100 text-green-800'
              : vendor.approvalStatus === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {vendor.approvalStatus}
        </span>
      </div>

      {/* Vendor Details */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-sm">
        <Heading level={2} className="text-xl font-semibold mb-6">
          Business Information
        </Heading>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Business Name
            </label>
            <p className="text-zinc-900 font-medium">{vendor.businessName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Category
            </label>
            <p className="text-zinc-900">{vendor.category}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Base Location
            </label>
            <p className="text-zinc-900">{vendor.baseLocation || 'Not specified'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Service Areas (Provinces)
            </label>
            {vendor.serviceAreas && vendor.serviceAreas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {vendor.serviceAreas.map((province, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {province}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-zinc-900">Not specified</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Price Range
            </label>
            <p className="text-zinc-900">{vendor.priceRange || 'Not specified'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Instagram
            </label>
            {vendor.instagramUrl ? (
              <a
                href={vendor.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {vendor.instagramUrl}
              </a>
            ) : (
              <p className="text-zinc-900">Not provided</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Facebook
            </label>
            {vendor.facebookUrl ? (
              <a
                href={vendor.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {vendor.facebookUrl}
              </a>
            ) : (
              <p className="text-zinc-900">Not provided</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Business Contact Number
            </label>
            <p className="text-zinc-900">{vendor.phone || 'Not provided'}</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Email
            </label>
            <p className="text-zinc-900">{vendor.userEmail}</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Description
            </label>
            <p className="text-zinc-900 whitespace-pre-wrap">
              {vendor.description || 'No description provided'}
            </p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {vendor.imageUrls && vendor.imageUrls.length > 0 && (
        <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-sm">
          <Heading level={2} className="text-xl font-semibold mb-4">
            Gallery ({vendor.imageUrls.length} images)
          </Heading>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendor.imageUrls.map((url, index) => (
              <div
                key={index}
                className="aspect-square relative rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200"
              >
                <img
                  src={url}
                  alt={`${vendor.businessName} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Notes */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-sm">
        <Heading level={2} className="text-xl font-semibold mb-4">
          Admin Notes
        </Heading>
        <Textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Add notes about this vendor profile (visible to vendor if rejected)..."
          rows={4}
          className="w-full"
        />
        <p className="text-sm text-zinc-600 mt-2">
          These notes will be shared with the vendor if you reject their profile.
        </p>
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
          <p className="text-red-800">{submitError}</p>
        </div>
      )}

      {/* Action Buttons */}
      {vendor.approvalStatus === 'PENDING' && (
        <div className="flex gap-4 justify-end bg-white rounded-lg border border-zinc-200 p-6 shadow-sm">
          <Button
            outline
            onClick={handleReject}
            disabled={isSubmitting}
            className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
          >
            <XCircleIcon className="h-4 w-4" />
            {isSubmitting ? 'Rejecting...' : 'Reject Profile'}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircleIcon className="h-4 w-4" />
            {isSubmitting ? 'Approving...' : 'Approve Profile'}
          </Button>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-zinc-50 rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <span className="font-medium">Created:</span>{' '}
            {new Date(vendor.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span>{' '}
            {new Date(vendor.updatedAt).toLocaleString()}
          </div>
          {vendor.approvedAt && (
            <div>
              <span className="font-medium">Approved At:</span>{' '}
              {new Date(vendor.approvedAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

