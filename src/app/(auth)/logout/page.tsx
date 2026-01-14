'use client'

import { Logo } from '@/app/logo'
import { Button } from '@/components/button'
import { Text } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Logout() {
  const { logout, user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setError(null)

    try {
      await logout()
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout. Please try again.')
      setIsLoggingOut(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="grid w-full max-w-sm grid-cols-1 gap-8">
        <div>
          <Link href="/">
            <Logo className="text-zinc-950 dark:text-white" />
          </Link>
          <Text className="mt-5 text-zinc-600">
            You are already logged out.
          </Text>
        </div>
        <Button onClick={() => router.push('/')} className="w-full">
          Go to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-sm grid-cols-1 gap-8">
      <div>
        <Link href="/">
          <Logo className="text-zinc-950 dark:text-white" />
        </Link>
        <Text className="mt-5 text-zinc-600">
          {isLoggingOut 
            ? 'Logging out...' 
            : `Are you sure you want to log out, ${user?.name || 'User'}?`}
        </Text>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <Text className="text-sm text-red-800 dark:text-red-200">{error}</Text>
        </div>
      )}

      {!isLoggingOut && (
        <div className="flex flex-col gap-4">
          <Button onClick={handleLogout} className="w-full">
            Log Out
          </Button>
          <Button onClick={() => router.push('/')} className="w-full" outline>
            Cancel
          </Button>
        </div>
      )}

      {isLoggingOut && (
        <div className="flex items-center justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-400"></div>
        </div>
      )}
    </div>
  )
}

