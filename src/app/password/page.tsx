'use client'

import { Logo } from '@/app/logo'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { useTheme } from '@/lib/theme-context'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PasswordPage() {
  const { setTheme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Force light theme on this page
  useEffect(() => {
    setTheme('light')
  }, [setTheme])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Redirect to home page after successful authentication
        // Team members can then navigate to any page they want
        router.push('/')
        router.refresh()
      } else {
        setError(data.error || 'Incorrect password. Please try again.')
        setPassword('')
      }
    } catch (err) {
      console.error('Password validation error:', err)
      setError('An error occurred. Please try again.')
      setPassword('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-text">
      {/* Background matching get-started page */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-background" />
        
        {/* Subtle decorative circles */}
        <div 
          className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-primary/5"
          style={{
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute -right-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-accent/5"
          style={{
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
        <div 
          className="absolute -bottom-1/4 left-1/3 h-[700px] w-[700px] rounded-full bg-secondary/5"
          style={{
            animation: 'float 22s ease-in-out infinite',
            animationDelay: '-5s',
          }}
        />
        
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <div className="relative max-w-md w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg sm:p-12">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Logo
              priority
              className="h-12 w-auto drop-shadow-[0_10px_40px_rgba(0,0,0,0.35)] md:h-16"
            />
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <Heading level={1} className="text-2xl font-semibold text-text mb-2">
              Testing Access
            </Heading>
            <Text className="text-sm text-text/70">
              Enter the password to access the full website
            </Text>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <Text className="text-sm text-red-800">{error}</Text>
            </div>
          )}

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoFocus
                disabled={isSubmitting}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full"
              color="primary"
            >
              {isSubmitting ? 'Authenticating...' : 'Access Website'}
            </Button>
          </form>

          {/* Back to public page */}
          <div className="mt-6 text-center">
            <a
              href="/get-started"
              className="text-sm text-text/60 hover:text-text/80 transition-colors"
            >
              Back to public page
            </a>
          </div>
        </div>
      </div>

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }
      `}</style>
    </div>
  )
}

