'use client'

import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Text } from '@/components/text'
import { resetPassword, type ResetPasswordRequest } from '@/lib/api/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate token exists
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.')
      return
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setIsLoading(true)

    try {
      const data: ResetPasswordRequest = { token, newPassword }
      await resetPassword(data)
      
      // Redirect to login with success message
      router.push('/login?reset=success')
    } catch (err) {
      console.error('Reset password error:', err)
      setError(err instanceof Error ? err.message : 'Failed to reset password. The link may be invalid or expired.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 mb-4">
          <Text className="text-sm text-red-700">
            Invalid or missing reset token. Please request a new password reset link.
          </Text>
        </div>
        <Button onClick={() => router.push('/forgot-password')}>
          Request New Link
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <Text className="text-sm text-red-700">{error}</Text>
        </div>
      )}

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-700 mb-1">
          New Password
        </label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Enter your new password"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 mb-1">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Confirm your new password"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Heading level={1} className="text-3xl font-bold">
            Reset Your Password
          </Heading>
          <Text className="mt-2 text-zinc-600">
            Enter your new password below.
          </Text>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}

