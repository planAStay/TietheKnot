'use client'

import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import { useEffect, useState } from 'react'
import { getAllVendorsAdmin, AdminVendorProfile } from '@/lib/api/admin'
import Link from 'next/link'
import { 
  UsersIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline'

export default function AdminDashboard() {
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
      const data = await getAllVendorsAdmin()
      setVendors(data)
    } catch (err) {
      console.error('Error loading vendors:', err)
      setError(err instanceof Error ? err.message : 'Failed to load vendors')
    } finally {
      setIsLoading(false)
    }
  }

  const stats = {
    total: vendors.length,
    pending: vendors.filter((v) => v.approvalStatus === 'PENDING').length,
    approved: vendors.filter((v) => v.approvalStatus === 'APPROVED').length,
    rejected: vendors.filter((v) => v.approvalStatus === 'REJECTED').length,
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Heading level={1} className="text-3xl font-bold">
          Admin Dashboard
        </Heading>
        <Link href="/admin/vendors/pending">
          <Button>Review Pending Vendors</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <UsersIcon className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-zinc-600">Total Vendors</p>
              <p className="text-3xl font-bold text-zinc-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-yellow-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm text-zinc-600">Pending Approval</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-green-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-zinc-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-red-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <XCircleIcon className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm text-zinc-600">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Vendors */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6 shadow-sm">
        <Heading level={2} className="text-xl font-semibold mb-4">
          All Vendors
        </Heading>

        {isLoading ? (
          <p className="text-center py-8 text-zinc-500">Loading vendors...</p>
        ) : error ? (
          <div className="rounded-lg border-2 border-red-300 bg-red-50 p-4">
            <p className="text-red-800">{error}</p>
          </div>
        ) : vendors.length === 0 ? (
          <p className="text-center py-8 text-zinc-500">No vendors found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 text-left">
                  <th className="pb-3 text-sm font-semibold text-zinc-700">Business Name</th>
                  <th className="pb-3 text-sm font-semibold text-zinc-700">Category</th>
                  <th className="pb-3 text-sm font-semibold text-zinc-700">Contact</th>
                  <th className="pb-3 text-sm font-semibold text-zinc-700">Status</th>
                  <th className="pb-3 text-sm font-semibold text-zinc-700">Created</th>
                  <th className="pb-3 text-sm font-semibold text-zinc-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="py-4 text-sm font-medium text-zinc-900">
                      {vendor.businessName}
                    </td>
                    <td className="py-4 text-sm text-zinc-600">{vendor.category}</td>
                    <td className="py-4 text-sm text-zinc-600">
                      {vendor.userEmail}
                      {vendor.phone && <span className="block text-xs">{vendor.phone}</span>}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          vendor.approvalStatus === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : vendor.approvalStatus === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {vendor.approvalStatus}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-zinc-600">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <Link href={`/admin/vendors/${vendor.id}`}>
                        <Button outline className="text-xs py-1 px-3">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

