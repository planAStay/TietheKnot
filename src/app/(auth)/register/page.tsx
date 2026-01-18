'use client'

import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Field, Label } from '@/components/fieldset'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    phoneNumber: '',
    phoneCountryCode: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await register({
        username: formData.username,
        email: formData.email,
        name: formData.name,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        phoneCountryCode: formData.phoneCountryCode,
      })
      // Redirect to subscription selection page after registration
      router.push('/subscription')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-6 sm:gap-8">
      <div className="text-center">
        <p className="text-lg text-text/70 mb-2">Welcome!</p>
        <h1 className="text-3xl font-semibold text-text">
          Sign up for TieTheKnot
        </h1>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <Text className="text-sm text-red-700">{error}</Text>
        </div>
      )}

      <Field>
        <Label>Username</Label>
        <Input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username"
        />
      </Field>

      <Field>
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
      </Field>

      <Field>
        <Label>Full name</Label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />
      </Field>

      <Field>
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          minLength={6}
        />
      </Field>

      <Field>
        <Label>Phone Number</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="text"
            name="phoneCountryCode"
            value={formData.phoneCountryCode}
            onChange={handleChange}
            placeholder="+94"
            autoComplete="tel-country-code"
            required
          />
          <Input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="771234567"
            autoComplete="tel"
            required
          />
        </div>
      </Field>

      <Button type="submit" color="accent" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
      <Text className="text-center">
        Already have an account?{' '}
        <TextLink href="/login">
          <Strong>Sign in</Strong>
        </TextLink>
      </Text>
    </form>
  )
}
