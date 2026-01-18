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
    return <div>Loading...</div>
  }

  if (!isAuthenticated || !user?.roles?.includes('VENDOR')) {
    return null
  }

  // Show "Add Vendor Profile" UI if no profile exists
  if (!profile) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <Heading level={1} className="text-2xl font-semibold text-text">Vendor Dashboard</Heading>
              <Link href="/account">
                <Button outline className="text-xs px-2 py-1 h-7">Account Settings</Button>
              </Link>
            </div>
            <Text className="text-sm text-text/70">Manage your vendor profile and listings</Text>
          </div>

          {/* No Profile Card */}
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <PhotoIcon className="h-16 w-16 mx-auto text-zinc-300" />
              </div>
              <Heading level={2} className="text-xl font-semibold text-text mb-2">
                No Vendor Profile
              </Heading>
              <Text className="text-sm text-text/70 mb-6">
                Create your vendor profile to start listing your services on TieTheKnot and connect with couples looking for your services.
              </Text>
              <Link href="/vendor-profile">
                <Button className="bg-primary text-white hover:bg-primary/90">
                  Add Vendor Profile
                </Button>
              </Link>
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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <Heading level={1} className="text-2xl font-semibold text-text">Vendor Dashboard</Heading>
            <Link href="/account">
              <Button outline className="text-xs px-2 py-1 h-7">Account Settings</Button>
            </Link>
          </div>
          <Text className="text-sm text-text/70">Manage your vendor profile and listings</Text>
        </div>

        {/* Approval Status - Full Width */}
        <div className={`rounded-xl border ${statusConfig.border} ${statusConfig.bg} p-4 mb-4`}>
          <div className="flex items-center gap-3">
            <div className={statusConfig.iconColor}>{statusConfig.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-text">{statusConfig.title}</h3>
              <p className="text-sm text-text/70">{statusConfig.message}</p>
              {profile.approvalStatus === 'REJECTED' && profile.adminNotes && (
                <div className="mt-2 p-2 bg-white rounded border border-red-200">
                  <p className="text-xs font-medium text-text mb-1">Admin Feedback:</p>
                  <p className="text-xs text-text/70">{profile.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid Layout - Desktop: 2 columns, Mobile: 1 column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Profile Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <Heading level={2} className="text-lg font-semibold text-text mb-1 break-words">
                    {profile.businessName}
                  </Heading>
                  <Text className="text-secondary text-xs uppercase mb-2">{profile.category}</Text>
                  
                  <div className="space-y-1.5 mb-3">
                    {profile.baseLocation && (
                      <div className="flex items-center gap-1.5 text-xs text-text/70">
                        <MapPinIcon className="h-3.5 w-3.5 text-secondary" />
                        <span>{profile.baseLocation}</span>
                      </div>
                    )}
                    
                    {profile.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-text/70">
                        <PhoneIcon className="h-3.5 w-3.5 text-text/50" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                  </div>

                  {profile.priceRange && (
                    <div className="inline-flex items-center px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium mb-2">
                      {profile.priceRange}
                    </div>
                  )}

                  {profile.serviceAreas && profile.serviceAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {profile.serviceAreas.map((area, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full">
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                <Link href="/vendor-profile">
                  <Button outline className="text-xs px-2 py-1 h-7 flex items-center gap-1">
                    <PencilIcon className="h-3 w-3" />
                    Edit
                  </Button>
                </Link>
                  <Button
                    outline
                    className="text-xs px-2 py-1 h-7 flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/20"
                    onClick={handleDeleteProfile}
                    disabled={isDeleting}
                  >
                    <TrashIcon className="h-3 w-3" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>

              {profile.description && (
                <p className="text-text/80 text-xs line-clamp-2 border-t border-zinc-100 pt-3">
                  {profile.description}
                </p>
              )}
            </div>

            {/* Questions Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <QuestionMarkCircleIcon className="h-3.5 w-3.5 text-primary" />
                  <Heading level={2} className="text-lg font-semibold text-text">
                    Questions
                  </Heading>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text/70">{questions.length}/5</span>
                  <Link href="/vendor-questions">
                    <Button outline className="text-xs px-2 py-1 h-7">
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-6 bg-background rounded-lg">
                  <QuestionMarkCircleIcon className="h-8 w-8 mx-auto mb-2 text-zinc-300" />
                  <p className="text-xs text-text/70 mb-2">No questions added</p>
                  <Link href="/vendor-questions">
                    <Button className="bg-primary text-white hover:bg-primary/90 text-xs px-2.5 py-1 h-7">
                      Add Questions
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {questions.map((q, index) => (
                    <div key={q.id} className="flex items-start gap-2 p-2.5 bg-background rounded-lg">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-xs text-text/80 flex-1">{q.questionText}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Packages Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-3.5 w-3.5 text-accent" />
                  <Heading level={2} className="text-lg font-semibold text-text">
                    Packages
                  </Heading>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text/70">{packages.length}/5</span>
                  <Link href="/vendor-profile">
                    <Button outline className="text-xs px-2 py-1 h-7">
                      Manage
                    </Button>
                  </Link>
                </div>
              </div>

              {packages.length === 0 ? (
                <div className="text-center py-6 bg-background rounded-lg">
                  <CurrencyDollarIcon className="h-8 w-8 mx-auto mb-2 text-zinc-300" />
                  <p className="text-xs text-text/70 mb-2">No packages added</p>
                  <Link href="/vendor-profile">
                    <Button className="bg-primary text-white hover:bg-primary/90 text-xs px-2.5 py-1 h-7">
                      Add Packages
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="p-3 border border-zinc-200 rounded-lg bg-background hover:shadow-sm transition-shadow">
                      <h3 className="font-semibold text-text text-xs mb-1">{pkg.name}</h3>
                      <p className="text-sm font-bold text-secondary mb-1.5">
                        ${pkg.priceFrom} - ${pkg.priceTo}
                      </p>
                      {pkg.description && (
                        <p className="text-xs text-text/70 mb-1.5 line-clamp-2">{pkg.description}</p>
                      )}
                      {pkg.features && pkg.features.length > 0 && (
                        <ul className="text-xs text-text/70 space-y-0.5">
                          {pkg.features.slice(0, 2).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircleIcon className="h-3 w-3 text-secondary flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                          {pkg.features.length > 2 && (
                            <li className="text-text/50 text-xs">+{pkg.features.length - 2} more</li>
                          )}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Gallery Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PhotoIcon className="h-3.5 w-3.5 text-secondary" />
                  <Heading level={2} className="text-lg font-semibold text-text">
                    Gallery
                  </Heading>
                </div>
                {profile.imageUrls && profile.imageUrls.length > 0 && (
                  <span className="text-xs text-text/70">{profile.imageUrls.length} images</span>
                )}
              </div>

              {!profile.imageUrls || profile.imageUrls.length === 0 ? (
                <div className="text-center py-6 bg-background rounded-lg">
                  <PhotoIcon className="h-8 w-8 mx-auto mb-2 text-zinc-300" />
                  <p className="text-xs text-text/70 mb-2">No images added</p>
                  <Link href="/vendor-profile">
                    <Button className="bg-primary text-white hover:bg-primary/90 text-xs px-2.5 py-1 h-7">
                      Add Images
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {profile.imageUrls.slice(0, 6).map((url, index) => (
                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden bg-zinc-100 group">
                      <Image 
                        src={url} 
                        alt={`${profile.businessName} - ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 33vw, 200px"
                      />
                    </div>
                  ))}
                  {profile.imageUrls.length > 6 && (
                    <div className="aspect-square relative rounded-lg overflow-hidden bg-zinc-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-text/70">+{profile.imageUrls.length - 6}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
