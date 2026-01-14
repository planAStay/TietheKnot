'use client'

import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
import { selectVendorRole, getCurrentSubscription } from '@/lib/api/subscription'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SubscriptionSelection() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingSubscription, setCheckingSubscription] = useState(true)
  const { refreshUser, isAuthenticated } = useAuth()
  const router = useRouter()

  // Check if user already has a subscription
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      try {
        const subscription = await getCurrentSubscription()
        if (subscription) {
          // User already has subscription, redirect to home
          router.push('/')
          return
        }
      } catch (error) {
        console.error('Error checking subscription:', error)
      } finally {
        setCheckingSubscription(false)
      }
    }

    checkSubscription()
  }, [isAuthenticated, router])

  if (checkingSubscription) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Text>Loading...</Text>
      </div>
    )
  }

  const handleVendorSelection = async () => {
    setError(null)
    setIsLoading(true)

    try {
      await selectVendorRole()
      await refreshUser() // Refresh user to get updated roles
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set up vendor account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCoupleSelection = () => {
    // Couples don't need subscription, just continue to home
    router.push('/')
    router.refresh()
  }

  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-8">
      <div>
        <Link href="/">
          <Logo className="text-zinc-950 dark:text-white" />
        </Link>
        <Heading className="mt-8">Welcome to TieTheKnot!</Heading>
        <Text className="mt-4 text-zinc-600">
          Let&apos;s get you started. Are you planning to list your services as a vendor, or are you a couple looking for wedding vendors?
        </Text>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <Text className="text-sm text-red-800 dark:text-red-200">{error}</Text>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Vendor Option */}
        <div className="group relative overflow-hidden rounded-lg border-2 border-zinc-200 bg-white p-8 transition-all hover:border-zinc-400 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
              <svg
                className="h-12 w-12 text-zinc-600 dark:text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <Heading level={3} className="mb-2">
              I am a Vendor
            </Heading>
            <Text className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
              List your wedding services and connect with couples looking for vendors like you.
            </Text>
            <ul className="mb-6 space-y-2 text-left text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Free lifetime subscription
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                1 vendor profile
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                5 custom questions
              </li>
            </ul>
            <Button
              onClick={handleVendorSelection}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Setting up...' : 'Continue as Vendor'}
            </Button>
          </div>
        </div>

        {/* Couple Option */}
        <div className="group relative overflow-hidden rounded-lg border-2 border-zinc-200 bg-white p-8 transition-all hover:border-zinc-400 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
              <svg
                className="h-12 w-12 text-zinc-600 dark:text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <Heading level={3} className="mb-2">
              I am a Couple
            </Heading>
            <Text className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
              Find and connect with the perfect wedding vendors for your special day.
            </Text>
            <ul className="mb-6 space-y-2 text-left text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Browse vendors
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Request quotes
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Manage bookings
              </li>
            </ul>
            <Button
              onClick={handleCoupleSelection}
              disabled={isLoading}
              className="w-full"
              outline
            >
              Continue as Couple
            </Button>
          </div>
        </div>
      </div>

      <Text className="text-center text-sm text-zinc-500">
        You can change this later in your account settings.
      </Text>
    </div>
  )
}

