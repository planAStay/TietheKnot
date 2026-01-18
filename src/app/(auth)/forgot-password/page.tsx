'use client'

import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Text } from '@/components/text'
import { forgotPassword, type ForgotPasswordRequest } from '@/lib/api/auth'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      const data: ForgotPasswordRequest = { email }
      await forgotPassword(data)
      setSuccess(true)
      setEmail('') // Clear the form
    } catch (err) {
      console.error('Forgot password error:', err)
      setError(err instanceof Error ? err.message : 'Failed to send reset link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Heading level={1} className="text-3xl font-bold">
            Forgot Password?
          </Heading>
          <Text className="mt-2 text-zinc-600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </Text>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <Text className="text-sm text-red-700">{error}</Text>
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3">
              <Text className="text-sm text-green-700 font-medium mb-2">
                ✓ Check your email
              </Text>
              <Text className="text-sm text-green-600">
                If an account exists with this email, you will receive a password reset link shortly.
              </Text>
            </div>
            
            <div className="text-center">
              <Link href="/login" className="text-sm text-pink-500 hover:text-pink-600 font-medium">
                ← Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
