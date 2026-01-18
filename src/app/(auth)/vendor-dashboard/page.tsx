'use client'

import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
import { 
  getMyVendorProfile, 
  getMyVendorQuestions, 
  getMyVendorPackages,
  deleteMyVendorProfile,
  type VendorProfileResponse,
  type VendorQuestionResponse,
  type VendorPackageResponse
} from '@/lib/api/vendor-profile'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  PhoneIcon,
  MapPinIcon,
  PhotoIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { useConfirmDestructive } from '@/components/confirm-dialog'

export default function VendorDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<VendorProfileResponse | null>(null)
  const [questions, setQuestions] = useState<VendorQuestionResponse[]>([])
  const [packages, setPackages] = useState<VendorPackageResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const confirmDestructive = useConfirmDestructive()

  useEffect(() => {
    if (authLoading) return

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

  const loadDashboardData = async (forceRefresh: boolean = false) => {
    setIsLoading(true)
    setError(null)
    try {
      const [profileData, questionsData, packagesData] = await Promise.all([
        getMyVendorProfile(forceRefresh).catch(() => null),
        getMyVendorQuestions().catch(() => []),
        getMyVendorPackages().catch(() => []),
      ])

      // Profile might not exist - that's okay, we'll show "Add Profile" button
      setProfile(profileData || null)
      setQuestions(questionsData || [])
      setPackages(packagesData || [])
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProfile = async () => {
    const confirmed = await confirmDestructive(
      'This will permanently delete your vendor profile, all images, packages, and questions. This action cannot be undone.',
      'Delete Vendor Profile?'
    )

    if (!confirmed) return

    setIsDeleting(true)
    setError(null)
    try {
      await deleteMyVendorProfile()
      
      // Clear all state immediately
      setProfile(null)
      setQuestions([])
      setPackages([])
      
      // Clear Next.js router cache
      router.refresh()
      
      // Small delay to ensure backend has processed deletion
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Reload dashboard data with fresh fetch (no cache)
      await loadDashboardData(true)
    } catch (err) {
      console.error('Error deleting profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete profile')
      // Reset state on error too
      setProfile(null)
      setQuestions([])
      setPackages([])
    } finally {
      setIsDeleting(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <Text className="text-text/70">Loading dashboard...</Text>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user?.roles?.includes('VENDOR')) {
    return null
  }

  // Show "Add Vendor Profile" UI if no profile exists
  if (!profile) {
    return (
      <div className="min-h-full bg-background">
        <div className="py-6 px-4 sm:py-8 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Heading level={1} className="text-2xl sm:text-3xl font-bold text-text mb-1">
                Vendor Dashboard
              </Heading>
              <Text className="text-sm text-text/70">Manage your vendor profile and listings</Text>
            </div>
            <Link href="/account">
              <Button outline>Account Settings</Button>
            </Link>
          </div>

          {/* No Profile Card */}
          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-8 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <PhotoIcon className="mx-auto mb-4 h-16 w-16 text-zinc-300" />
              <Heading level={2} className="mb-2 text-xl font-semibold text-text">
                No Vendor Profile
              </Heading>
              <Text className="mb-6 text-sm text-text/70">
                Create your vendor profile to start listing your services on TieTheKnot and connect with couples looking for your services.
              </Text>
              <Link href="/vendor-profile">
                <Button>Create Vendor Profile</Button>
              </Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    )
  }

  const getApprovalStatusConfig = () => {
    const status = profile.approvalStatus || 'PENDING'
    
    const statusConfig = {
      PENDING: {
        bg: 'bg-accent/10',
        border: 'border-accent/30',
        iconColor: 'text-accent',
        icon: <ClockIcon className="h-5 w-5" />,
        title: 'Pending Approval',
        message: 'Your vendor profile is under review.',
      },
      APPROVED: {
        bg: 'bg-secondary/10',
        border: 'border-secondary/30',
        iconColor: 'text-secondary',
        icon: <CheckCircleIcon className="h-5 w-5" />,
        title: 'Profile Approved',
        message: 'Your profile is live and visible to couples!',
      },
      REJECTED: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconColor: 'text-red-600',
        icon: <XCircleIcon className="h-5 w-5" />,
        title: 'Profile Rejected',
        message: profile.adminNotes || 'Your profile needs updates.',
      },
    }

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
  }

  const statusConfig = getApprovalStatusConfig()

  return (
    <div className="min-h-full bg-background">
      <div className="py-6 px-4 sm:py-8 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Heading level={1} className="text-2xl sm:text-3xl font-bold text-text mb-1">
              Vendor Dashboard
            </Heading>
            <Text className="text-sm text-text/70">Manage your vendor profile and listings</Text>
          </div>
          <Link href="/account">
            <Button outline>Account Settings</Button>
          </Link>
        </div>

        {/* Approval Status */}
        <div className={`mb-8 rounded-lg border ${statusConfig.border} ${statusConfig.bg} p-5 dark:border-zinc-700`}>
          <div className="flex items-center gap-3">
            <div className={statusConfig.iconColor}>{statusConfig.icon}</div>
            <div>
              <h3 className="font-semibold text-text">{statusConfig.title}</h3>
              <p className="text-sm text-text/70">{statusConfig.message}</p>
              {profile.approvalStatus === 'REJECTED' && profile.adminNotes && (
                <div className="mt-2 rounded border border-red-200 bg-white dark:bg-zinc-800 dark:border-red-900 p-2 text-xs">
                  <p className="font-medium text-text mb-1">Admin Feedback:</p>
                  <p className="text-text/70">{profile.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* 1. Vendor Profile Details */}
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <Heading level={2} className="text-lg font-semibold text-text">Profile Details</Heading>
            <div className="flex gap-2">
              <Link href="/vendor-profile">
                <Button outline className="!px-3 !py-2">
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                outline
                className="!px-3 !py-2 text-red-600 border-red-300 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-950/20"
                onClick={handleDeleteProfile}
                disabled={isDeleting}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold text-text mb-1">{profile.businessName}</h3>
              <p className="text-xs uppercase text-secondary font-semibold">{profile.category}</p>
            </div>

            {profile.baseLocation && (
              <div className="flex items-center gap-2 text-sm text-text/70">
                <MapPinIcon className="h-4 w-4 text-secondary" />
                <span>{profile.baseLocation}</span>
              </div>
            )}

            {profile.phone && (
              <div className="flex items-center gap-2 text-sm text-text/70">
                <PhoneIcon className="h-4 w-4 text-text/60" />
                <span>{profile.phone}</span>
              </div>
            )}

            {profile.priceRange && (
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {profile.priceRange}
              </div>
            )}

            {profile.serviceAreas && profile.serviceAreas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.serviceAreas.map((area, idx) => (
                  <span key={idx} className="rounded-full bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary">
                    {area}
                  </span>
                ))}
              </div>
            )}

            {profile.description && (
              <div className="border-t border-zinc-200 pt-3">
                <p className="text-sm text-text/80 line-clamp-2">{profile.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. Prices/Packages */}
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-5 w-5 text-accent" />
              <Heading level={2} className="text-lg font-semibold text-text">Packages</Heading>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text/70">{packages.length}/5</span>
              <Link href="/vendor-profile">
                <Button outline className="!px-3 !py-2 !text-sm">Manage</Button>
              </Link>
            </div>
          </div>

          {packages.length === 0 ? (
            <div className="py-8 text-center">
              <CurrencyDollarIcon className="mx-auto mb-2 h-8 w-8 text-zinc-300" />
              <p className="mb-3 text-sm text-text/70">No packages added</p>
              <Link href="/vendor-profile">
                <Button className="!px-4 !py-2">Add Packages</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg) => (
                <div key={pkg.id} className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:bg-zinc-800">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-text">{pkg.name}</h3>
                    <p className="font-bold text-accent">
                      ${pkg.priceFrom}{pkg.priceTo ? ` - $${pkg.priceTo}` : '+'}
                    </p>
                  </div>
                  {pkg.description && (
                    <p className="mb-2 text-xs text-text/70 line-clamp-1">{pkg.description}</p>
                  )}
                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="space-y-1">
                      {pkg.features.slice(0, 2).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-text/70">
                          <CheckCircleIcon className="h-3 w-3 text-secondary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {pkg.features.length > 2 && (
                        <li className="text-xs text-text/50">+{pkg.features.length - 2} more</li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Questions */}
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QuestionMarkCircleIcon className="h-5 w-5 text-primary" />
              <Heading level={2} className="text-lg font-semibold text-text">Questions</Heading>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text/70">{questions.length}/5</span>
              <Link href="/vendor-questions">
                <Button outline className="!px-3 !py-2 !text-sm">Manage</Button>
              </Link>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="py-8 text-center">
              <QuestionMarkCircleIcon className="mx-auto mb-2 h-8 w-8 text-zinc-300" />
              <p className="mb-3 text-sm text-text/70">No questions added</p>
              <Link href="/vendor-questions">
                <Button className="!px-4 !py-2">Add Questions</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {questions.map((q, index) => (
                <div key={q.id} className="flex items-start gap-2 rounded bg-zinc-50 p-2 dark:bg-zinc-800">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm text-text/80">{q.questionText}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Gallery */}
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhotoIcon className="h-5 w-5 text-secondary" />
              <Heading level={2} className="text-lg font-semibold text-text">Gallery</Heading>
            </div>
            {profile.imageUrls && profile.imageUrls.length > 0 && (
              <span className="text-xs text-text/70">{profile.imageUrls.length} images</span>
            )}
          </div>

          {!profile.imageUrls || profile.imageUrls.length === 0 ? (
            <div className="py-8 text-center">
              <PhotoIcon className="mx-auto mb-2 h-8 w-8 text-zinc-300" />
              <p className="mb-3 text-sm text-text/70">No images added</p>
              <Link href="/vendor-profile">
                <Button className="!px-4 !py-2">Add Images</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {profile.imageUrls.slice(0, 6).map((url, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100">
                  <Image
                    src={url}
                    alt={`${profile.businessName} - ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </div>
              ))}
              {profile.imageUrls.length > 6 && (
                <div className="flex aspect-square items-center justify-center rounded-lg bg-zinc-100">
                  <span className="text-xs font-medium text-text/70">+{profile.imageUrls.length - 6}</span>
                </div>
              )}
            </div>
          )}
        </div>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 p-4">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
