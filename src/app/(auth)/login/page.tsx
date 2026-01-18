'use client'

import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const reset = searchParams.get('reset')
    if (reset === 'success') {
      setSuccess('Password reset successfully! You can now log in with your new password.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login({ emailOrUsername, password })
      // Redirect to homepage after successful login
      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid w-full grid-cols-1 gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-text">
          Log in to TieTheKnot
        </h1>
      </div>

      {success && (
        <div className="rounded-md bg-secondary/10 p-4 border border-secondary/30">
          <Text className="text-sm text-secondary">{success}</Text>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <Text className="text-sm text-red-700">{error}</Text>
        </div>
      )}

      <Field>
        <Label>Email or Username</Label>
        <Input
          type="text"
          name="emailOrUsername"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          required
          autoComplete="username"
        />
      </Field>
      <Field>
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </Field>
      <div className="flex flex-wrap items-center justify-between gap-1">
        <CheckboxField>
          <Checkbox
            name="remember"
            checked={remember}
            onChange={(checked) => setRemember(checked)}
          />
          <Label>Remember me</Label>
        </CheckboxField>
        <TextLink href="/forgot-password">
          <span className="text-sm font-medium">Forgot password?</span>
        </TextLink>
      </div>
      <Button type="submit" color="accent" className="w-full" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
      <Text className="text-center">
        Don&apos;t have an account?{' '}
        <TextLink href="/register">
          <Strong>Sign up</Strong>
        </TextLink>
      </Text>
    </form>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
