'use client'

import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
import { 
  getMyVendorProfile, 
  getMyVendorQuestions, 
  getMyVendorPackages,
  type VendorProfileResponse,
  type VendorQuestionResponse,
  type VendorPackageResponse
} from '@/lib/api/vendor-profile'
import { getVendorQuoteRequests } from '@/lib/api/quote-request'
import { QuoteRequest } from '@/type'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function VendorDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<VendorProfileResponse | null>(null)
  const [questions, setQuestions] = useState<VendorQuestionResponse[]>([])
  const [packages, setPackages] = useState<VendorPackageResponse[]>([])
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user && !user.roles?.includes('VENDOR')) {
      router.push('/subscription')
      return
    }

    loadDashboardData()
  }, [authLoading, isAuthenticated, user, router])

  const loadDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [profileData, questionsData, packagesData, quotesData] = await Promise.all([
        getMyVendorProfile(),
        getMyVendorQuestions().catch(() => []), // Don't fail if questions fail to load
        getMyVendorPackages().catch(() => []), // Don't fail if packages fail to load
        getVendorQuoteRequests().catch(() => []), // Don't fail if quotes fail to load
      ])

      if (!profileData) {
        // No profile exists, redirect to create one
        router.push('/vendor-profile')
        return
      }

      setProfile(profileData)
      setQuestions(questionsData || [])
      setPackages(packagesData || [])
      setQuoteRequests(quotesData || [])
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Text>Loading...</Text>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  if (user && !user.roles?.includes('VENDOR')) {
    return null // Will redirect
  }

  if (!profile) {
    return null // Will redirect to create profile
  }

  return (
    <div className="grid w-full max-w-6xl grid-cols-1 gap-8">
      {/* Header */}
      <div>
        <Link href="/">
          <Logo className="text-zinc-950 dark:text-white" />
        </Link>
        <Heading className="mt-8">Vendor Dashboard</Heading>
        <Text className="mt-2 text-zinc-600">
          Welcome back, {profile.businessName || user?.name || 'Vendor'}!
        </Text>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <Text className="text-sm text-red-800 dark:text-red-200">{error}</Text>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Profile Status</Text>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">
              {profile.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <Text className="mt-1 text-xs text-zinc-500">
            {profile.isActive ? 'Your profile is visible to couples' : 'Your profile is hidden'}
          </Text>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Questions</Text>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">{questions.length}</span>
            <span className="text-sm text-zinc-500">/ 5</span>
          </div>
          <Text className="mt-1 text-xs text-zinc-500">Questions configured</Text>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Packages</Text>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">{packages.length}</span>
            <span className="text-sm text-zinc-500">/ 5</span>
          </div>
          <Text className="mt-1 text-xs text-zinc-500">Pricing packages</Text>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Quote Requests</Text>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">{quoteRequests.length}</span>
          </div>
          <Text className="mt-1 text-xs text-zinc-500">
            {quoteRequests.filter(q => q.status === 'OPEN').length} pending
          </Text>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Category</Text>
          <div className="mt-2">
            <span className="text-lg font-semibold text-zinc-900 dark:text-white">{profile.category}</span>
          </div>
          <Text className="mt-1 text-xs text-zinc-500">Your service category</Text>
        </div>
        {profile.priceRange && (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Price Range</Text>
            <div className="mt-2">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">{profile.priceRange}</span>
            </div>
            <Text className="mt-1 text-xs text-zinc-500">Your pricing tier</Text>
          </div>
        )}
        {profile.pricingPdfUrl && (
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Pricing PDF</Text>
            <div className="mt-2">
              <a
                href={profile.pricingPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
              >
                View PDF
              </a>
            </div>
            <Text className="mt-1 text-xs text-zinc-500">Pricing document</Text>
          </div>
        )}
      </div>

      {/* Profile Summary */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <Heading level={2} className="text-lg">Profile Overview</Heading>
          <Button onClick={() => router.push('/vendor-profile')} outline>
            Edit Profile
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Business Name</Text>
            <Text className="mt-1 text-zinc-900 dark:text-white">{profile.businessName}</Text>
          </div>
          {profile.description && (
            <div>
              <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Description</Text>
              <Text className="mt-1 text-zinc-900 dark:text-white line-clamp-3">{profile.description}</Text>
            </div>
          )}
          {profile.serviceArea && (
            <div>
              <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Service Area</Text>
              <Text className="mt-1 text-zinc-900 dark:text-white">{profile.serviceArea}</Text>
            </div>
          )}
          {profile.priceRange && (
            <div>
              <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Price Range</Text>
              <Text className="mt-1 text-zinc-900 dark:text-white text-lg font-semibold">{profile.priceRange}</Text>
            </div>
          )}
          {profile.pricingPdfUrl && (
            <div>
              <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Pricing PDF</Text>
              <a
                href={profile.pricingPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
              >
                {profile.pricingPdfUrl}
              </a>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {profile.phone && (
              <div>
                <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Phone</Text>
                <Text className="mt-1 text-zinc-900 dark:text-white">{profile.phone}</Text>
              </div>
            )}
            {profile.whatsapp && (
              <div>
                <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400">WhatsApp</Text>
                <Text className="mt-1 text-zinc-900 dark:text-white">{profile.whatsapp}</Text>
              </div>
            )}
          </div>
          {profile.imageUrls && profile.imageUrls.length > 0 && (
            <div>
              <Text className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">Images</Text>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                {profile.imageUrls.slice(0, 5).map((url, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`${profile.businessName} image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide broken images
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <Heading level={2} className="text-lg mb-4">Quick Actions</Heading>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Button onClick={() => router.push('/vendor-profile')} className="w-full justify-start" outline>
            Edit Profile
          </Button>
          <Button onClick={() => router.push('/vendor-questions')} className="w-full justify-start" outline>
            Manage Questions ({questions.length}/5)
          </Button>
          <Button onClick={() => router.push('/vendor/quotes')} className="w-full justify-start" outline>
            View Quote Requests ({quoteRequests.length})
          </Button>
          <Button className="w-full justify-start" outline disabled>
            Manage Calendar (Coming Soon)
          </Button>
          <Button className="w-full justify-start" outline disabled>
            View Bookings (Coming Soon)
          </Button>
          <Button className="w-full justify-start" outline disabled>
            Analytics (Coming Soon)
          </Button>
        </div>
      </div>

      {/* Questions Summary */}
      {questions.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <Heading level={2} className="text-lg">Your Questions</Heading>
            <Button onClick={() => router.push('/vendor-questions')} outline>
              Manage
            </Button>
          </div>
          <div className="space-y-2">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="flex items-start gap-3 rounded-md bg-zinc-50 p-3 dark:bg-zinc-800/50"
              >
                <span className="flex-shrink-0 text-sm font-medium text-zinc-500">#{index + 1}</span>
                <div className="flex-1">
                  <Text className="text-sm text-zinc-900 dark:text-white">{question.questionText}</Text>
                  {question.required && (
                    <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Required
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Questions */}
      {questions.length === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-600 dark:text-zinc-400">You haven&apos;t added any questions yet.</Text>
          <Button onClick={() => router.push('/vendor-questions')} className="mt-4">
            Add Questions
          </Button>
        </div>
      )}

      {/* Packages Summary */}
      {packages.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <Heading level={2} className="text-lg">Your Pricing Packages</Heading>
            <Button onClick={() => router.push('/vendor-profile')} outline>
              Manage
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-white">{pkg.name}</h3>
                {(pkg.priceFrom || pkg.priceTo) && (
                  <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {pkg.priceFrom && pkg.priceTo
                      ? `$${pkg.priceFrom} - $${pkg.priceTo}`
                      : pkg.priceFrom
                      ? `From $${pkg.priceFrom}`
                      : `Up to $${pkg.priceTo}`}
                  </Text>
                )}
                {pkg.description && (
                  <Text className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {pkg.description}
                  </Text>
                )}
                {pkg.features && pkg.features.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {pkg.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-xs text-zinc-500">• {feature}</li>
                    ))}
                    {pkg.features.length > 3 && (
                      <li className="text-xs text-zinc-500">+ {pkg.features.length - 3} more</li>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Packages */}
      {packages.length === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-zinc-600 dark:text-zinc-400">You haven&apos;t added any pricing packages yet.</Text>
          <Button onClick={() => router.push('/vendor-profile')} className="mt-4">
            Add Packages
          </Button>
        </div>
      )}
    </div>
  )
}

