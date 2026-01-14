'use client'

import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Text } from '@/components/text'
import { useAuth } from '@/lib/auth-context'
import { getCurrentUser, updateUser, changePassword, type UserUpdateRequest, type ChangePasswordRequest } from '@/lib/api/auth'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const { user, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  
  const [formData, setFormData] = useState<UserUpdateRequest>({
    name: '',
    phoneNumber: '',
    phoneCountryCode: '',
    profilePicture: '',
  })

  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
  })

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadUserData()
  }, [authLoading, isAuthenticated, router])

  const loadUserData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await getCurrentUser()
      setFormData({
        name: userData.name || '',
        phoneNumber: userData.phoneNumber || '',
        phoneCountryCode: userData.phoneCountryCode || '',
        profilePicture: userData.profilePicture || '',
      })
    } catch (err) {
      console.error('Error loading user data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load user data.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSaving(true)

    try {
      await updateUser(formData)
      setSuccess(true)
      // Refresh user data in auth context
      await refreshUser()
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error updating user:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setPasswordSuccess(false)
    setIsChangingPassword(true)

    try {
      await changePassword(passwordData)
      setPasswordSuccess(true)
      setShowPasswordForm(false)
      setPasswordData({ currentPassword: '', newPassword: '' })
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err) {
      console.error('Error changing password:', err)
      setError(err instanceof Error ? err.message : 'Failed to change password.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="container py-10">
        <Text>Loading...</Text>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-10">
      <Heading level={1} className="text-3xl font-semibold mb-6">
        Account Settings
      </Heading>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <Text className="text-sm text-red-700">{error}</Text>
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
          <Text className="text-sm text-green-700">Profile updated successfully!</Text>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Username - Read Only */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-zinc-700 mb-1">
            Username
          </label>
          <Input
            id="username"
            type="text"
            value={user.username || ''}
            disabled
            className="bg-zinc-50 cursor-not-allowed"
          />
          <Text className="mt-1 text-xs text-zinc-500">Username cannot be changed</Text>
        </div>

        {/* Email - Read Only */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={user.email || ''}
            disabled
            className="bg-zinc-50 cursor-not-allowed"
          />
          <Text className="mt-1 text-xs text-zinc-500">Email cannot be changed</Text>
        </div>

        {/* Name - Editable */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            maxLength={100}
          />
        </div>

        {/* Phone Country Code */}
        <div>
          <label htmlFor="phoneCountryCode" className="block text-sm font-medium text-zinc-700 mb-1">
            Phone Country Code
          </label>
          <Input
            id="phoneCountryCode"
            type="text"
            value={formData.phoneCountryCode}
            onChange={(e) => setFormData({ ...formData, phoneCountryCode: e.target.value })}
            placeholder="+94"
            maxLength={10}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-zinc-700 mb-1">
            Phone Number
          </label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="77 123 4567"
            maxLength={20}
          />
        </div>

        {/* Profile Picture URL */}
        <div>
          <label htmlFor="profilePicture" className="block text-sm font-medium text-zinc-700 mb-1">
            Profile Picture URL
          </label>
          <Input
            id="profilePicture"
            type="url"
            value={formData.profilePicture}
            onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
            placeholder="https://example.com/profile.jpg"
            maxLength={500}
          />
          <Text className="mt-1 text-xs text-zinc-500">URL to your profile picture</Text>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            outline
            onClick={() => loadUserData()}
            disabled={isSaving}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      {/* Change Password Section */}
      <div className="mt-12 pt-8 border-t border-zinc-200">
        <Heading level={2} className="text-2xl font-semibold mb-4">
          Change Password
        </Heading>

        {!showPasswordForm ? (
          <div>
            <Text className="mb-4 text-zinc-600">Click the button below to change your password.</Text>
            <Button
              type="button"
              onClick={() => setShowPasswordForm(true)}
              disabled={isChangingPassword}
            >
              Change Password
            </Button>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="max-w-2xl space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-zinc-700 mb-1">
                Current Password <span className="text-red-500">*</span>
              </label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                placeholder="Enter your current password"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
                placeholder="Enter your new password (min. 6 characters)"
              />
              <Text className="mt-1 text-xs text-zinc-500">Password must be at least 6 characters long</Text>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                outline
                onClick={() => {
                  setShowPasswordForm(false)
                  setPasswordData({ currentPassword: '', newPassword: '' })
                  setError(null)
                }}
                disabled={isChangingPassword}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

